import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const styles = {
    primary: { background: "#7C3AED", color: "#fff", border: "1px solid #7C3AED" },
    secondary: { background: "#1F2937", color: "#D1D5DB", border: "1px solid #374151" },
    danger: { background: "#7F1D1D", color: "#FCA5A5", border: "1px solid #991B1B" },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 ${className}`}
      style={styles[variant] || styles.primary}
    >
      {children}
    </button>
  );
};

export default CustomButton;
