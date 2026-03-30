import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module } from "../../client";

type ModulesState = {
  modules: Module[];
};

const initialState: ModulesState = {
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action: PayloadAction<Module[]>) => {
      state.modules = action.payload;
    },
    addModule: (state, action: PayloadAction<Module>) => {
      state.modules = [...state.modules, action.payload];
    },
    updateModule: (state, action: PayloadAction<Module>) => {
      state.modules = state.modules.map((module) =>
        module._id === action.payload._id ? action.payload : module
      );
    },
    deleteModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.filter((module) => module._id !== action.payload);
    },
    editModule: (state, action: PayloadAction<string>) => {
      state.modules = state.modules.map((module) =>
        module._id === action.payload
          ? { ...module, editing: true }
          : { ...module, editing: false }
      );
    },
  },
});

export const { setModules, addModule, updateModule, deleteModule, editModule } =
  modulesSlice.actions;
export default modulesSlice.reducer;
