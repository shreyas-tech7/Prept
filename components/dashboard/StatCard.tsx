import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#2A2A3C] bg-[#13131A] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#9492A4]">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-[#9492A4]">{hint}</p>}
    </div>
  );
}
