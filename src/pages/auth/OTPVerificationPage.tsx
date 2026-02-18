import { useState, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    toast.success("Verified successfully! ✅");
    navigate("/");
  };

  const handleResend = () => {
    toast.success("New code sent!");
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pb-10 pt-12">
      {/* Header */}
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={22} className="text-foreground" />
      </button>

      <div className="mt-8">
        <h1 className="text-2xl font-bold text-foreground">Verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="mt-10 flex justify-center gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`h-14 w-12 rounded-xl border text-center text-xl font-bold outline-none transition-all ${
              digit
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-card text-card-foreground"
            } focus:border-primary`}
          />
        ))}
      </div>

      {/* Resend */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button onClick={handleResend} className="font-semibold text-primary">
            Resend
          </button>
        </p>
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="mt-8 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
      >
        Verify
      </button>
    </div>
  );
};

export default OTPVerificationPage;
