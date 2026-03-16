import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { enrollments } from "../database";

type Enrollment = {
  _id: string;
  user: string;
  course: string;
};

type EnrollmentsState = {
  enrollments: Enrollment[];
};

const initialState: EnrollmentsState = {
  enrollments: enrollments as Enrollment[],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enroll: (state, { payload }: PayloadAction<{ userId: string; courseId: string }>) => {
      const alreadyEnrolled = state.enrollments.some(
        (enrollment) => enrollment.user === payload.userId && enrollment.course === payload.courseId,
      );
      if (alreadyEnrolled) {
        return;
      }
      state.enrollments = [...state.enrollments, { _id: uuidv4(), user: payload.userId, course: payload.courseId }];
    },
    unenroll: (state, { payload }: PayloadAction<{ userId: string; courseId: string }>) => {
      state.enrollments = state.enrollments.filter(
        (enrollment) => !(enrollment.user === payload.userId && enrollment.course === payload.courseId),
      );
    },
    toggleEnrollment: (state, { payload }: PayloadAction<{ userId: string; courseId: string }>) => {
      const enrolled = state.enrollments.some(
        (enrollment) => enrollment.user === payload.userId && enrollment.course === payload.courseId,
      );
      if (enrolled) {
        state.enrollments = state.enrollments.filter(
          (enrollment) => !(enrollment.user === payload.userId && enrollment.course === payload.courseId),
        );
      } else {
        state.enrollments = [...state.enrollments, { _id: uuidv4(), user: payload.userId, course: payload.courseId }];
      }
    },
  },
});

export const { enroll, unenroll, toggleEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
