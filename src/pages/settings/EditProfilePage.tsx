import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = () => {
    if (!user) {
      toast.error("Please sign in to update profile");
      navigate("/login");
      return;
    }
    updateProfile({ name, email, phone });
    toast.success("Profile updated! ✓");
    navigate(-1);
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
        </div>
        <button
          onClick={handleSave}
          className="text-sm font-semibold text-primary"
        >
          Save
        </button>
      </div>

      {/* Avatar */}
      <div className="mt-4 flex justify-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-md">
            <Camera size={14} className="text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="mt-8 space-y-4 px-5">
        {[
          { label: "Full Name", value: name, setter: setName, type: "text" },
          { label: "Email", value: email, setter: setEmail, type: "email" },
          { label: "Phone", value: phone, setter: setPhone, type: "tel" },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs font-medium text-muted-foreground">
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProfilePage;
