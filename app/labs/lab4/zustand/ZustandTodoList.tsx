"use client";

import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { useTodoStore } from "./useTodoStore";

export default function ZustandTodoList() {
  const { todos, todo, setTodo, addTodo, updateTodo, deleteTodo } = useTodoStore((state) => state);

  return (
    <div id="wd-zustand-todo-list">
      <h2>Zustand Todo List</h2>
      <ListGroup>
        <ListGroupItem>
          <Button onClick={addTodo} id="wd-zustand-add-todo-click" className="me-2">
            Add
          </Button>
          <Button onClick={updateTodo} id="wd-zustand-update-todo-click" variant="warning" className="me-2">
            Update
          </Button>
          <FormControl value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
        </ListGroupItem>
        {todos.map((item) => (
          <ListGroupItem key={item.id}>
            <Button onClick={() => deleteTodo(item.id)} id="wd-zustand-delete-todo-click" variant="danger" className="me-2">
              Delete
            </Button>
            <Button onClick={() => setTodo(item)} id="wd-zustand-set-todo-click" variant="warning" className="me-2">
              Edit
            </Button>
            {item.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
