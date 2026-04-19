"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Button } from "react-bootstrap";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../store";
import * as client from "../../../../../client";
import { Question, Quiz } from "../../../../../client";
import { updateQuiz as updateQuizAction } from "../../../reducer";
import { totalPoints } from "../../../utils";
import QuestionEditor from "./QuestionEditor";

const typeLabels: Record<Question["type"], string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  TRUE_FALSE: "True / False",
  FILL_IN_BLANK: "Fill in the Blank",
};

export default function QuizQuestionsEditPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((s: RootState) => s.accountReducer);
  const canEdit =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const q = await client.findQuizById(qid);
      setQuiz(q);
    } catch {
      setQuiz(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qid]);

  if (!quiz) return <div className="p-3">Quiz not found.</div>;
  if (!canEdit)
    return <div className="p-3">You do not have permission to edit this quiz.</div>;

  const onNewQuestion = async () => {
    const newQ = await client.addQuestion(qid, {
      type: "MULTIPLE_CHOICE",
      title: "New Question",
      questionHtml: "",
      points: 1,
      choices: [],
      correctAnswer: true,
      blanks: [],
    });
    await load();
    setEditingId(newQ._id);
  };

  const onSaveQuestion = async (
    updated: Question,
    options?: { publish?: boolean }
  ) => {
    const savedQuiz = await client.updateQuestion(qid, updated);
    setQuiz(savedQuiz);
    dispatch(updateQuizAction(savedQuiz));
    if (options?.publish) {
      const publishedQuiz = await client.updateQuiz({
        ...savedQuiz,
        published: true,
      });
      setQuiz(publishedQuiz);
      dispatch(updateQuizAction(publishedQuiz));
    }
    setEditingId(null);
  };

  const onCancel = async () => {
    await load();
    setEditingId(null);
  };

  const onDelete = async (questionId: string) => {
    if (!window.confirm("Delete this question?")) return;
    await client.deleteQuestion(qid, questionId);
    await load();
  };

  const onSaveAll = () => {
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };
  const onSaveAndPublishAll = async () => {
    const updated = await client.updateQuiz({ ...quiz, published: true });
    dispatch(updateQuizAction(updated));
    router.push(`/courses/${cid}/quizzes`);
  };
  const onCancelAll = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h4 className="mb-0 me-auto">Questions</h4>
        <Badge bg="secondary" className="me-3">
          {totalPoints(quiz)} pts
        </Badge>
        <Button variant="outline-secondary" onClick={onNewQuestion}>
          + New Question
        </Button>
      </div>

      {quiz.questions.length === 0 && editingId === null && (
        <div className="text-muted text-center p-4 border rounded">
          No questions yet. Click + New Question to add one.
        </div>
      )}

      {quiz.questions.map((q) => {
        if (editingId === q._id) {
          return (
            <QuestionEditor
              key={q._id}
              question={q}
              onCancel={onCancel}
              onSave={(updated) => onSaveQuestion(updated)}
              onSaveAndPublish={(updated) =>
                onSaveQuestion(updated, { publish: true })
              }
            />
          );
        }
        return (
          <div
            key={q._id}
            className="border rounded p-3 mb-3 d-flex align-items-start"
          >
            <div style={{ flexGrow: 1 }}>
              <div className="fw-bold">
                {q.title}{" "}
                <Badge bg="light" text="dark" className="ms-2">
                  {typeLabels[q.type]}
                </Badge>
                <Badge bg="secondary" className="ms-2">
                  {q.points} pts
                </Badge>
              </div>
              <div
                className="text-muted mt-1"
                dangerouslySetInnerHTML={{
                  __html: q.questionHtml || "<em>(no prompt)</em>",
                }}
              />
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              className="me-2"
              onClick={() => setEditingId(q._id)}
            >
              <FaPencilAlt />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(q._id)}
            >
              <FaTrash />
            </Button>
          </div>
        );
      })}

      <hr />
      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onCancelAll}>
          Cancel
        </Button>
        <Button
          variant="outline-danger"
          className="me-2"
          onClick={onSaveAndPublishAll}
        >
          Save & Publish
        </Button>
        <Button variant="danger" onClick={onSaveAll}>
          Save
        </Button>
      </div>
    </div>
  );
}
