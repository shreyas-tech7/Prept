import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { formatRelativeDate, scoreColor } from "@/lib/utils";
import type { Session } from "@/types";

function typeVariant(t: string): BadgeProps["variant"] {
  if (t === "behavioral") return "behavioral";
  if (t === "technical") return "technical";
  if (t === "mixed") return "mixed";
  return "neutral";
}

export function RecentSessions({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[#2A2A3C] bg-[#13131A] p-10 text-center">
        <p className="font-display text-xl">You haven&apos;t practiced yet.</p>
        <p className="mt-1 text-[#9492A4]">Let&apos;s start.</p>
        <Link
          href="/session/new"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:underline"
        >
          Start your first session
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#2A2A3C] bg-[#13131A]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#2A2A3C] text-left text-xs uppercase tracking-wider text-[#9492A4]">
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="hidden px-5 py-3 font-medium sm:table-cell">Type</th>
            <th className="px-5 py-3 font-medium">Score</th>
            <th className="hidden px-5 py-3 font-medium md:table-cell">Date</th>
            <th className="px-5 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.id}
              className="border-b border-[#2A2A3C] last:border-0 transition-colors hover:bg-[#1C1C27]/50"
            >
              <td className="px-5 py-4">
                <span className="font-medium text-[#F1F0EE]">{s.role}</span>
                <span className="block text-xs capitalize text-[#9492A4] sm:hidden">
                  {s.interview_type}
                </span>
              </td>
              <td className="hidden px-5 py-4 sm:table-cell">
                <Badge variant={typeVariant(s.interview_type)}>
                  {s.interview_type}
                </Badge>
              </td>
              <td className="px-5 py-4">
                {s.status === "completed" && s.total_score != null ? (
                  <span
                    className="font-semibold"
                    style={{ color: scoreColor(Number(s.total_score)) }}
                  >
                    {Number(s.total_score).toFixed(1)}
                  </span>
                ) : (
                  <span className="text-[#9492A4]">—</span>
                )}
              </td>
              <td className="hidden px-5 py-4 text-[#9492A4] md:table-cell">
                {formatRelativeDate(s.created_at)}
              </td>
              <td className="px-5 py-4">
                {s.status === "completed" ? (
                  <Badge variant="success">Completed</Badge>
                ) : (
                  <Link
                    href={`/session/${s.id}`}
                    className="inline-flex items-center gap-1 font-medium text-amber-400 hover:underline"
                  >
                    Resume
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
