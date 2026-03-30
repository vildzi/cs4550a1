import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "./client";

type CoursesState = {
  courses: Course[];
};

const initialState: CoursesState = {
  courses: [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addNewCourse: (state, action: PayloadAction<Course>) => {
      state.courses = [...state.courses, action.payload];
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      state.courses = state.courses.map((course) =>
        course._id === action.payload._id ? action.payload : course
      );
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
    },
  },
});

export const { setCourses, addNewCourse, updateCourse, deleteCourse } =
  coursesSlice.actions;
export default coursesSlice.reducer;
