import React from "react";

import "./Notification.css";

function Notification({ text, type, onDismiss }) {
  return (
    <div role="alert" className={`Notification Notification-${type}`}>
      {text}
      <span className="Notification-close" onClick={onDismiss}>
        &times;
      </span>
    </div>
  );
}

export default Notification;
