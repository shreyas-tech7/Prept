import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const supabase = createServerClient();

    const { data: responses } = await supabase
      .from("responses")
      .select("score")
      .eq("session_id", sessionId);

    const totalScore =
      responses && responses.length > 0
        ? responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length
        : 0;

    const { data } = await supabase
      .from("sessions")
      .update({
        status: "completed",
        total_score: Math.round(totalScore * 10) / 10,
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .select()
      .single();

    return NextResponse.json({
      session: data,
      averageScore: Math.round(totalScore * 10) / 10,
    });
  } catch (error) {
    console.error("End session error:", error);
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 }
    );
  }
}
