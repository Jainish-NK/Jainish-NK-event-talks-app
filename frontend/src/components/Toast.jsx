import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type === "error" ? "toast-error" : "toast-success"}`}>
      <span>
        {type === "error" ? "❌" : "✅"} {message}
      </span>
    </div>
  );
}
