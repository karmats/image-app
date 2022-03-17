import React from "react";

import "./Input.css";

function Input({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id || "input"}>{label}</label>
      <input id={id || "input"} className="Input" {...props}></input>
    </div>
  );
}

export default Input;
