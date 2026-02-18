import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pb-6">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Privacy Policy</h1>
      </div>

      <div className="space-y-4 px-5">
        <p className="text-xs text-muted-foreground">
          Last updated: February 2026
        </p>

        {[
          {
            title: "1. Information We Collect",
            content:
              "We collect information you provide directly, such as name, email, phone number, and payment information. We also collect usage data and device information.",
          },
          {
            title: "2. How We Use Your Information",
            content:
              "We use your information to process orders, manage reservations, improve our services, send notifications, and provide customer support.",
          },
          {
            title: "3. Information Sharing",
            content:
              "We share your information with restaurants to fulfill orders and reservations. We do not sell your personal information to third parties.",
          },
          {
            title: "4. Data Security",
            content:
              "We implement industry-standard security measures to protect your data. Payment information is encrypted and processed through secure payment providers.",
          },
          {
            title: "5. Cookies and Tracking",
            content:
              "We use cookies and similar technologies to improve user experience, analyze usage patterns, and deliver personalized content.",
          },
          {
            title: "6. Your Rights",
            content:
              "You have the right to access, correct, or delete your personal data. You can also opt out of marketing communications at any time.",
          },
          {
            title: "7. Contact Us",
            content:
              "If you have questions about this Privacy Policy, please contact us at privacy@nhamey.com.kh or through the Help & Support section in the app.",
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

export default PrivacyPage;
