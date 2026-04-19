"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dropdown,
  ListGroup,
  ListGroupItem,
  FormControl,
  InputGroup,
  Button,
} from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { BsGripVertical, BsSearch } from "react-icons/bs";
import { FaPlus, FaBan } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import { IoEllipsisVertical } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import * as client from "../../client";
import { Quiz, QuizAttempt } from "../../client";
import {
  setQuizzes,
  addQuiz as addQuizAction,
  updateQuiz as updateQuizAction,
  deleteQuiz as deleteQuizAction,
} from "./reducer";
import {
  formatDate,
  getAvailability,
  sortQuizzesByAvailable,
  totalPoints,
} from "./utils";

export default function QuizzesPage() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const canEdit =
    currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [search, setSearch] = useState("");
  const [studentAttempts, setStudentAttempts] = useState<
    Record<string, QuizAttempt | null>
  >({});

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!cid) return;
      const remote = await client.findQuizzesForCourse(cid);
      dispatch(setQuizzes(remote));
      if (currentUser && currentUser.role === "STUDENT") {
        const entries = await Promise.all(
          remote.map(async (q) => {
            try {
              const a = await client.findLatestAttempt(q._id);
              return [q._id, a] as const;
            } catch {
              return [q._id, null] as const;
            }
          })
        );
        setStudentAttempts(Object.fromEntries(entries));
      }
    };
    fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, currentUser?._id]);

  const onAddQuiz = async () => {
    if (!cid || !canEdit) return;
    const newQuiz = await client.createQuizForCourse(cid, {
      title: "New Quiz",
    });
    dispatch(addQuizAction(newQuiz));
    router.push(`/courses/${cid}/quizzes/${newQuiz._id}/edit`);
  };

  const onDelete = async (quizId: string) => {
    if (!canEdit) return;
    if (!window.confirm("Delete this quiz?")) return;
    await client.deleteQuiz(quizId);
    dispatch(deleteQuizAction(quizId));
  };

  const togglePublish = async (quiz: Quiz) => {
    if (!canEdit) return;
    const updated = await client.updateQuiz({
      ...quiz,
      published: !quiz.published,
    });
    dispatch(updateQuizAction(updated));
  };

  const filtered = sortQuizzesByAvailable(
    quizzes.filter((q) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div id="wd-quizzes">
      <div
        id="wd-quizzes-controls"
        className="text-nowrap d-flex align-items-center mb-4"
      >
        <InputGroup className="w-50 me-auto">
          <InputGroupText className="bg-white">
            <BsSearch />
          </InputGroupText>
          <FormControl
            id="wd-search-quiz"
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        {canEdit && (
          <Button
            variant="danger"
            size="lg"
            id="wd-add-quiz-btn"
            onClick={onAddQuiz}
          >
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Quiz
          </Button>
        )}
      </div>

      <ListGroup className="rounded-0" id="wd-quizzes-list">
        <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
          <div className="p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            Assignment Quizzes
          </div>
          {filtered.length === 0 ? (
            <div className="p-4 text-muted text-center">
              {canEdit
                ? "No quizzes yet. Click + Quiz to add your first quiz."
                : "No quizzes are available for this course yet."}
            </div>
          ) : (
            <ListGroup className="rounded-0">
              {filtered.map((quiz) => {
                const availability = getAvailability(quiz);
                const attempt = studentAttempts[quiz._id];
                return (
                  <ListGroupItem
                    key={quiz._id}
                    className="p-3 ps-1 d-flex align-items-center"
                    style={{ borderLeft: "4px solid green" }}
                  >
                    <BsGripVertical className="me-2 fs-3" />
                    <HiOutlineDocumentText className="me-3 fs-3 text-success" />
                    <div style={{ flexGrow: 1 }}>
                      <Link
                        href={`/courses/${cid}/quizzes/${quiz._id}`}
                        className="wd-quiz-link text-dark fw-bold text-decoration-none"
                      >
                        {quiz.title}
                      </Link>
                      <br />
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.85rem" }}
                      >
                        <b
                          className={
                            availability.code === "available"
                              ? "text-success"
                              : availability.code === "closed"
                              ? "text-danger"
                              : "text-dark"
                          }
                        >
                          {availability.label}
                        </b>
                        {" | "}
                        <b>Due</b> {formatDate(quiz.dueDate) || "-"} |{" "}
                        {totalPoints(quiz)} pts | {quiz.questions.length}{" "}
                        Questions
                        {currentUser?.role === "STUDENT" && attempt && (
                          <>
                            {" | "}
                            <b>Score</b> {attempt.score}/{attempt.totalPoints}
                          </>
                        )}
                      </span>
                    </div>
                    {canEdit ? (
                      <>
                        <span
                          className="me-2"
                          role="button"
                          onClick={() => togglePublish(quiz)}
                          title={quiz.published ? "Unpublish" : "Publish"}
                        >
                          {quiz.published ? (
                            <FaCheckCircle className="text-success fs-4" />
                          ) : (
                            <FaBan className="text-secondary fs-4" />
                          )}
                        </span>
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            as="span"
                            role="button"
                            className="wd-quiz-menu"
                            id={`wd-quiz-menu-${quiz._id}`}
                          >
                            <IoEllipsisVertical className="fs-4" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() =>
                                router.push(
                                  `/courses/${cid}/quizzes/${quiz._id}/edit`
                                )
                              }
                            >
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => onDelete(quiz._id)}>
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => togglePublish(quiz)}>
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                            <Dropdown.Item disabled>Copy</Dropdown.Item>
                            <Dropdown.Item disabled>Sort</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    ) : (
                      quiz.published && (
                        <FaCheckCircle className="text-success fs-4 me-2" />
                      )
                    )}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          )}
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
