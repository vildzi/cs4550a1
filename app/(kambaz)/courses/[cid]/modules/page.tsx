"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import ModulesControls from "./ModulesControls";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addModule, deleteModule, editModule, setModules, updateModule } from "./reducer";
import * as client from "../../client";
import { Module } from "../../client";

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

  const fetchModules = async () => {
    const modules = await client.findModulesForCourse(cid as string);
    dispatch(setModules(modules));
  };

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;
    const newModule = await client.createModuleForCourse(cid as string, {
      name: moduleName,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };

  const onRemoveModule = async (moduleId: string) => {
    await client.deleteModule(cid as string, moduleId);
    dispatch(deleteModule(moduleId));
  };

  const onUpdateModule = async (module: Module) => {
    await client.updateModule(cid as string, module);
    dispatch(updateModule(module));
  };

  return (
    <div>
      <ModulesControls
        canEdit={canEdit}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={onCreateModuleForCourse}
      />
      <br /><br /><br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules
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
                        onUpdateModule({ ...module, editing: false });
                      }
                    }}
                    defaultValue={module.name}
                  />
                )}
                <ModuleControlButtons
                  moduleId={module._id}
                  canEdit={canEdit}
                  deleteModule={(moduleId) => {
                    if (!canEdit) return;
                    onRemoveModule(moduleId);
                  }}
                  editModule={(moduleId) => {
                    if (!canEdit) return;
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
