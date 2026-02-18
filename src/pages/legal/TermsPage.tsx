import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Terms of Service</h1>
      </div>

      <div className="space-y-4 px-5">
        <p className="text-xs text-muted-foreground">
          Last updated: February 2026
        </p>

        {[
          {
            title: "1. Acceptance of Terms",
            content:
              "By accessing and using Nham Ey, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
          },
          {
            title: "2. Use of Services",
            content:
              "Our services allow you to browse restaurant menus, place food orders, and make table reservations. You must be at least 18 years old to use our services.",
          },
          {
            title: "3. Account Registration",
            content:
              "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration.",
          },
          {
            title: "4. Orders and Payments",
            content:
              "All orders are subject to acceptance by the restaurant. Prices may vary and are set by individual restaurants. Payment is processed securely through our platform.",
          },
          {
            title: "5. Cancellation Policy",
            content:
              "Orders can be cancelled within 5 minutes of placement. Reservations can be cancelled up to 2 hours before the scheduled time without penalty.",
          },
          {
            title: "6. Privacy",
            content:
              "Your use of our services is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.",
          },
          {
            title: "7. Limitation of Liability",
            content:
              "Nham Ey is not responsible for the quality of food or services provided by restaurants. We act as an intermediary platform.",
          },
        ].map((section) => (
          <div key={section.title}>
            <h2 className="text-sm font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsPage;
