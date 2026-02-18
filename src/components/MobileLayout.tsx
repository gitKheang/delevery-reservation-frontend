import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";

const hideNavRoutes = [
  "/welcome",
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/otp-verification",
  "/register-restaurant",
  "/terms",
  "/privacy",
];

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <main className={`flex-1 overflow-y-auto ${showNav ? "pb-20" : ""}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default MobileLayout;
