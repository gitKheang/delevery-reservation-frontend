import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="mt-2 text-xl font-bold text-foreground">Page Not Found</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        <Home size={16} />
        Go Home
      </button>
    </div>
  );
};

export default NotFound;
