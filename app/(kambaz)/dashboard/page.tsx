"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardBody, CardImg, CardText, CardTitle, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store";
import { setCourses } from "../courses/reducer";
import * as client from "../courses/client";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  const [allCourses, setAllCourses] = useState<client.Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [course, setCourse] = useState<Partial<client.Course>>({
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

  const fetchCourses = async () => {
    try {
      const all = await client.fetchAllCourses();
      setAllCourses(all);

      if (!currentUser) {
        dispatch(setCourses([]));
        setEnrolledCourseIds([]);
        return;
      }

      const [mine, enrollments] = await Promise.all([
        client.findMyCourses(),
        client.findMyEnrollments(),
      ]);
      dispatch(setCourses(mine));
      setEnrolledCourseIds(enrollments.map((e) => e.course));
      setErrorMessage("");
    } catch {
      dispatch(setCourses([]));
      setAllCourses([]);
      setEnrolledCourseIds([]);
      setErrorMessage("Unable to load courses. Make sure the server is running.");
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const canManageCourses = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const visibleCourses = useMemo(() => {
    if (showAllCourses) {
      return allCourses;
    }
    return courses;
  }, [courses, allCourses, showAllCourses]);

  const onAddNewCourse = async () => {
    try {
      const newCourse = await client.createCourse(course);
      dispatch(setCourses([...courses, newCourse]));
      setAllCourses((prev) => [...prev, newCourse]);
      setEnrolledCourseIds((prev) => [...prev, newCourse._id]);
      setErrorMessage("");
    } catch {
      setErrorMessage("Sign in before creating a course.");
    }
  };

  const onUpdateCourse = async () => {
    if (!course._id) {
      setErrorMessage("Select a course card first to edit.");
      return;
    }
    const updatedCourse = await client.updateCourse(course as client.Course);
    dispatch(setCourses(courses.map((c) => (c._id === updatedCourse._id ? updatedCourse : c))));
    setAllCourses((prev) => prev.map((c) => (c._id === updatedCourse._id ? updatedCourse : c)));
    setErrorMessage("");
  };

  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((c) => c._id !== courseId)));
    setAllCourses((prev) => prev.filter((c) => c._id !== courseId));
    setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
  };

  const toggleCourseEnrollment = async (courseId: string) => {
    try {
      if (isEnrolled(courseId)) {
        await client.unenrollFromCourse(courseId);
        setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
        dispatch(setCourses(courses.filter((c) => c._id !== courseId)));
      } else {
        await client.enrollInCourse(courseId);
        setEnrolledCourseIds((prev) => [...prev, courseId]);
        const target = allCourses.find((c) => c._id === courseId);
        if (target) {
          dispatch(setCourses([...courses, target]));
        }
      }
      setErrorMessage("");
    } catch {
      setErrorMessage("Unable to change enrollment. Sign in first.");
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div id="wd-dashboard" className="p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />

      {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}

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
            <Button className="float-end me-2" variant="primary" id="wd-add-new-course-click" onClick={onAddNewCourse}>
              Add
            </Button>
            <Button className="float-end me-2" variant="warning" id="wd-update-course-click" onClick={onUpdateCourse}>
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
      <h2 id="wd-dashboard-published">
        {showAllCourses ? "All Courses" : "Published Courses"} ({visibleCourses.length})
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((c) => (
            <Col className="wd-dashboard-course" style={{ width: "300px" }} key={c._id}>
              <Card>
                <Link href={`/courses/${c._id}/home`} className="wd-dashboard-course-link text-decoration-none text-dark">
                  <CardImg src={c.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">{c.name}</CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {c.description}
                    </CardText>
                    <Button variant="primary">Go</Button>

                    {canManageCourses && (
                      <>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(c);
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
                            onDeleteCourse(c._id);
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
                          toggleCourseEnrollment(c._id);
                        }}
                        variant={isEnrolled(c._id) ? "danger" : "success"}
                        className="float-end me-2"
                        id={`wd-toggle-enroll-${c._id}`}
                      >
                        {isEnrolled(c._id) ? "Unenroll" : "Enroll"}
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
