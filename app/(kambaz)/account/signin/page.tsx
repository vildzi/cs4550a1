"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { setCurrentUser } from "../reducer";

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response!.data!
              .message!
          : "Unable to sign in";
      setError(message);
    }
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && <div className="alert alert-danger">{error}</div>}
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
