import React from "react";
import { Navigate, useLocation } from "react-router-dom";


const RequireAuth = ({ children }) => {
  const user = localStorage.getItem("userId");
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  // Kiểm tra vai trò admin
  const userRole = localStorage.getItem("userRole");
  if (userRole !== "ROLE_RENTAL") {
    return <p className="text-danger text-center">Chỉ rental mới được phép truy cập.</p>;
  }
  return children;
  
};
export default RequireAuth;
