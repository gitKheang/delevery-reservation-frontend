import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "fr", label: "French", native: "Français" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "ko", label: "Korean", native: "한국어" },
];

const LanguagePage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("en");

  const handleSelect = (code: string) => {
    setSelected(code);
    toast.success("Language updated!");
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-12">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Language</h1>
      </div>

      {/* Language List */}
      <div className="mx-5 overflow-hidden rounded-2xl bg-card shadow-sm">
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`flex w-full items-center justify-between px-4 py-4 ${
              index < languages.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <h3 className="text-sm font-medium text-card-foreground">
                {lang.label}
              </h3>
              <p className="text-xs text-muted-foreground">{lang.native}</p>
            </div>
            {selected === lang.code && (
              <Check size={18} className="text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguagePage;
