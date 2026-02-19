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

const hideNavPrefixRoutes = [
  "/settings/addresses/search",
  "/settings/addresses/map",
  "/settings/addresses/new",
];

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const location = useLocation();
  const isAddressEditRoute = /^\/settings\/addresses\/[^/]+\/edit$/.test(
    location.pathname,
  );
  const shouldHideByPrefix = hideNavPrefixRoutes.some((route) =>
    location.pathname.startsWith(route),
  );
  const showNav =
    !hideNavRoutes.includes(location.pathname) &&
    !shouldHideByPrefix &&
    !isAddressEditRoute;

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
