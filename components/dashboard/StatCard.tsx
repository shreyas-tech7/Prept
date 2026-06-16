import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{hint}</p>}
    </div>
  );
}
