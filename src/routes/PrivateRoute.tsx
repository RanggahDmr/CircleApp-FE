import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/hook";
import type { ReactNode } from "react";

export default function PrivateRoute({ children }: { children: ReactNode}) {
  const { token } = useAppSelector((state) => state.auth);

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
