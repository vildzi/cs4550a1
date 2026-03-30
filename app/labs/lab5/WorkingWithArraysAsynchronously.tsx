"use client";

import { useEffect, useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import * as client from "./client";

export default function WorkingWithArraysAsynchronously() {
  const [todos, setTodos] = useState<client.LabTodo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodos = async () => {
    const remoteTodos = await client.fetchTodos();
    setTodos(remoteTodos);
  };

  const createNewTodo = async () => {
    const updatedTodos = await client.createNewTodo();
    setTodos(updatedTodos);
    setErrorMessage(null);
  };

  const postNewTodo = async () => {
    const newTodo = await client.postNewTodo({
      title: "New Posted Todo",
      description: "Created with HTTP POST",
      completed: false,
    });
    setTodos((current) => [...current, newTodo]);
    setErrorMessage(null);
  };

  const removeTodo = async (todo: client.LabTodo) => {
    const updatedTodos = await client.removeTodo(todo);
    setTodos(updatedTodos);
    setErrorMessage(null);
  };

  const deleteTodo = async (todo: client.LabTodo) => {
    try {
      await client.deleteTodo(todo);
      setTodos((current) => current.filter((t) => t.id !== todo.id));
      setErrorMessage(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!.data!
              .message!
          : "Unable to delete todo.";
      setErrorMessage(message);
    }
  };

  const editTodo = (todo: client.LabTodo) => {
    setTodos((current) =>
      current.map((t) => (t.id === todo.id ? { ...todo, editing: true } : t))
    );
  };

  const updateTodoInState = (todo: client.LabTodo) => {
    setTodos((current) => current.map((t) => (t.id === todo.id ? todo : t)));
  };

  const updateTodo = async (todo: client.LabTodo) => {
    try {
      await client.updateTodo(todo);
      updateTodoInState(todo);
      setErrorMessage(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response!.data!
              .message!
          : "Unable to update todo.";
      setErrorMessage(message);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchTodos();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div id="wd-asynchronous-arrays">
      <h3>Working with Arrays Asynchronously</h3>
      {errorMessage && (
        <div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">
          {errorMessage}
        </div>
      )}
      <h4>
        Todos
        <FaPlusCircle
          onClick={createNewTodo}
          className="text-success float-end fs-3"
          id="wd-create-todo"
        />
        <FaPlusCircle
          onClick={postNewTodo}
          className="text-primary float-end fs-3 me-3"
          id="wd-post-todo"
        />
      </h4>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroupItem key={todo.id}>
            <FaTrash
              onClick={() => removeTodo(todo)}
              className="text-danger float-end mt-1"
              id="wd-remove-todo"
            />
            <TiDelete
              onClick={() => deleteTodo(todo)}
              className="text-danger float-end me-2 fs-3"
              id="wd-delete-todo"
            />
            <FaPencil
              onClick={() => editTodo(todo)}
              className="text-primary float-end me-2 mt-1"
            />
            <input
              type="checkbox"
              checked={todo.completed}
              className="form-check-input me-2 float-start"
              onChange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
            />
            {!todo.editing && (
              <span
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
            )}
            {todo.editing && (
              <FormControl
                className="w-50 float-start"
                value={todo.title}
                onChange={(e) => updateTodoInState({ ...todo, title: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateTodo({ ...todo, editing: false });
                  }
                }}
              />
            )}
            {todo.description && (
              <>
                <br />
                <small className="text-muted">{todo.description}</small>
              </>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
