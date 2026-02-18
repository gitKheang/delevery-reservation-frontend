import { useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, X, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockSystemEvents } from "@/data/mockData";
import type { SystemEvent } from "@/data/mockData";
import { toast } from "sonner";

const EventManagementPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState(mockSystemEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SystemEvent | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formType, setFormType] = useState<SystemEvent["type"]>("festival");
  const [formTarget, setFormTarget] =
    useState<SystemEvent["targetAudience"]>("all");

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormStart("");
    setFormEnd("");
    setFormType("festival");
    setFormTarget("all");
    setEditingEvent(null);
    setShowForm(false);
  };

  const openEdit = (event: SystemEvent) => {
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDesc(event.description);
    setFormStart(event.startDate);
    setFormEnd(event.endDate);
    setFormType(event.type);
    setFormTarget(event.targetAudience);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formTitle || !formStart) {
      toast.error("Title and start date are required");
      return;
    }
    if (editingEvent) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: formTitle,
                description: formDesc,
                startDate: formStart,
                endDate: formEnd || formStart,
                type: formType,
                targetAudience: formTarget,
              }
            : e,
        ),
      );
      toast.success(`"${formTitle}" updated! ✏️`);
    } else {
      const newEvent: SystemEvent = {
        id: `se_new_${Date.now()}`,
        title: formTitle,
        description: formDesc,
        startDate: formStart,
        endDate: formEnd || formStart,
        type: formType,
        status: "scheduled",
        targetAudience: formTarget,
      };
      setEvents([newEvent, ...events]);
      toast.success(`Event "${formTitle}" created! 🎉`);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted");
  };

  const typeEmoji = {
    holiday: "🙏",
    festival: "🎊",
    promotion: "📢",
    maintenance: "🔧",
  };

  const typeColor = {
    holiday: "bg-orange-100 text-orange-700",
    festival: "bg-pink-100 text-pink-700",
    promotion: "bg-blue-100 text-blue-700",
    maintenance: "bg-gray-100 text-gray-700",
  };

  const statusColor = {
    active: "bg-emerald-100 text-emerald-700",
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">
            Events & Holidays
          </h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus size={14} /> Create
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3 px-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="overflow-hidden rounded-2xl bg-card shadow-sm"
          >
            <div className="px-4 py-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{typeEmoji[event.type]}</span>
                  <div>
                    <h3 className="text-sm font-bold text-card-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${typeColor[event.type]}`}
                      >
                        {event.type}
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${statusColor[event.status]}`}
                      >
                        {event.status}
                      </span>
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                        {event.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(event)}
                    className="rounded-lg bg-blue-50 p-1.5"
                  >
                    <Pencil size={12} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="rounded-lg bg-red-50 p-1.5"
                  >
                    <Trash2 size={12} className="text-red-600" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {event.description}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays size={12} />
                {event.startDate}
                {event.endDate !== event.startDate && ` → ${event.endDate}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                {editingEvent ? "Edit Event" : "Create Event"}
              </h2>
              <button onClick={resetForm}>
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Khmer New Year Festival 🇰🇭"
                  className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Describe the event..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Type
                </label>
                <div className="mt-1 flex gap-2">
                  {(
                    ["festival", "holiday", "promotion", "maintenance"] as const
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormType(t)}
                      className={`flex-1 rounded-xl py-2 text-[10px] font-medium capitalize ${
                        formType === t
                          ? typeColor[t]
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {typeEmoji[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Target Audience
                </label>
                <div className="mt-1 flex gap-2">
                  {(["all", "customers", "restaurants"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => setFormTarget(a)}
                      className={`flex-1 rounded-xl py-2 text-xs font-medium capitalize ${
                        formTarget === a
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-card-foreground outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground active:scale-[0.98]"
              >
                {editingEvent ? "Save Changes" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementPage;
