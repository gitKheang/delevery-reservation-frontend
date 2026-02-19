import {
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse restaurants, select items, add them to your cart, and proceed to checkout. You'll receive real-time updates on your order status.",
  },
  {
    question: "How do I reserve a table?",
    answer:
      "Go to a restaurant page, tap 'Reserve', select date, time, guests, and table. You'll receive a confirmation notification.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "You can cancel within 5 minutes of placing your order. After that, please contact the restaurant directly.",
  },
  {
    question: "How do loyalty points work?",
    answer:
      "You earn points for every order and reservation. Points can be redeemed for discounts on future orders.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay.",
  },
];

const HelpPage = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactOptions = [
    {
      icon: MessageSquare,
      label: "Live Chat",
      onClick: () => toast.info("Live chat is available in mock mode only"),
    },
    {
      icon: Phone,
      label: "Call Us",
      onClick: () => window.open("tel:+85523999888", "_self"),
    },
    {
      icon: Mail,
      label: "Email",
      onClick: () => window.open("mailto:support@nhamey.com.kh", "_self"),
    },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Help & Support</h1>
      </div>

      {/* Contact Options */}
      <div className="mx-5 grid grid-cols-3 gap-3">
        {contactOptions.map((option) => (
          <button
            key={option.label}
            onClick={option.onClick}
            className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm"
          >
            <option.icon size={20} className="text-primary" />
            <span className="text-xs font-medium text-card-foreground">
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="mt-6 px-5">
        <h2 className="text-sm font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mt-3 space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-card shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-3.5"
              >
                <span className="text-left text-sm font-medium text-card-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`flex-shrink-0 text-muted-foreground transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="border-t border-border px-4 py-3">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
