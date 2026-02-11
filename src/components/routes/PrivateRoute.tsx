// src/components/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  return token && token !== "undefined" ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
