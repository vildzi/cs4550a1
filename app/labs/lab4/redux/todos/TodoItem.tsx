"use client";

import { Button, ListGroupItem } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteTodo as deleteTodoAction, setTodo as setTodoAction, Todo } from "./todosReducer";

export default function TodoItem({ todo }: { todo: Todo }) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem key={todo.id}>
      <Button onClick={() => dispatch(deleteTodoAction(todo.id || ""))} id="wd-delete-todo-click" variant="danger" className="me-2">
        Delete
      </Button>
      <Button onClick={() => dispatch(setTodoAction(todo))} id="wd-set-todo-click" variant="warning" className="me-2">
        Edit
      </Button>
      {todo.title}
    </ListGroupItem>
  );
}
