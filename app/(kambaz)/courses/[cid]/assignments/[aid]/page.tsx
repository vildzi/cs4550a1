"use client";

import { Button, Col, Form, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="container">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <FormLabel>Assignment Name</FormLabel>
          <FormControl defaultValue="A1 - ENV + HTML" />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <FormControl
            as="textarea"
            rows={8}
            defaultValue={`The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.`}
          />
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-points">
          <FormLabel column sm={3} className="text-sm-end">
            Points
          </FormLabel>
          <Col sm={9}>
            <FormControl defaultValue={100} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="wd-group">
          <FormLabel column sm={3} className="text-sm-end">
            Assignment Group
          </FormLabel>
          <Col sm={9}>
            <FormSelect>
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
            <FormSelect>
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
            <FormSelect>
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
              <FormCheck label="Text Entry" id="wd-text-entry" />
              <FormCheck label="Website URL" id="wd-website-url" defaultChecked />
              <FormCheck label="Media Recordings" id="wd-media-recordings" />
              <FormCheck label="Student Annotation" id="wd-student-annotation" />
              <FormCheck label="File Uploads" id="wd-file-uploads" />
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
                <FormControl defaultValue="Everyone" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="wd-due-date">
                <FormLabel>Due</FormLabel>
                <FormControl type="date" defaultValue="2024-05-13" />
              </Form.Group>
              <Row>
                <Form.Group as={Col} md={6} controlId="wd-available-from">
                  <FormLabel>Available from</FormLabel>
                  <FormControl type="date" defaultValue="2024-05-06" />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="wd-available-until">
                  <FormLabel>Until</FormLabel>
                  <FormControl type="date" defaultValue="2024-05-20" />
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
