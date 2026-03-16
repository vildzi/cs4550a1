import { create } from "zustand";

type Todo = {
  id: string;
  title: string;
};

type TodoStore = {
  todos: Todo[];
  todo: Todo;
  setTodo: (todo: Todo) => void;
  addTodo: () => void;
  updateTodo: () => void;
  deleteTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { id: "-1", title: "Learn Mongo" },
  setTodo: (todo) => set({ todo }),
  addTodo: () => {
    const { todos, todo } = get();
    set({
      todos: [...todos, { ...todo, id: new Date().getTime().toString() }],
      todo: { id: "-1", title: "" },
    });
  },
  updateTodo: () => {
    const { todos, todo } = get();
    set({
      todos: todos.map((item) => (item.id === todo.id ? todo : item)),
      todo: { id: "-1", title: "" },
    });
  },
  deleteTodo: (id) => {
    const { todos } = get();
    set({ todos: todos.filter((item) => item.id !== id) });
  },
}));
