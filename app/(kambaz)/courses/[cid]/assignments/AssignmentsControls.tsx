"use client";

import { FormControl, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { BsSearch } from "react-icons/bs";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AssignmentsControls() {
  const { cid } = useParams<{ cid: string }>();
  return (
    <div id="wd-assignments-controls" className="text-nowrap">
      <Link href={`/courses/${cid}/assignments/new`}
        className="btn btn-danger btn-lg me-1 float-end" id="wd-add-assignment-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Link>
      <Link href={`/courses/${cid}/assignments/new`}
        className="btn btn-secondary btn-lg me-2 float-end" id="wd-add-assignment-group-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </Link>
      <InputGroup className="w-50">
        <InputGroupText className="bg-white">
          <BsSearch />
        </InputGroupText>
        <FormControl
          id="wd-search-assignment"
          placeholder="Search for Assignments"
        />
      </InputGroup>
    </div>
  );
}
