import React from "react";
import CustomButton from "./CustomButton";

const DeleteConfirm = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 ease-in-out animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-slate-900 mb-3">Confirm Delete</h3>

        <p className="text-slate-600 mb-6 leading-relaxed">
          {message ||
            "Are you sure you want to delete this item? This action cannot be undone."}
        </p>

        <div className="flex justify-end gap-3">
          <CustomButton onClick={onClose} variant="secondary">
            Cancel
          </CustomButton>
          <CustomButton onClick={onConfirm} variant="danger">
            Delete
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;

