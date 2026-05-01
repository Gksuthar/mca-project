import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  if (!token || !userType) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
