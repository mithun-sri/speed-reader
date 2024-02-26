import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/users";

export default function AuthRoute({ fallback }: { fallback: string }) {
  const { isAuth } = useAuth();

  return isAuth ? <Outlet /> : <Navigate to={fallback} />;
}
