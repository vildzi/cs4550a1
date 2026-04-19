import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/reducer";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import assignmentsReducer from "./courses/[cid]/assignments/reducer";
import quizzesReducer from "./courses/[cid]/quizzes/reducer";

export const store = configureStore({
  reducer: {
    accountReducer,
    coursesReducer,
    modulesReducer,
    assignmentsReducer,
    quizzesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
