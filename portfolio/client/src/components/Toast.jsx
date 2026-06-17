import React, { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const borderClass = type === "error" ? "border-red-500" : "border-primary";
  const iconClass = type === "error" ? "fa-circle-xmark text-red-500" : "fa-circle-check text-primary";

  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 bg-slate-900 border-l-4 ${borderClass} text-white text-sm font-semibold rounded-lg shadow-lg border border-slate-800`}>
      <i className={`fa-solid ${iconClass} text-base`}></i>
      <span>{message}</span>
    </div>
  );
}
