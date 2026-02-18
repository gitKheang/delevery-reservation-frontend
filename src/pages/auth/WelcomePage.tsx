import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-primary/5 to-background px-5 pb-10 pt-20">
      {/* Logo Section */}
      <div className="flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-3xl font-bold text-primary-foreground">🍜</span>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground">Nham Ey 🇰🇭</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Cambodia&apos;s food delivery &amp; restaurant booking app
        </p>
      </div>

      {/* Features */}
      <div className="w-full space-y-3">
        {[
          {
            emoji: "🍲",
            title: "Order Khmer Food",
            desc: "Fish Amok, Lok Lak & more from Phnom Penh's best",
          },
          {
            emoji: "📅",
            title: "Reserve Tables",
            desc: "Book your table in advance with ease",
          },
          {
            emoji: "💳",
            title: "Pay with ABA / Wing",
            desc: "Fast checkout with Cambodia's top payment apps",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm"
          >
            <span className="text-2xl">{feature.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => navigate("/login")}
          className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-full rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground active:scale-[0.98]"
        >
          Create Account
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full py-2 text-xs font-medium text-muted-foreground"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
