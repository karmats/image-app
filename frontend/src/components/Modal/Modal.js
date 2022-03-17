import React from "react";
import Button from "../Button";
import "./Modal.css";

function Modal({ title, active, onClose, onConfirm, children }) {
  return (
    <div className={`Modal ${active ? "show" : ""}`}>
      <div className="Modal-container">
        <header className="Modal-header">
          <h2>{title}</h2>
          <span className="Modal-close" onClick={onClose}>
            &times;
          </span>
        </header>
        <div className="Modal-content">{children}</div>
        <footer className="Modal-footer">
          <Button mode="text" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Ok</Button>
        </footer>
      </div>
    </div>
  );
}

export default Modal;
