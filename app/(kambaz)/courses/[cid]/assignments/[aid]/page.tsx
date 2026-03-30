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

  useEffect(() => {
    const fetchAssignment = async () => {
      if (aid === "new") {
        setAssignment({
          _id: "new",
          course: cid,
          name: "New Assignment",
          description: "",
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
          dueDate: "",
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
      const { _id, ...rest } = assignment;
      void _id;
      await client.createAssignmentForCourse(cid, rest);
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
            value={assignment.name}
            disabled={!canEdit}
            onChange={(e) => setAssignment({ ...assignment, name: e.target.value })}
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
              value={assignment.assignmentGroup}
              disabled={!canEdit}
              onChange={(e) => setAssignment({ ...assignment, assignmentGroup: e.target.value })}
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
              value={assignment.displayGradeAs}
              disabled={!canEdit}
              onChange={(e) => setAssignment({ ...assignment, displayGradeAs: e.target.value })}
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
              value={assignment.submissionType}
              disabled={!canEdit}
              onChange={(e) => setAssignment({ ...assignment, submissionType: e.target.value })}
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
                checked={assignment.onlineEntryOptions.textEntry}
                disabled={!canEdit}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    onlineEntryOptions: { ...assignment.onlineEntryOptions, textEntry: e.target.checked },
                  })
                }
              />
              <FormCheck
                label="Website URL"
                id="wd-website-url"
                checked={assignment.onlineEntryOptions.websiteUrl}
                disabled={!canEdit}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    onlineEntryOptions: { ...assignment.onlineEntryOptions, websiteUrl: e.target.checked },
                  })
                }
              />
              <FormCheck
                label="Media Recordings"
                id="wd-media-recordings"
                checked={assignment.onlineEntryOptions.mediaRecordings}
                disabled={!canEdit}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    onlineEntryOptions: { ...assignment.onlineEntryOptions, mediaRecordings: e.target.checked },
                  })
                }
              />
              <FormCheck
                label="Student Annotation"
                id="wd-student-annotation"
                checked={assignment.onlineEntryOptions.studentAnnotation}
                disabled={!canEdit}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    onlineEntryOptions: { ...assignment.onlineEntryOptions, studentAnnotation: e.target.checked },
                  })
                }
              />
              <FormCheck
                label="File Uploads"
                id="wd-file-uploads"
                checked={assignment.onlineEntryOptions.fileUploads}
                disabled={!canEdit}
                onChange={(e) =>
                  setAssignment({
                    ...assignment,
                    onlineEntryOptions: { ...assignment.onlineEntryOptions, fileUploads: e.target.checked },
                  })
                }
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
                  value={assignment.assignTo}
                  disabled={!canEdit}
                  onChange={(e) => setAssignment({ ...assignment, assignTo: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl
                  type="date"
                  value={assignment.dueDate}
                  disabled={!canEdit}
                  onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
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
