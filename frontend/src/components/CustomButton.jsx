import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900";
      case "secondary":
        return "bg-white text-slate-700 hover:bg-slate-50 border border-slate-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 border border-red-600";
      default:
        return "bg-slate-900 text-white hover:bg-slate-800 border border-slate-900";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2.5 rounded-lg
        font-medium text-sm
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CustomButton;

