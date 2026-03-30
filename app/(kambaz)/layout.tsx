"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import KambazNavigation from "./Navigation";
import Session from "./account/Session";
import { store } from "./store";
import "./styles.css";

export default function KambazLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz">
          <div className="d-flex">
            <div>
              <KambazNavigation />
            </div>
            <div className="wd-main-content-offset p-3 flex-fill">
              {children}
            </div>
          </div>
        </div>
      </Session>
    </Provider>
  );
}
