export function buildQuestionPrompt({
  role,
  interviewType,
  difficulty,
  jobDescription,
  previousQuestions,
}: {
  role: string;
  interviewType: string;
  difficulty: string;
  jobDescription?: string;
  previousQuestions: string[];
}) {
  const difficultyMap = {
    entry: "foundational questions about concepts and basic experience",
    mid: "applied questions requiring demonstrated experience and problem-solving",
    senior:
      "strategic questions requiring leadership, architecture decisions, and broad impact",
  };

  return `You are an expert interview coach. Generate ONE interview question.

Role: ${role}
Interview type: ${interviewType}
Difficulty level: ${difficulty} — focus on ${
    difficultyMap[difficulty as keyof typeof difficultyMap] ??
    difficultyMap.mid
  }
${jobDescription ? `Job description context:\n${jobDescription}` : ""}

Previously asked questions (do NOT repeat these):
${
  previousQuestions.length > 0
    ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
    : "None yet"
}

Rules:
- For behavioral: start with "Tell me about a time when..." or "Describe a situation where..."
- For technical: ask about role-specific tools, concepts, or real scenarios
- For mixed: alternate between behavioral and technical
- Never repeat a question already asked
- Match the difficulty level strictly

Return ONLY valid JSON, no markdown, no explanation:
{
  "question": "the full question text",
  "question_type": "behavioral" | "technical" | "situational",
  "tip": "a brief 1-sentence tip for how to approach this question"
}`;
}

export function buildEvaluationPrompt({
  role,
  question,
  questionType,
  difficulty,
  answer,
}: {
  role: string;
  question: string;
  questionType: string;
  difficulty: string;
  answer: string;
}) {
  return `You are an expert interview coach evaluating a candidate's response.

Role: ${role}
Difficulty: ${difficulty}
Question: ${question}
Question Type: ${questionType}

Candidate's answer: ${answer}

Evaluate this answer thoroughly. Scoring guide:
- 1–3: Vague, off-topic, or missing key elements entirely
- 4–6: Covers basics but lacks specifics, depth, structure, or demonstrated impact
- 7–8: Solid answer with relevant examples and clear communication
- 9–10: Exceptional — strong storytelling, quantified results, genuine insight

Return ONLY valid JSON, no markdown, no explanation:
{
  "score": <number 1-10>,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific actionable improvement 1", "specific actionable improvement 2"],
  "model_answer": "A strong answer to this question would begin by... [write a full 3-5 sentence model response]",
  "star_breakdown": ${
    questionType === "behavioral"
      ? `{
    "situation": <0-3>,
    "task": <0-3>,
    "action": <0-3>,
    "result": <0-3>
  }`
      : "null"
  }
}

Be honest but encouraging. Focus on specific, actionable feedback. Never be harsh or discouraging.`;
}
