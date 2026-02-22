"use client";

import { useParams } from "next/navigation";
import { Button, Col, Form, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import * as db from "../../../../database";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const assignment = db.assignments.find((item: any) => item.course === cid && item._id === aid);
  if (!assignment) {
    return <div className="p-3">Assignment not found.</div>;
  }

  return (
    <div id="wd-assignments-editor" className="container">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <FormLabel>Assignment Name</FormLabel>
          <FormControl defaultValue={assignment.name} />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <FormControl
            as="textarea"
            rows={8}
            defaultValue={assignment.description}
          />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <FormLabel column sm={3} className="text-sm-end">
            Points
          </FormLabel>
          <Col sm={9}>
            <FormControl defaultValue={assignment.points} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-group">
          <FormLabel column sm={3} className="text-sm-end">
            Assignment Group
          </FormLabel>
          <Col sm={9}>
            <FormSelect defaultValue={assignment.assignmentGroup}>
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </FormSelect>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-display-grade-as">
          <FormLabel column sm={3} className="text-sm-end">
            Display Grade as
          </FormLabel>
          <Col sm={9}>
            <FormSelect defaultValue={assignment.displayGradeAs}>
              <option value="Percentage">Percentage</option>
              <option value="Letter">Letter</option>
              <option value="Points">Points</option>
            </FormSelect>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-submission-type">
          <FormLabel column sm={3} className="text-sm-end">
            Submission Type
          </FormLabel>
          <Col sm={9}>
            <FormSelect defaultValue={assignment.submissionType}>
              <option value="Online">Online</option>
              <option value="In Person">In Person</option>
            </FormSelect>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4">
          <Col sm={3} />
          <Col sm={9}>
            <div className="border rounded p-3">
              <FormLabel className="fw-bold">Online Entry Options</FormLabel>
              <FormCheck label="Text Entry" id="wd-text-entry" defaultChecked={assignment.onlineEntryOptions?.textEntry} />
              <FormCheck label="Website URL" id="wd-website-url" defaultChecked={assignment.onlineEntryOptions?.websiteUrl} />
              <FormCheck label="Media Recordings" id="wd-media-recordings" defaultChecked={assignment.onlineEntryOptions?.mediaRecordings} />
              <FormCheck label="Student Annotation" id="wd-student-annotation" defaultChecked={assignment.onlineEntryOptions?.studentAnnotation} />
              <FormCheck label="File Uploads" id="wd-file-uploads" defaultChecked={assignment.onlineEntryOptions?.fileUploads} />
            </div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-4">
          <FormLabel column sm={3} className="text-sm-end">
            Assign
          </FormLabel>
          <Col sm={9}>
            <div className="border rounded p-3">
              <Form.Group className="mb-3" controlId="wd-assign-to">
                <FormLabel>Assign to</FormLabel>
                <FormControl defaultValue={assignment.assignTo} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl type="date" defaultValue={assignment.dueDate} />
              </Form.Group>
              <Row>
                <Form.Group as={Col} md={6} controlId="wd-available-from">
                  <FormLabel>Available from</FormLabel>
                  <FormControl type="date" defaultValue={assignment.availableFrom} />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="wd-available-until">
                  <FormLabel>Until</FormLabel>
                  <FormControl type="date" defaultValue={assignment.availableUntil} />
                </Form.Group>
              </Row>
            </div>
          </Col>
        </Form.Group>

        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}
