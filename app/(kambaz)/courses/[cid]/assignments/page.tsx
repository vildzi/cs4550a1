import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import AssignmentsControls from "./AssignmentsControls";
import AssignmentControlButtons from "./AssignmentControlButtons";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <AssignmentsControls /><br /><br /><br /><br />
      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            ASSIGNMENTS
            <div className="float-end">
              <span className="border border-dark rounded-pill px-2 py-1 me-2" style={{ fontSize: "0.75rem" }}>
                40% of Total
              </span>
              <BsPlus className="fs-4" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center" style={{ borderLeft: "4px solid green" }}>
              <BsGripVertical className="me-2 fs-3" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/123" className="wd-assignment-link text-dark fw-bold text-decoration-none">
                  A1
                </Link>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am |
                </span>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <b>Due</b> May 13 at 11:59pm | 100 pts
                </span>
              </div>
              <AssignmentControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center" style={{ borderLeft: "4px solid green" }}>
              <BsGripVertical className="me-2 fs-3" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/124" className="wd-assignment-link text-dark fw-bold text-decoration-none">
                  A2
                </Link>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 13 at 12:00am |
                </span>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <b>Due</b> May 20 at 11:59pm | 100 pts
                </span>
              </div>
              <AssignmentControlButtons />
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center" style={{ borderLeft: "4px solid green" }}>
              <BsGripVertical className="me-2 fs-3" />
              <MdAssignment className="me-3 fs-3 text-success" />
              <div className="flex-grow-1">
                <Link href="/courses/1234/assignments/125" className="wd-assignment-link text-dark fw-bold text-decoration-none">
                  A3
                </Link>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 20 at 12:00am |
                </span>
                <br />
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                  <b>Due</b> May 27 at 11:59pm | 100 pts
                </span>
              </div>
              <AssignmentControlButtons />
            </ListGroupItem>
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
