"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store";
import { addNewCourse, Course, deleteCourse, updateCourse } from "../courses/reducer";
import { enroll, unenroll } from "../enrollments/reducer";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);

  const canManageCourses = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const isEnrolled = (courseId: string) =>
    enrollments.some((enrollment) => enrollment.user === currentUser?._id && enrollment.course === courseId);

  const visibleCourses = useMemo(() => {
    if (showAllCourses) {
      return courses;
    }
    return courses.filter((course) =>
      enrollments.some((enrollment) => enrollment.user === currentUser?._id && enrollment.course === course._id),
    );
  }, [courses, currentUser?._id, enrollments, showAllCourses]);

  const handleAddCourse = () => {
    if (!canManageCourses) {
      return;
    }
    dispatch(addNewCourse(course));
  };

  const handleUpdateCourse = () => {
    if (!canManageCourses) {
      return;
    }
    dispatch(updateCourse(course));
  };

  const toggleCourseEnrollment = (courseId: string) => {
    if (!currentUser) {
      return;
    }
    if (isEnrolled(courseId)) {
      dispatch(unenroll({ userId: currentUser._id, courseId }));
    } else {
      dispatch(enroll({ userId: currentUser._id, courseId }));
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-0">{canManageCourses ? "New Course" : "My Courses"}</h5>
        <Button
          variant={showAllCourses ? "secondary" : "primary"}
          onClick={() => setShowAllCourses(!showAllCourses)}
          id="wd-toggle-enrollments-click"
        >
          Enrollments
        </Button>
      </div>

      {canManageCourses && (
        <>
          <div className="mt-2">
            <Button className="float-end me-2" variant="primary" id="wd-add-new-course-click" onClick={handleAddCourse}>
              Add
            </Button>
            <Button className="float-end me-2" variant="warning" id="wd-update-course-click" onClick={handleUpdateCourse}>
              Update
            </Button>
          </div>
          <br />
          <br />
          <FormControl
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <FormControl
            value={course.description}
            as="textarea"
            rows={3}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
        </>
      )}

      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({visibleCourses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course) => (
            <Col className="wd-dashboard-course" style={{ width: "300px" }} key={course._id}>
              <Card>
                <Link href={`/courses/${course._id}/home`} className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg src={(course.image as string) || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description}
                    </CardText>
                    <Button variant="primary">Go</Button>

                    {canManageCourses && (
                      <>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          id="wd-edit-course-click"
                          variant="warning"
                          className="float-end me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            if (!canManageCourses) {
                              return;
                            }
                            dispatch(deleteCourse(course._id));
                          }}
                          id="wd-delete-course-click"
                          variant="danger"
                          className="float-end"
                        >
                          Delete
                        </Button>
                      </>
                    )}

                    {showAllCourses && (
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          toggleCourseEnrollment(course._id);
                        }}
                        variant={isEnrolled(course._id) ? "danger" : "success"}
                        className="float-end me-2"
                        id={`wd-toggle-enroll-${course._id}`}
                      >
                        {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                      </Button>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

