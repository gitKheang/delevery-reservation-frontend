interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  confirmed: "bg-success/15 text-success",
  pending: "bg-primary/15 text-primary",
  cancelled: "bg-destructive/15 text-destructive",
  completed: "bg-muted text-muted-foreground",
  preparing: "bg-primary/15 text-primary",
  almost_ready: "bg-accent/15 text-accent",
  ready: "bg-success/15 text-success",
  served: "bg-success/15 text-success",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
  preparing: "Preparing",
  almost_ready: "Almost Ready",
  ready: "Ready to Serve",
  served: "Served",
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        statusStyles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {statusLabels[status] || status}
    </span>
  );
};

export default StatusBadge;
