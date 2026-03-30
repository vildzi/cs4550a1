"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { deleteAssignment as deleteAssignmentAction, setAssignments, addAssignment } from "./reducer";
import * as client from "../../client";
import { Assignment } from "../../client";

export default function Assignments() {
  const { cid } = useParams<{ cid: string }>();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";
  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const fetchAssignments = async () => {
    if (!cid) return;
    const remoteAssignments = await client.findAssignmentsForCourse(cid);
    dispatch(setAssignments(remoteAssignments));
  };

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const onAddAssignment = async () => {
    if (!cid) return;
    const newAssignment = await client.createAssignmentForCourse(cid, {
      name: "New Assignment",
      description: "Edit this assignment",
      points: 100,
      assignmentGroup: "ASSIGNMENTS",
      displayGradeAs: "Points",
      submissionType: "Online",
      onlineEntryOptions: {
        textEntry: true,
        websiteUrl: false,
        mediaRecordings: false,
        studentAnnotation: false,
        fileUploads: true,
      },
      assignTo: "Everyone",
      dueDate: "2026-12-31",
      availableFrom: "2026-01-01",
      availableUntil: "2026-12-31",
    });
    dispatch(addAssignment(newAssignment));
  };

  const onDeleteAssignment = async (assignmentId: string) => {
    if (!canEdit) return;
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      await client.deleteAssignment(assignmentId);
      dispatch(deleteAssignmentAction(assignmentId));
    }
  };

  return (
    <div id="wd-assignments">
      <AssignmentsControls canEdit={canEdit} /><br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            ASSIGNMENTS
            <div className="float-end">
              <span className="border border-dark rounded-pill px-2 py-1 me-2" style={{ fontSize: "0.75rem" }}>
                40% of Total
              </span>
              <BsPlus className="fs-4" style={{ cursor: "pointer" }} onClick={onAddAssignment} />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments.map((assignment: Assignment) => (
              <ListGroupItem
                key={assignment._id}
                className="wd-lesson p-3 ps-1 d-flex align-items-center"
                style={{ borderLeft: "4px solid green" }}
              >
                <BsGripVertical className="me-2 fs-3" />
                <MdAssignment className="me-3 fs-3 text-success" />
                <div style={{ flexGrow: 1 }}>
                  <Link
                    href={`/courses/${cid}/assignments/${assignment._id}`}
                    className="wd-assignment-link text-dark fw-bold text-decoration-none"
                  >
                    {assignment.name}
                  </Link>
                  <br />
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                    <span className="text-danger">{assignment.assignmentGroup}</span> |{" "}
                    <b>Not available until</b> {formatDate(assignment.availableUntil)} |
                  </span>
                  <br />
                  <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                    <b>Due</b> {formatDate(assignment.dueDate)} | {assignment.points} pts
                  </span>
                </div>
                <AssignmentControlButtons
                  assignmentId={assignment._id}
                  canEdit={canEdit}
                  deleteAssignment={onDeleteAssignment}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
