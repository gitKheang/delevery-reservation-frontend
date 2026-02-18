import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the Terms & Conditions");
      return;
    }
    setLoading(true);
    await signup(name, email, phone, password);
    setLoading(false);
    toast.success("Account created! 🎉");
    navigate("/otp-verification");
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-12">
      {/* Header */}
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={22} className="text-foreground" />
      </button>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join FoodReserve today
        </p>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Full Name
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <User size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        </div>

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
            Phone (optional)
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Phone size={18} className="text-muted-foreground" />
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              placeholder="Create a password"
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

        {/* Terms */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 h-5 w-5 flex-shrink-0 rounded border ${
              agreed ? "border-primary bg-primary" : "border-border bg-card"
            } flex items-center justify-center`}
          >
            {agreed && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <p className="text-xs text-muted-foreground">
            I agree to the{" "}
            <button
              onClick={() => navigate("/terms")}
              className="font-medium text-primary"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              onClick={() => navigate("/privacy")}
              className="font-medium text-primary"
            >
              Privacy Policy
            </button>
          </p>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </div>

      {/* Sign In Link */}
      <div className="mt-auto pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-primary"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
