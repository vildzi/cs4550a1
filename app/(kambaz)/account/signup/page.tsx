"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, FormControl } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import * as client from "../client";
import { setCurrentUser } from "../reducer";

export default function Signup() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    if (user.password !== verifyPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message === "string"
          ? (err as { response?: { data?: { message?: string } } }).response!.data!
              .message!
          : "Unable to sign up";
      setError(message);
    }
  };

  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <FormControl
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <FormControl
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <FormControl
        id="wd-password-verify"
        placeholder="verify password"
        type="password"
        className="mb-2"
        value={verifyPassword}
        onChange={(e) => setVerifyPassword(e.target.value)}
      />
      <Button onClick={signup} className="btn btn-primary w-100 mb-2">
        Sign up
      </Button>
      <Link id="wd-signin-link" href="/account/signin">Sign in</Link>
    </div>
  );
}
