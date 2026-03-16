"use client";

import Link from "next/link";
import ArrayStateVariable from "./ArrayStateVariable";
import BooleanStateVariables from "./BooleanStateVariables";
import ClickEvent from "./ClickEvent";
import Counter from "./Counter";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import StringStateVariables from "./StringStateVariables";
import UrlEncoding from "./url-encoding";

export default function Lab4() {
  const sayHello = () => {
    alert("Hello");
  };

  return (
    <div id="wd-lab4">
      <h2>Lab 4</h2>
      <Link href="/labs/lab4/redux">Redux Examples</Link>
      <hr />
      <Link href="/labs/lab4/react-context">React Context Examples</Link>
      <hr />
      <Link href="/labs/lab4/zustand">Zustand Examples</Link>
      <hr />

      <ClickEvent />
      <PassingDataOnEvent />
      <PassingFunctions theFunction={sayHello} />
      <Counter />
      <BooleanStateVariables />
      <StringStateVariables />
      <DateStateVariable />
      <ObjectStateVariable />
      <ArrayStateVariable />
      <ParentStateComponent />
      <UrlEncoding />
    </div>
  );
}
