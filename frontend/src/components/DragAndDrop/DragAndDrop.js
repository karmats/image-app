import React, { useState } from "react";
import { ReactComponent as Upload } from "../../svgs/upload.svg";

import "./DragAndDrop.css";

function DragAndDrop({ children, onFileChange }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const preventDefaults = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };
  const handleDragEnter = (evt) => {
    preventDefaults(evt);
    setIsDragActive(true);
  };
  const handleDragLeave = (evt) => {
    preventDefaults(evt);
    setIsDragActive(false);
  };
  const handleDrop = (evt) => {
    preventDefaults(evt);
    setIsDragActive(false);
    onFileChange(evt.dataTransfer.files[0]);
  };
  return (
    <div
      className={`DragAndDrop ${isDragActive ? "show" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={preventDefaults}
      onDrop={handleDrop}
    >
      <div className="DragAndDrop-img">
        <Upload />
      </div>
      {children}
    </div>
  );
}

export default DragAndDrop;
