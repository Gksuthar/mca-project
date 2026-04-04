import React from "react";
import CustomButton from "./CustomButton";
const DeleteConfirm = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div className="rounded-lg p-6 max-w-sm w-full mx-4 animate-fade-in" style={{ background: "#111827", border: "1px solid #1F2937", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold mb-2" style={{ color: "#F3F4F6" }}>Confirm Delete</h3>
        <p className="text-sm mb-5" style={{ color: "#9CA3AF" }}>{message || "Are you sure you want to delete this item? This action cannot be undone."}</p>
        <div className="flex justify-end gap-2">
          <CustomButton onClick={onClose} variant="secondary">Cancel</CustomButton>
          <CustomButton onClick={onConfirm} variant="danger">Delete</CustomButton>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirm;
