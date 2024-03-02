import useMediaQuery from "@mui/material/useMediaQuery";
import { Navigate, Outlet } from "react-router-dom";

export default function MobileRoute({ fallback }: { fallback: string }) {
  const matches = useMediaQuery("(max-width:768px)");

  return matches ? <Outlet /> : <Navigate to={fallback} />;
}
