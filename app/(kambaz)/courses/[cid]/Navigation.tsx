"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function CourseNavigation() {
  const { cid } = useParams<{ cid: string }>();
  const pathname = usePathname();
  const activeSection = pathname.split("/")[3] ?? "home";
  const links = [
    { label: "Home", path: `/courses/${cid}/home`, id: "wd-course-home-link", section: "home" },
    { label: "Modules", path: `/courses/${cid}/modules`, id: "wd-course-modules-link", section: "modules" },
    { label: "Assignments", path: `/courses/${cid}/assignments`, id: "wd-course-assignments-link", section: "assignments" },
    { label: "Quizzes", path: `/courses/${cid}/quizzes`, id: "wd-course-quizzes-link", section: "quizzes" },
    { label: "People", path: `/courses/${cid}/people/table`, id: "wd-course-people-link", section: "people" },
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          id={link.id}
          className={`list-group-item border-0 ${activeSection === link.section ? "active" : "text-danger"}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
