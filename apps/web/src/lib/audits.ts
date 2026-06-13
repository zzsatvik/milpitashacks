import type { LawnAnalysis } from "@terraview/shared";
import { insforge } from "./insforge";

export interface SavedAudit {
  id: string;
  user_id: string;
  summary: string;
  overall_grade: string;
  analysis: LawnAnalysis;
  created_at: string;
}

export async function saveAudit(
  userId: string,
  analysis: LawnAnalysis,
): Promise<SavedAudit | null> {
  if (!insforge) return null;

  const { data, error } = await insforge.database
    .from("lawn_audits")
    .insert({
      user_id: userId,
      summary: analysis.summary,
      overall_grade: analysis.scores.overall_grade,
      analysis,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to save audit:", error);
    return null;
  }

  return data as SavedAudit;
}

export async function fetchUserAudits(
  userId: string,
): Promise<SavedAudit[]> {
  if (!insforge) return [];

  const { data, error } = await insforge.database
    .from("lawn_audits")
    .select("id, user_id, summary, overall_grade, analysis, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch audits:", error);
    return [];
  }

  return (data ?? []) as SavedAudit[];
}
