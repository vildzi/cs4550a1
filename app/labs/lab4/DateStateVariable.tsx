"use client";

import { useState } from "react";
import { FormControl } from "react-bootstrap";

const dateObjectToHtmlDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DateStateVariable() {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div id="wd-date-state-variables">
      <h2>Date State Variables</h2>
      <h3>{JSON.stringify(startDate)}</h3>
      <h3>{dateObjectToHtmlDateString(startDate)}</h3>
      <FormControl
        type="date"
        value={dateObjectToHtmlDateString(startDate)}
        onChange={(e) => setStartDate(new Date(`${e.target.value}T00:00:00`))}
      />
      <hr />
    </div>
  );
}
