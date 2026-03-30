import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

export const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const USERS_API = `${HTTP_SERVER}/api/users`;

export type Credentials = {
  username: string;
  password: string;
};

export type User = {
  _id: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: string;
  role?: string;
};

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signin`, credentials);
  return response.data as User;
};

export const signup = async (user: Partial<User>) => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
  return response.data as User;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
  return response.data as User;
};

export const updateUser = async (user: User) => {
  const response = await axiosWithCredentials.put(`${USERS_API}/${user._id}`, user);
  return response.data as User;
};
