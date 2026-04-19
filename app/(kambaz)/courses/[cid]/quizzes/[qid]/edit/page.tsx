"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Col,
  Form,
  FormCheck,
  FormControl,
  FormLabel,
  FormSelect,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import * as client from "../../../../client";
import { Quiz } from "../../../../client";
import { updateQuiz as updateQuizAction } from "../../reducer";
import RichTextEditor from "../../RichTextEditor";
import { totalPoints } from "../../utils";

export default function QuizEditDetailsPage() {
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

  if (!canEdit) {
    return <div className="p-3">You do not have permission to edit this quiz.</div>;
  }

  const saveQuiz = async (options?: { publish?: boolean; navigateTo?: string }) => {
    const payload = {
      ...quiz,
      published: options?.publish ? true : quiz.published,
    };
    const updated = await client.updateQuiz(payload);
    dispatch(updateQuizAction(updated));
    if (options?.navigateTo) {
      router.push(options.navigateTo);
    }
  };

  const onSave = () =>
    saveQuiz({ navigateTo: `/courses/${cid}/quizzes/${qid}` });
  const onSaveAndPublish = () =>
    saveQuiz({ publish: true, navigateTo: `/courses/${cid}/quizzes` });
  const onCancel = () => router.push(`/courses/${cid}/quizzes`);

  return (
    <Form>
      <Form.Group as={Row} className="mb-3" controlId="wd-title">
        <FormLabel column sm={3} className="text-sm-end">
          Quiz Title
        </FormLabel>
        <Col sm={9}>
          <FormControl
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-4" controlId="wd-description">
        <FormLabel column sm={3} className="text-sm-end">
          Quiz Instructions
        </FormLabel>
        <Col sm={9}>
          <RichTextEditor
            value={quiz.description}
            onChange={(html) => setQuiz({ ...quiz, description: html })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="wd-quiz-type">
        <FormLabel column sm={3} className="text-sm-end">
          Quiz Type
        </FormLabel>
        <Col sm={9}>
          <FormSelect
            value={quiz.quizType}
            onChange={(e) =>
              setQuiz({ ...quiz, quizType: e.target.value as Quiz["quizType"] })
            }
          >
            <option value="Graded Quiz">Graded Quiz</option>
            <option value="Practice Quiz">Practice Quiz</option>
            <option value="Graded Survey">Graded Survey</option>
            <option value="Ungraded Survey">Ungraded Survey</option>
          </FormSelect>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="wd-points">
        <FormLabel column sm={3} className="text-sm-end">
          Points
        </FormLabel>
        <Col sm={9}>
          <FormControl
            type="number"
            value={totalPoints(quiz)}
            disabled
            readOnly
          />
          <Form.Text className="text-muted">
            Sum of points of all questions.
          </Form.Text>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="wd-group">
        <FormLabel column sm={3} className="text-sm-end">
          Assignment Group
        </FormLabel>
        <Col sm={9}>
          <FormSelect
            value={quiz.assignmentGroup}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                assignmentGroup: e.target.value as Quiz["assignmentGroup"],
              })
            }
          >
            <option value="QUIZZES">QUIZZES</option>
            <option value="EXAMS">EXAMS</option>
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="PROJECT">PROJECT</option>
          </FormSelect>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-4">
        <FormLabel column sm={3} className="text-sm-end">
          Options
        </FormLabel>
        <Col sm={9}>
          <div className="border rounded p-3">
            <FormCheck
              type="checkbox"
              id="wd-shuffle-answers"
              label="Shuffle Answers"
              checked={quiz.shuffleAnswers}
              onChange={(e) =>
                setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
              }
            />

            <Row className="align-items-center mt-3">
              <Col sm="auto">
                <FormCheck
                  type="checkbox"
                  id="wd-time-limit-enabled"
                  label="Time Limit"
                  checked={quiz.timeLimitEnabled}
                  onChange={(e) =>
                    setQuiz({ ...quiz, timeLimitEnabled: e.target.checked })
                  }
                />
              </Col>
              <Col sm={4}>
                <InputGroup>
                  <FormControl
                    type="number"
                    min={1}
                    value={quiz.timeLimit}
                    disabled={!quiz.timeLimitEnabled}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        timeLimit: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                  <InputGroup.Text>Minutes</InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>

            <Row className="align-items-center mt-3">
              <Col sm="auto">
                <FormCheck
                  type="checkbox"
                  id="wd-multiple-attempts"
                  label="Allow Multiple Attempts"
                  checked={quiz.multipleAttempts}
                  onChange={(e) =>
                    setQuiz({ ...quiz, multipleAttempts: e.target.checked })
                  }
                />
              </Col>
              <Col sm={4}>
                <InputGroup>
                  <InputGroup.Text>How many</InputGroup.Text>
                  <FormControl
                    type="number"
                    min={1}
                    value={quiz.howManyAttempts}
                    disabled={!quiz.multipleAttempts}
                    onChange={(e) =>
                      setQuiz({
                        ...quiz,
                        howManyAttempts: parseInt(e.target.value, 10) || 1,
                      })
                    }
                  />
                </InputGroup>
              </Col>
            </Row>

            <FormCheck
              className="mt-3"
              type="checkbox"
              id="wd-one-question-at-a-time"
              label="Show One Question at a Time"
              checked={quiz.oneQuestionAtATime}
              onChange={(e) =>
                setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })
              }
            />
            <FormCheck
              className="mt-2"
              type="checkbox"
              id="wd-webcam-required"
              label="Webcam Required"
              checked={quiz.webcamRequired}
              onChange={(e) =>
                setQuiz({ ...quiz, webcamRequired: e.target.checked })
              }
            />
            <FormCheck
              className="mt-2"
              type="checkbox"
              id="wd-lock-questions"
              label="Lock Questions After Answering"
              checked={quiz.lockQuestionsAfterAnswering}
              onChange={(e) =>
                setQuiz({
                  ...quiz,
                  lockQuestionsAfterAnswering: e.target.checked,
                })
              }
            />
          </div>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="wd-show-correct-answers">
        <FormLabel column sm={3} className="text-sm-end">
          Show Correct Answers
        </FormLabel>
        <Col sm={9}>
          <FormSelect
            value={quiz.showCorrectAnswers}
            onChange={(e) =>
              setQuiz({ ...quiz, showCorrectAnswers: e.target.value })
            }
          >
            <option value="Immediately">Immediately</option>
            <option value="After Last Attempt">After Last Attempt</option>
            <option value="Never">Never</option>
          </FormSelect>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="wd-access-code">
        <FormLabel column sm={3} className="text-sm-end">
          Access Code
        </FormLabel>
        <Col sm={9}>
          <FormControl
            value={quiz.accessCode}
            onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-4">
        <FormLabel column sm={3} className="text-sm-end">
          Assign
        </FormLabel>
        <Col sm={9}>
          <div className="border rounded p-3">
            <Form.Group className="mb-3" controlId="wd-due-date">
              <FormLabel>Due</FormLabel>
              <FormControl
                type="date"
                value={quiz.dueDate}
                onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Form.Group as={Col} md={6} controlId="wd-available-from">
                <FormLabel>Available from</FormLabel>
                <FormControl
                  type="date"
                  value={quiz.availableDate}
                  onChange={(e) =>
                    setQuiz({ ...quiz, availableDate: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group as={Col} md={6} controlId="wd-available-until">
                <FormLabel>Until</FormLabel>
                <FormControl
                  type="date"
                  value={quiz.untilDate}
                  onChange={(e) =>
                    setQuiz({ ...quiz, untilDate: e.target.value })
                  }
                />
              </Form.Group>
            </Row>
          </div>
        </Col>
      </Form.Group>

      <hr />
      <div className="d-flex justify-content-end">
        <Button
          variant="secondary"
          type="button"
          className="me-2"
          id="wd-cancel-quiz-btn"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="outline-danger"
          type="button"
          className="me-2"
          id="wd-save-and-publish-btn"
          onClick={onSaveAndPublish}
        >
          Save & Publish
        </Button>
        <Button
          variant="danger"
          type="button"
          id="wd-save-quiz-btn"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
