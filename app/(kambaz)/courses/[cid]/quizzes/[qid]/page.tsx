"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { Quiz } from "../../../client";
import { updateQuiz as updateQuizAction } from "../reducer";
import { formatDate, totalPoints } from "../utils";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const canEdit =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const q = await client.findQuizById(qid);
        setQuiz(q);
      } catch {
        setQuiz(null);
      }
    };
    load();
  }, [qid]);

  if (!quiz) {
    return <div className="p-3">Quiz not found.</div>;
  }

  const togglePublish = async () => {
    if (!canEdit) return;
    const updated = await client.updateQuiz({
      ...quiz,
      published: !quiz.published,
    });
    setQuiz(updated);
    dispatch(updateQuizAction(updated));
  };

  const row = (label: string, value: React.ReactNode) => (
    <tr>
      <td className="text-sm-end fw-semibold pe-3" style={{ width: "35%" }}>
        {label}
      </td>
      <td>{value}</td>
    </tr>
  );

  return (
    <div id="wd-quiz-details" className="container">
      <div className="d-flex justify-content-end mb-3">
        {canEdit ? (
          <>
            <Button
              variant="secondary"
              className="me-2"
              onClick={() =>
                router.push(`/courses/${cid}/quizzes/${qid}/preview`)
              }
              id="wd-preview-quiz-btn"
            >
              Preview
            </Button>
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
              id="wd-edit-quiz-btn"
            >
              Edit
            </Button>
            <Button
              variant={quiz.published ? "outline-success" : "success"}
              onClick={togglePublish}
              id="wd-toggle-publish-btn"
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>
          </>
        ) : (
          <Button
            variant="danger"
            size="lg"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/preview`)}
            id="wd-start-quiz-btn"
            disabled={!quiz.published}
          >
            Start Quiz
          </Button>
        )}
      </div>

      <hr />

      <h2 className="mb-3">{quiz.title}</h2>

      <Table borderless>
        <tbody>
          {row("Quiz Type", quiz.quizType)}
          {row("Points", totalPoints(quiz))}
          {row("Assignment Group", quiz.assignmentGroup)}
          {row("Shuffle Answers", quiz.shuffleAnswers ? "Yes" : "No")}
          {row(
            "Time Limit",
            quiz.timeLimitEnabled ? `${quiz.timeLimit} Minutes` : "No Time Limit"
          )}
          {row("Multiple Attempts", quiz.multipleAttempts ? "Yes" : "No")}
          {quiz.multipleAttempts &&
            row("How Many Attempts", String(quiz.howManyAttempts))}
          {row("View Responses", "Always")}
          {row("Show Correct Answers", quiz.showCorrectAnswers || "-")}
          {row("One Question at a Time", quiz.oneQuestionAtATime ? "Yes" : "No")}
          {row(
            "Require Respondus LockDown Browser",
            "No"
          )}
          {row("Required to View Quiz Results", "No")}
          {row("Webcam Required", quiz.webcamRequired ? "Yes" : "No")}
          {row(
            "Lock Questions After Answering",
            quiz.lockQuestionsAfterAnswering ? "Yes" : "No"
          )}
          {quiz.accessCode ? row("Access Code", quiz.accessCode) : null}
        </tbody>
      </Table>

      <Table bordered responsive className="mt-4">
        <thead className="table-light">
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formatDate(quiz.dueDate) || "-"}</td>
            <td>Everyone</td>
            <td>{formatDate(quiz.availableDate) || "-"}</td>
            <td>{formatDate(quiz.untilDate) || "-"}</td>
          </tr>
        </tbody>
      </Table>

      {quiz.description && (
        <div className="mt-4">
          <h5>Description</h5>
          <div
            className="border rounded p-3"
            dangerouslySetInnerHTML={{ __html: quiz.description }}
          />
        </div>
      )}
    </div>
  );
}
