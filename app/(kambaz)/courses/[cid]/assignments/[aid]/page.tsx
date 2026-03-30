"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Col, Form, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { Assignment } from "../../../client";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assignmentGroup, setAssignmentGroup] = useState("ASSIGNMENTS");
  const [displayGradeAs, setDisplayGradeAs] = useState("Points");
  const [submissionType, setSubmissionType] = useState("Online");
  const [assignTo, setAssignTo] = useState("Everyone");
  const [onlineEntryOptions, setOnlineEntryOptions] = useState({
    textEntry: true,
    websiteUrl: false,
    mediaRecordings: false,
    studentAnnotation: false,
    fileUploads: true,
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      if (aid === "new") {
        setAssignment({
          _id: "new",
          course: cid,
          title: "New Assignment",
          description: "",
          points: 100,
          due: "",
          availableFrom: "",
          availableUntil: "",
        });
        return;
      }
      try {
        const remote = await client.findAssignmentById(aid);
        setAssignment(remote);
      } catch {
        setAssignment(null);
      }
    };
    fetchAssignment();
  }, [aid, cid]);

  if (!assignment) {
    return <div className="p-3">Assignment not found.</div>;
  }

  const saveAssignment = async () => {
    if (!canEdit) {
      router.push(`/courses/${cid}/assignments`);
      return;
    }
    if (aid === "new") {
      await client.createAssignmentForCourse(cid, {
        title: assignment.title,
        description: assignment.description,
        points: assignment.points,
        due: assignment.due,
        availableFrom: assignment.availableFrom,
        availableUntil: assignment.availableUntil,
      });
    } else {
      await client.updateAssignment(assignment);
    }
    router.push(`/courses/${cid}/assignments`);
  };

  const cancel = () => {
    router.push(`/courses/${cid}/assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="container">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <FormLabel>Assignment Name</FormLabel>
          <FormControl
            value={assignment.title}
            disabled={!canEdit}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <FormControl
            as="textarea"
            rows={8}
            value={assignment.description}
            disabled={!canEdit}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <FormLabel column sm={3} className="text-sm-end">
            Points
          </FormLabel>
          <Col sm={9}>
            <FormControl
              value={assignment.points}
              disabled={!canEdit}
              onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value, 10) || 0 })}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-group">
          <FormLabel column sm={3} className="text-sm-end">
            Assignment Group
          </FormLabel>
          <Col sm={9}>
            <FormSelect
              value={assignmentGroup}
              disabled={!canEdit}
              onChange={(e) => setAssignmentGroup(e.target.value)}
            >
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
            <FormSelect
              value={displayGradeAs}
              disabled={!canEdit}
              onChange={(e) => setDisplayGradeAs(e.target.value)}
            >
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
            <FormSelect
              value={submissionType}
              disabled={!canEdit}
              onChange={(e) => setSubmissionType(e.target.value)}
            >
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
              <FormCheck
                label="Text Entry"
                id="wd-text-entry"
                checked={onlineEntryOptions.textEntry}
                disabled={!canEdit}
                onChange={(e) => setOnlineEntryOptions({ ...onlineEntryOptions, textEntry: e.target.checked })}
              />
              <FormCheck
                label="Website URL"
                id="wd-website-url"
                checked={onlineEntryOptions.websiteUrl}
                disabled={!canEdit}
                onChange={(e) => setOnlineEntryOptions({ ...onlineEntryOptions, websiteUrl: e.target.checked })}
              />
              <FormCheck
                label="Media Recordings"
                id="wd-media-recordings"
                checked={onlineEntryOptions.mediaRecordings}
                disabled={!canEdit}
                onChange={(e) => setOnlineEntryOptions({ ...onlineEntryOptions, mediaRecordings: e.target.checked })}
              />
              <FormCheck
                label="Student Annotation"
                id="wd-student-annotation"
                checked={onlineEntryOptions.studentAnnotation}
                disabled={!canEdit}
                onChange={(e) => setOnlineEntryOptions({ ...onlineEntryOptions, studentAnnotation: e.target.checked })}
              />
              <FormCheck
                label="File Uploads"
                id="wd-file-uploads"
                checked={onlineEntryOptions.fileUploads}
                disabled={!canEdit}
                onChange={(e) => setOnlineEntryOptions({ ...onlineEntryOptions, fileUploads: e.target.checked })}
              />
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
                <FormControl
                  value={assignTo}
                  disabled={!canEdit}
                  onChange={(e) => setAssignTo(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl
                  type="date"
                  value={assignment.due}
                  disabled={!canEdit}
                  onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Form.Group as={Col} md={6} controlId="wd-available-from">
                  <FormLabel>Available from</FormLabel>
                  <FormControl
                    type="date"
                    value={assignment.availableFrom}
                    disabled={!canEdit}
                    onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="wd-available-until">
                  <FormLabel>Until</FormLabel>
                  <FormControl
                    type="date"
                    value={assignment.availableUntil}
                    disabled={!canEdit}
                    onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                  />
                </Form.Group>
              </Row>
            </div>
          </Col>
        </Form.Group>

        <hr />
        <div className="d-flex justify-content-end">
          <Button variant="secondary" type="button" className="me-2" id="wd-cancel-assignment-click" onClick={cancel}>
            Cancel
          </Button>
          {canEdit && (
            <Button variant="danger" type="button" id="wd-save-assignment-click" onClick={saveAssignment}>
              Save
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
