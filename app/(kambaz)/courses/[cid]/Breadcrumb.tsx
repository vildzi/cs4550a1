"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa6";

function capitalizeFirstLetter(str?: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export default function Breadcrumb({ course }: { course: { name: string } | undefined; }) {
  const pathname = usePathname();
  return (
    <h2 className="text-danger">
      <FaAlignJustify className="me-4 fs-4 mb-1" />
      {course?.name} &gt; {capitalizeFirstLetter(pathname.split("/").pop())}
    </h2>
  );
}
