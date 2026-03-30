import axios from "axios";

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const ASSIGNMENT_API = `${HTTP_SERVER}/lab5/assignment`;
const TODOS_API = `${HTTP_SERVER}/lab5/todos`;

export type LabTodo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  editing?: boolean;
};

export type LabAssignment = {
  id: number;
  title: string;
  description: string;
  due: string;
  completed: boolean;
  score: number;
};

export const fetchWelcomeMessage = async () => {
  const response = await axios.get(`${HTTP_SERVER}/lab5/welcome`);
  return response.data as string;
};

export const fetchAssignment = async () => {
  const response = await axios.get(`${ASSIGNMENT_API}`);
  return response.data as LabAssignment;
};

export const updateTitle = async (title: string) => {
  const response = await axios.get(
    `${ASSIGNMENT_API}/title/${encodeURIComponent(title)}`
  );
  return response.data as LabAssignment;
};

export const fetchTodos = async () => {
  const response = await axios.get(TODOS_API);
  return response.data as LabTodo[];
};

export const createNewTodo = async () => {
  const response = await axios.get(`${TODOS_API}/create`);
  return response.data as LabTodo[];
};

export const postNewTodo = async (todo: Partial<LabTodo>) => {
  const response = await axios.post(`${TODOS_API}`, todo);
  return response.data as LabTodo;
};

export const removeTodo = async (todo: Pick<LabTodo, "id">) => {
  const response = await axios.get(`${TODOS_API}/${todo.id}/delete`);
  return response.data as LabTodo[];
};

export const deleteTodo = async (todo: Pick<LabTodo, "id">) => {
  const response = await axios.delete(`${TODOS_API}/${todo.id}`);
  return response.data;
};

export const updateTodo = async (todo: LabTodo) => {
  const response = await axios.put(`${TODOS_API}/${todo.id}`, todo);
  return response.data;
};
