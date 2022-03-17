import React from "react";

import { ReactComponent as Upload } from "../../svgs/upload.svg";
import "./FileUploadButton.css";

function FileUploadButton({ label, id, onFileChange, ...props }) {
  const handleChange = (evt) => onFileChange(evt.target.files[0]);
  return (
    <>
      <input
        type="file"
        id={id || "file-upload"}
        onChange={handleChange}
        hidden
        {...props}
      />
      <label className="FileUploadButton" htmlFor={id || "file-upload"}>
        <Upload className="FileUploadButton-icon" />
        {label}
      </label>
    </>
  );
}

export default FileUploadButton;
