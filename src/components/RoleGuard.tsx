import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Array<"customer" | "restaurant" | "admin">;
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap = {
      customer: "/",
      restaurant: "/owner/dashboard",
      admin: "/admin/dashboard",
    } as const;
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
