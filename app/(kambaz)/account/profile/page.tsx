"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FormControl, FormSelect } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";

type ProfileUser = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  role: string;
};

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileUser | null>(() => (currentUser as ProfileUser | null));

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);

  const signout = () => {
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };

  const activeProfile = profile || (currentUser as ProfileUser | null);

  if (!activeProfile) {
    return null;
  }

  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl id="wd-username" value={activeProfile.username}
        onChange={(e) => setProfile({ ...activeProfile, username: e.target.value })}
        placeholder="username" className="mb-2" />
      <FormControl id="wd-password" value={activeProfile.password}
        onChange={(e) => setProfile({ ...activeProfile, password: e.target.value })}
        placeholder="password" type="password"
        className="mb-2" />
      <FormControl id="wd-firstname" value={activeProfile.firstName}
        onChange={(e) => setProfile({ ...activeProfile, firstName: e.target.value })}
        placeholder="First Name" className="mb-2" />
      <FormControl id="wd-lastname" value={activeProfile.lastName}
        onChange={(e) => setProfile({ ...activeProfile, lastName: e.target.value })}
        placeholder="Last Name" className="mb-2" />
      <FormControl id="wd-dob" value={activeProfile.dob?.toString().slice(0, 10) || ""}
        onChange={(e) => setProfile({ ...activeProfile, dob: e.target.value })}
        type="date" className="mb-2" />
      <FormControl id="wd-email" value={activeProfile.email}
        onChange={(e) => setProfile({ ...activeProfile, email: e.target.value })}
        type="email" className="mb-2" />
      <FormSelect id="wd-role" value={activeProfile.role}
        onChange={(e) => setProfile({ ...activeProfile, role: e.target.value })}
        className="mb-3">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </FormSelect>
      <Button onClick={signout} className="w-100 btn-danger" id="wd-signout-btn">
        Sign out
      </Button>
    </div>
  );
}
