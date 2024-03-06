import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/users";

const VISITED_COOKIE = "visited";

export default function GuestRoute({ fallback }: { fallback: string }) {
  const { isGuest } = useAuth();
  const [cookies] = useCookies([VISITED_COOKIE]);

  if (!isGuest) {
    return <Navigate to={fallback} />;
  }
  if (!cookies.visited) {
    return <Navigate to="/tutorial" />;
  }

  return <Outlet />;
}
