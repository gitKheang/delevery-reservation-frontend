import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSent(true);
    toast.success("Reset link sent! 📧");
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-12">
      {/* Header */}
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={22} className="text-foreground" />
      </button>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {sent
            ? "Check your email for the reset link"
            : "Enter your email to receive a password reset link"}
        </p>
      </div>

      {!sent ? (
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

          <button
            onClick={handleSend}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
          >
            Send Reset Link
          </button>
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Mail size={32} className="text-primary" />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Back to Login
          </button>
          <button
            onClick={() => {
              setSent(false);
              toast.success("New link sent!");
            }}
            className="mt-3 text-xs font-medium text-primary"
          >
            Resend Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
