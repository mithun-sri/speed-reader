import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/users";

export default function UserRoute({ fallback }: { fallback: string }) {
  const { isUser } = useAuth();

  return isUser ? <Outlet /> : <Navigate to={fallback} />;
}
