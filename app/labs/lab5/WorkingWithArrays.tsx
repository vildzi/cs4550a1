"use client";

import { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

type TodoEditor = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function WorkingWithArrays() {
  const API = `${HTTP_SERVER}/lab5/todos`;
  const [todo, setTodo] = useState<TodoEditor>({
    id: "1",
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    completed: false,
  });

  return (
    <div id="wd-working-with-arrays">
      <h3>Working with Arrays</h3>

      <h4>Retrieving Arrays</h4>
      <a id="wd-retrieve-todos" className="btn btn-primary" href={API}>
        Get Todos
      </a>
      <hr />

      <h4>Retrieving an Item by ID</h4>
      <a
        id="wd-retrieve-todo-by-id"
        className="btn btn-primary float-end"
        href={`${API}/${todo.id}`}
      >
        Get Todo by ID
      </a>
      <FormControl
        id="wd-todo-id"
        value={todo.id}
        className="w-50"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />

      <h4>Filtering Array Items</h4>
      <a
        id="wd-retrieve-completed-todos"
        className="btn btn-primary"
        href={`${API}?completed=true`}
      >
        Get Completed Todos
      </a>
      <hr />

      <h4>Creating New Items in an Array</h4>
      <a id="wd-create-todo" className="btn btn-success" href={`${API}/create`}>
        Create Todo
      </a>
      <hr />

      <h4>Removing from an Array</h4>
      <a id="wd-remove-todo" className="btn btn-danger float-end" href={`${API}/${todo.id}/delete`}>
        Remove Todo with ID = {todo.id}
      </a>
      <FormControl
        className="w-50"
        value={todo.id}
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <hr />

      <h4>Updating an Item in an Array</h4>
      <a
        id="wd-update-todo-title"
        className="btn btn-primary float-end mb-2"
        href={`${API}/${todo.id}/title/${encodeURIComponent(todo.title)}`}
      >
        Update Todo Title
      </a>
      <FormControl
        value={todo.id}
        className="w-25 float-start me-2 mb-2"
        onChange={(e) => setTodo({ ...todo, id: e.target.value })}
      />
      <FormControl
        value={todo.title}
        className="w-50 float-start mb-2"
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <br />
      <br />

      <a
        id="wd-update-todo-description"
        className="btn btn-secondary float-end mb-2"
        href={`${API}/${todo.id}/description/${encodeURIComponent(todo.description)}`}
      >
        Update Todo Description
      </a>
      <FormControl
        value={todo.description}
        className="w-75 mb-2"
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
      />

      <a
        id="wd-update-todo-completed"
        className="btn btn-warning float-end mb-2"
        href={`${API}/${todo.id}/completed/${todo.completed}`}
      >
        Update Todo Completed
      </a>
      <FormCheck
        checked={todo.completed}
        onChange={(e) => setTodo({ ...todo, completed: e.target.checked })}
        label="Completed"
      />
      <hr />
    </div>
  );
}
