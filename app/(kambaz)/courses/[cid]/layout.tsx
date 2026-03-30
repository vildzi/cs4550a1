"use client";

import { ReactNode, useEffect, useState } from "react";
import CourseNavigation from "./Navigation";
import { FaAlignJustify } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function CoursesLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const course = courses.find((course) => course._id === cid);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2>
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          onClick={() => setShowSidebar(!showSidebar)}
          style={{ cursor: "pointer" }}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && <div className="d-none d-md-block"><CourseNavigation /></div>}
        <div className="flex-fill">
          {children}
        </div>
      </div>
    </div>
  );
}
