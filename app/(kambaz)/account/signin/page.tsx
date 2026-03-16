"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import * as db from "../../database";

type User = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
};

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = () => {
    const user = (db.users as User[]).find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    );
    if (!user) {
      return;
    }
    dispatch(setCurrentUser(user));
    router.push("/dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl id="wd-username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        placeholder="username"
        className="mb-2" />
      <FormControl id="wd-password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        placeholder="password" type="password"
        className="mb-2" />
      <Button id="wd-signin-btn" onClick={signin} className="w-100 mb-2">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/account/signup">Sign up</Link>
    </div>
  );
}