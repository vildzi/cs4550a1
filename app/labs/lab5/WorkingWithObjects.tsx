"use client";

import { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

type Assignment = {
  id: number;
  title: string;
  description: string;
  due: string;
  completed: boolean;
  score: number;
};

type Module = {
  id: string;
  name: string;
  description: string;
  course: string;
};

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState<Assignment>({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const [moduleObject, setModuleObject] = useState<Module>({
    id: "M100",
    name: "Introduction to Node",
    description: "Build and test a basic HTTP server",
    course: "CS4550",
  });

  const assignmentApi = `${HTTP_SERVER}/lab5/assignment`;
  const moduleApi = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>

      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary me-2" href={assignmentApi}>
        Get Assignment
      </a>
      <a id="wd-retrieve-module" className="btn btn-primary" href={moduleApi}>
        Get Module
      </a>
      <hr />

      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        className="btn btn-primary me-2"
        href={`${assignmentApi}/title`}
      >
        Get Assignment Title
      </a>
      <a id="wd-retrieve-module-name" className="btn btn-primary" href={`${moduleApi}/name`}>
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Assignment</h4>
      <a
        id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${assignmentApi}/title/${encodeURIComponent(assignment.title)}`}
      >
        Update Title
      </a>
      <FormControl
        className="w-75 mb-2"
        id="wd-assignment-title"
        value={assignment.title}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
      />

      <a
        id="wd-update-assignment-score"
        className="btn btn-secondary float-end"
        href={`${assignmentApi}/score/${assignment.score}`}
      >
        Update Score
      </a>
      <FormControl
        className="w-75 mb-2"
        id="wd-assignment-score"
        type="number"
        value={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: parseInt(e.target.value || "0", 10) })
        }
      />

      <a
        id="wd-update-assignment-completed"
        className="btn btn-success float-end"
        href={`${assignmentApi}/completed/${assignment.completed}`}
      >
        Update Completed
      </a>
      <FormCheck
        className="mb-2"
        id="wd-assignment-completed"
        checked={assignment.completed}
        onChange={(e) => setAssignment({ ...assignment, completed: e.target.checked })}
        label="Completed"
      />
      <hr />

      <h4>Modifying Module</h4>
      <a
        id="wd-update-module-name"
        className="btn btn-primary float-end"
        href={`${moduleApi}/name/${encodeURIComponent(moduleObject.name)}`}
      >
        Update Module Name
      </a>
      <FormControl
        className="w-75 mb-2"
        id="wd-module-name"
        value={moduleObject.name}
        onChange={(e) => setModuleObject({ ...moduleObject, name: e.target.value })}
      />

      <a
        id="wd-update-module-description"
        className="btn btn-secondary float-end"
        href={`${moduleApi}/description/${encodeURIComponent(moduleObject.description)}`}
      >
        Update Module Description
      </a>
      <FormControl
        className="w-75"
        id="wd-module-description"
        value={moduleObject.description}
        onChange={(e) => setModuleObject({ ...moduleObject, description: e.target.value })}
      />
      <hr />
    </div>
  );
}
