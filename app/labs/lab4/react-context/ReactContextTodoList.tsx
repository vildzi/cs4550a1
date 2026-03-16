"use client";

import { Button, FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { useTodos } from "./todosContext";

export default function ReactContextTodoList() {
  const { todos, todo, setTodo, addTodo, updateTodo, deleteTodo } = useTodos();

  return (
    <div id="wd-react-context-todo-list">
      <h2>React Context Todo List</h2>
      <ListGroup>
        <ListGroupItem>
          <Button onClick={addTodo} id="wd-react-context-add-todo-click" className="me-2">
            Add
          </Button>
          <Button onClick={updateTodo} id="wd-react-context-update-todo-click" variant="warning" className="me-2">
            Update
          </Button>
          <FormControl value={todo.title} onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
        </ListGroupItem>
        {todos.map((item) => (
          <ListGroupItem key={item.id}>
            <Button
              onClick={() => deleteTodo(item.id)}
              id="wd-react-context-delete-todo-click"
              variant="danger"
              className="me-2"
            >
              Delete
            </Button>
            <Button
              onClick={() => setTodo(item)}
              id="wd-react-context-set-todo-click"
              variant="warning"
              className="me-2"
            >
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
