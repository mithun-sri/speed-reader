import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/users";

export default function GuestRoute({ fallback }: { fallback: string }) {
  const { isGuest } = useAuth();

  return isGuest ? <Outlet /> : <Navigate to={fallback} />;
}
