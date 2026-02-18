import { ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const team = [
    { name: "Sarah Chen", role: "CEO & Founder" },
    { name: "Marcus Johnson", role: "CTO" },
    { name: "Emily Park", role: "Head of Design" },
    { name: "David Miller", role: "Head of Operations" },
  ];

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">About</h1>
      </div>

      {/* App Info */}
      <div className="mx-5 flex flex-col items-center rounded-2xl bg-card p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <span className="text-2xl font-bold text-primary-foreground">FR</span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-card-foreground">
          FoodReserve
        </h2>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          FoodReserve is your all-in-one platform for ordering food and
          reserving tables at the best restaurants in your area.
        </p>
      </div>

      {/* Team */}
      <div className="mt-5 px-5">
        <h2 className="text-sm font-bold text-foreground">Our Team</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-card p-4 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="mt-2 text-xs font-semibold text-card-foreground">
                {member.name}
              </h3>
              <p className="text-[10px] text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="mx-5 mt-5 overflow-hidden rounded-2xl bg-card shadow-sm">
        {["Terms of Service", "Privacy Policy", "Open Source Licenses"].map(
          (label, index) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Terms of Service") navigate("/terms");
                if (label === "Privacy Policy") navigate("/privacy");
              }}
              className={`flex w-full items-center justify-between px-4 py-3.5 ${
                index < 2 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm font-medium text-card-foreground">
                {label}
              </span>
              <ExternalLink size={14} className="text-muted-foreground" />
            </button>
          ),
        )}
      </div>
    </div>
  );
};

export default AboutPage;
