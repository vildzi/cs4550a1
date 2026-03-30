"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as client from "./client";
import { setCurrentUser } from "./reducer";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch {
      dispatch(setCurrentUser(null));
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // fetch once on initial mount to restore server-side session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (pending) {
    return <div className="p-2">Loading session...</div>;
  }

  return children;
}
