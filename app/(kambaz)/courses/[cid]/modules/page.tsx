"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addModule, deleteModule, editModule, Module, updateModule } from "./reducer";

type Lesson = {
  _id: string;
  name: string;
};

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const canEdit = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <div>
      <ModulesControls
        canEdit={canEdit}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          if (!canEdit) {
            return;
          }
          if (!moduleName.trim()) {
            return;
          }
          dispatch(addModule({ name: moduleName, course: cid as string }));
          setModuleName("");
        }}
      />
      <br /><br /><br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules
          .filter((module: Module) => module.course === cid)
          .map((module: Module) => (
            <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray" key={module._id}>
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {(!module.editing || !canEdit) && module.name}
                {module.editing && canEdit && (
                  <FormControl
                    className="w-50 d-inline-block"
                    onChange={(e) =>
                      dispatch(updateModule({ ...module, name: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(updateModule({ ...module, editing: false }));
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  canEdit={canEdit}
                  deleteModule={(moduleId) => {
                    if (!canEdit) {
                      return;
                    }
                    dispatch(deleteModule(moduleId));
                  }}
                  editModule={(moduleId) => {
                    if (!canEdit) {
                      return;
                    }
                    dispatch(editModule(moduleId));
                  }}
                />
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {(module.lessons as Lesson[]).map((lesson: Lesson) => (
                    <ListGroupItem className="wd-lesson p-3 ps-1" key={lesson._id}>
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}


