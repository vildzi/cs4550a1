import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/reducer";
import assignmentsReducer from "./courses/assignments/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import coursesReducer from "./courses/reducer";
import enrollmentsReducer from "./enrollments/reducer";

const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    enrollmentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
