"use client";

import { useEffect, useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";
import * as client from "./client";

type Assignment = {
  id: number;
  title: string;
  description: string;
  due: string;
  completed: boolean;
  score: number;
};

export default function WorkingWithObjectsAsynchronously() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const fetchAssignment = async () => {
    const remoteAssignment = await client.fetchAssignment();
    setAssignment(remoteAssignment);
  };

  const updateTitle = async (title: string) => {
    const updatedAssignment = await client.updateTitle(title);
    setAssignment(updatedAssignment);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchAssignment();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!assignment) {
    return (
      <div id="wd-asynchronous-objects">
        <h3>Working with Objects Asynchronously</h3>
        Loading...
        <hr />
      </div>
    );
  }

  return (
    <div id="wd-asynchronous-objects">
      <h3>Working with Objects Asynchronously</h3>
      <h4>Assignment</h4>

      <FormControl
        className="mb-2"
        value={assignment.title}
        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
      />
      <FormControl
        as="textarea"
        rows={3}
        className="mb-2"
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />
      <FormControl
        type="date"
        className="mb-2"
        value={assignment.due}
        onChange={(e) => setAssignment({ ...assignment, due: e.target.value })}
      />
      <FormCheck
        className="mb-2"
        checked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
        label="Completed"
      />
      <button
        className="btn btn-primary me-2"
        onClick={() => updateTitle(assignment.title)}
      >
        Update Title
      </button>

      <pre>{JSON.stringify(assignment, null, 2)}</pre>
      <hr />
    </div>
  );
}
