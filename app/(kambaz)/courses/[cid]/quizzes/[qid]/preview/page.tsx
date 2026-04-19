"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  FormCheck,
  FormControl,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../../../client";
import {
  Question,
  Quiz,
  QuizAnswer,
  QuizAttempt,
} from "../../../../client";

type AnswerMap = Record<string, Partial<QuizAnswer>>;

function questionPrompt(q: Question) {
  return (
    <div
      className="mb-3"
      dangerouslySetInnerHTML={{ __html: q.questionHtml || "" }}
    />
  );
}

export default function QuizPreviewPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const isFaculty =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const q = await client.findQuizById(qid);
        setQuiz(q);
        if (currentUser) {
          const attempts = await client.findAttempts(qid);
          setAttemptCount(attempts.length);
          if (
            !isFaculty &&
            attempts.length > 0 &&
            !(
              q.multipleAttempts &&
              attempts.length < (q.howManyAttempts || 1)
            )
          ) {
            setResult(attempts[attempts.length - 1]);
          }
        }
      } catch {
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [qid, currentUser, isFaculty]);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  if (loading) return <div className="p-3">Loading...</div>;
  if (!quiz) return <div className="p-3">Quiz not found.</div>;

  const attemptsAllowed = quiz.multipleAttempts ? quiz.howManyAttempts : 1;
  const attemptsRemaining = Math.max(0, attemptsAllowed - attemptCount);

  const setAnswer = (questionId: string, patch: Partial<QuizAnswer>) =>
    setAnswers((a) => ({ ...a, [questionId]: { ...a[questionId], ...patch } }));

  const current = questions[idx];

  const submit = async () => {
    const payload: QuizAnswer[] = questions.map((q) => ({
      questionId: q._id,
      type: q.type,
      selectedChoiceIds: answers[q._id]?.selectedChoiceIds || [],
      booleanAnswer: answers[q._id]?.booleanAnswer,
      textAnswer: answers[q._id]?.textAnswer || "",
    }));
    const attempt = await client.submitQuizAttempt(qid, payload);
    setResult(attempt);
    setAttemptCount((n) => n + 1);
  };

  const retake = () => {
    setResult(null);
    setAnswers({});
    setIdx(0);
  };

  if (result) {
    const byQuestion = new Map(
      result.answers.map((a) => [a.questionId, a])
    );
    return (
      <div className="container">
        <div className="d-flex align-items-center mb-3">
          <h3 className="mb-0 me-auto">{quiz.title} — Results</h3>
          {isFaculty && (
            <Button
              variant="secondary"
              className="me-2"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/edit/questions`)
              }
            >
              Edit Quiz
            </Button>
          )}
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/courses/${cid}/quizzes`)}
          >
            Back to Quizzes
          </Button>
        </div>

        <Alert variant="info">
          You scored <b>{result.score}</b> out of <b>{result.totalPoints}</b>{" "}
          ({result.totalPoints > 0
            ? Math.round((result.score / result.totalPoints) * 100)
            : 0}
          %).
        </Alert>

        {!isFaculty && (
          <div className="mb-3">
            {quiz.multipleAttempts && attemptsRemaining > 0 ? (
              <Button variant="danger" onClick={retake}>
                Retake Quiz ({attemptsRemaining} left)
              </Button>
            ) : (
              <span className="text-muted">
                {quiz.multipleAttempts
                  ? "No attempts remaining."
                  : "Only one attempt allowed."}
              </span>
            )}
          </div>
        )}
        {isFaculty && (
          <div className="mb-3">
            <Button variant="danger" onClick={retake}>
              Take Preview Again
            </Button>
          </div>
        )}

        {questions.map((q, i) => {
          const ans = byQuestion.get(q._id);
          const correct = ans?.correct;
          return (
            <Card
              key={q._id}
              className="mb-3"
              border={correct ? "success" : "danger"}
            >
              <Card.Header className="d-flex align-items-center">
                <b className="me-auto">
                  Q{i + 1}. {q.title}
                </b>
                <Badge bg={correct ? "success" : "danger"}>
                  {ans?.pointsEarned ?? 0} / {q.points}
                </Badge>
              </Card.Header>
              <Card.Body>
                {questionPrompt(q)}
                {q.type === "MULTIPLE_CHOICE" && (
                  <ul className="list-unstyled mb-0">
                    {q.choices.map((c) => {
                      const wasSelected = ans?.selectedChoiceIds?.includes(
                        c._id
                      );
                      return (
                        <li key={c._id}>
                          <span
                            className={
                              c.correct
                                ? "text-success fw-bold"
                                : wasSelected
                                ? "text-danger"
                                : ""
                            }
                          >
                            {wasSelected ? "● " : "○ "}
                            {c.text}
                            {c.correct && " (correct)"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {q.type === "TRUE_FALSE" && (
                  <div>
                    Your answer:{" "}
                    <b>
                      {typeof ans?.booleanAnswer === "boolean"
                        ? ans.booleanAnswer
                          ? "True"
                          : "False"
                        : "(no answer)"}
                    </b>
                    <br />
                    Correct answer:{" "}
                    <b>{q.correctAnswer ? "True" : "False"}</b>
                  </div>
                )}
                {q.type === "FILL_IN_BLANK" && (
                  <div>
                    Your answer: <b>{ans?.textAnswer || "(blank)"}</b>
                    <br />
                    Accepted: {q.blanks.join(", ")}
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    );
  }

  if (!isFaculty && attemptsRemaining === 0) {
    return (
      <div className="container">
        <Alert variant="warning">
          You have no attempts remaining for this quiz.
        </Alert>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container">
        <Alert variant="warning">
          This quiz has no questions yet.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center mb-3">
        <h3 className="mb-0 me-auto">
          {quiz.title}{" "}
          {isFaculty && (
            <Badge bg="warning" text="dark" className="ms-2">
              Faculty Preview
            </Badge>
          )}
        </h3>
        {isFaculty && (
          <Button
            variant="outline-secondary"
            className="me-2"
            onClick={() =>
              router.push(`/courses/${cid}/quizzes/${qid}/edit/questions`)
            }
          >
            Edit Quiz
          </Button>
        )}
        {!isFaculty && (
          <span className="text-muted">
            Attempt {attemptCount + 1} of {attemptsAllowed}
          </span>
        )}
      </div>

      <Row>
        <Col md={3}>
          <ListGroup className="mb-3">
            {questions.map((q, i) => (
              <ListGroupItem
                key={q._id}
                action
                active={i === idx}
                onClick={() => setIdx(i)}
              >
                Question {i + 1}
              </ListGroupItem>
            ))}
          </ListGroup>
          <Button
            variant="danger"
            className="w-100"
            onClick={submit}
          >
            Submit Quiz
          </Button>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <b className="me-auto">
                Question {idx + 1}. {current.title}
              </b>
              <Badge bg="secondary">{current.points} pts</Badge>
            </Card.Header>
            <Card.Body>
              {questionPrompt(current)}

              {current.type === "MULTIPLE_CHOICE" && (
                <div>
                  {current.choices.map((c) => {
                    const selected =
                      answers[current._id]?.selectedChoiceIds?.includes(
                        c._id
                      ) ?? false;
                    return (
                      <FormCheck
                        key={c._id}
                        type="checkbox"
                        id={`preview-${current._id}-${c._id}`}
                        label={c.text || "(empty option)"}
                        checked={selected}
                        onChange={(e) => {
                          const prev =
                            answers[current._id]?.selectedChoiceIds || [];
                          const next = e.target.checked
                            ? [...prev, c._id]
                            : prev.filter((id) => id !== c._id);
                          setAnswer(current._id, { selectedChoiceIds: next });
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {current.type === "TRUE_FALSE" && (
                <div>
                  <FormCheck
                    type="radio"
                    id={`preview-${current._id}-true`}
                    name={`preview-${current._id}`}
                    label="True"
                    checked={answers[current._id]?.booleanAnswer === true}
                    onChange={() =>
                      setAnswer(current._id, { booleanAnswer: true })
                    }
                  />
                  <FormCheck
                    type="radio"
                    id={`preview-${current._id}-false`}
                    name={`preview-${current._id}`}
                    label="False"
                    checked={answers[current._id]?.booleanAnswer === false}
                    onChange={() =>
                      setAnswer(current._id, { booleanAnswer: false })
                    }
                  />
                </div>
              )}

              {current.type === "FILL_IN_BLANK" && (
                <FormControl
                  placeholder="Your answer"
                  value={answers[current._id]?.textAnswer || ""}
                  onChange={(e) =>
                    setAnswer(current._id, { textAnswer: e.target.value })
                  }
                />
              )}
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                disabled={idx === 0}
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline-secondary"
                disabled={idx === questions.length - 1}
                onClick={() =>
                  setIdx((i) => Math.min(questions.length - 1, i + 1))
                }
              >
                Next
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
