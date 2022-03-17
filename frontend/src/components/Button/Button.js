import React from "react";
import "./Button.css";

function Button({ children, mode, ...props }) {
  return (
    <button
      className={`Button ${mode === "text" ? "Button-text" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
