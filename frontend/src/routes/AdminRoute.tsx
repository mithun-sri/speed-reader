import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/users";

export default function AdminRoute({ fallback }: { fallback: string }) {
  const { isAdmin } = useAuth();

  return isAdmin ? <Outlet /> : <Navigate to={fallback} />;
}
