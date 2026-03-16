"use client";

import CounterContext from "./counter";
import { CounterProvider } from "./counter/context";
import ReactContextTodoList from "./ReactContextTodoList";
import { TodosProvider } from "./todosContext";

export default function ReactContextExamples() {
  return (
    <div id="wd-react-context-examples">
      <h1>React Context Examples</h1>
      <CounterProvider>
        <CounterContext />
      </CounterProvider>
      <TodosProvider>
        <ReactContextTodoList />
      </TodosProvider>
    </div>
  );
}
