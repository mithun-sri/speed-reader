import useMediaQuery from "@mui/material/useMediaQuery";
import { Navigate, Outlet } from "react-router-dom";

export default function DesktopRoute({ fallback }: { fallback: string }) {
  const matches = useMediaQuery("(min-width:768px)");

  return matches ? <Outlet /> : <Navigate to={fallback} />;
}
