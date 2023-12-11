import React from "react";
import { Children } from "../types/interface";
import s from "./css/Header.module.css";

function Header({ children }: Children): React.ReactElement {
  return (
    <header>
      <div className={s.heading}>
        <h1>TODO</h1>
        {children}
      </div>
    </header>
  );
}

export default Header;
