"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Nav } from "react-bootstrap";

export default function QuizEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const pathname = usePathname();
  const onQuestions = pathname.endsWith("/questions");

  return (
    <div id="wd-quiz-editor" className="container">
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/courses/${cid}/quizzes/${qid}/edit`}
            active={!onQuestions}
            id="wd-quiz-edit-details-tab"
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            href={`/courses/${cid}/quizzes/${qid}/edit/questions`}
            active={onQuestions}
            id="wd-quiz-edit-questions-tab"
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {children}
    </div>
  );
}
