import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Store,
  Shield,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginAs } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    await login(email, password);
    setLoading(false);
    toast.success("សួស្តី! Welcome back! 👋");
    navigate("/");
  };

  const handleDemoLogin = async (role: "customer" | "restaurant" | "admin") => {
    setLoading(true);
    await loginAs(role);
    setLoading(false);

    const messages = {
      customer: "សួស្តី! Welcome, Sokha! 🇰🇭",
      restaurant: "Welcome, Bopha! Malis Dashboard ready 🍽️",
      admin: "Admin access granted, Chanthy 🛡️",
    };
    toast.success(messages[role]);

    const redirects = {
      customer: "/",
      restaurant: "/owner/dashboard",
      admin: "/admin/dashboard",
    };
    navigate(redirects[role]);
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-12">
      {/* Header */}
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={22} className="text-foreground" />
      </button>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-foreground">
          សួស្តី! Welcome Back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your Nham Ey account
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Mail size={18} className="text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Password
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Lock size={18} className="text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} className="text-muted-foreground" />
              ) : (
                <Eye size={18} className="text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-xs font-medium text-primary"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </div>

      {/* Demo Login Section */}
      <div className="mt-8">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">Demo Login</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => handleDemoLogin("customer")}
            disabled={loading}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">
                Customer
              </p>
              <p className="text-xs text-muted-foreground">
                Browse, order & reserve as Sokha
              </p>
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin("restaurant")}
            disabled={loading}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
              <Store size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">
                Restaurant Owner
              </p>
              <p className="text-xs text-muted-foreground">
                Manage Malis Restaurant as Bopha
              </p>
            </div>
          </button>

          <button
            onClick={() => handleDemoLogin("admin")}
            disabled={loading}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
              <Shield size={18} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-card-foreground">
                Platform Admin
              </p>
              <p className="text-xs text-muted-foreground">
                Manage platform as Chanthy
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Register Restaurant */}
      <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Own a restaurant?{" "}
          <button
            onClick={() => navigate("/register-restaurant")}
            className="font-semibold text-primary"
          >
            Register your restaurant
          </button>{" "}
          on Nham Ey 🇰🇭
        </p>
      </div>

      {/* Sign Up Link */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-primary"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
