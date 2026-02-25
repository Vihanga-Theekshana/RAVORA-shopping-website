import { Navigate } from "react-router-dom";

const Protectedroute = ({ children }) => {
  const token = localStorage.getItem("acesstoken");
  const role = localStorage.getItem("role");

  if (!token || role != "admin") {
    return <Navigate to="/Login" replace />;
  }

  return children;
};
export default Protectedroute;
