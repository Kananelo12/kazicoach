// app/api/gemini/route.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { firebaseDb } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function POST(request: Request) {
  const { interests, skills, goals, education } = await request.json();

  // 1) Validate
  if (
    !Array.isArray(interests) ||
    !Array.isArray(skills) ||
    typeof goals !== "string" ||
    typeof education !== "string"
  ) {
    return Response.json({ success: false, message: "All fields required." }, { status: 400 });
  }

  // 2) Authenticate
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  // 3) Prompt Gemini
  const prompt = `
Please return an array of exactly 3 objects in JSON with this schema (no markdown fences):
[
  {
    "title": "...",
    "description": "...",
    "suggestedSkills": ["...","...",...],
    "motivationQuote": "..."
  },
  ...
]
Base yours on:
- Interests: ${interests.join(", ")}
- Skills: ${skills.join(", ")}
- Goals: ${goals}
- Education: ${education}
`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    // 4) Strip any ```json and backticks
    const cleaned = text
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    // 5) Parse
    let suggestions: {
      title: string;
      description: string;
      suggestedSkills: string[];
      motivationQuote: string;
    }[];

    try {
      suggestions = JSON.parse(cleaned);
      if (!Array.isArray(suggestions)) {
        throw new Error("Parsed result is not an array");
      }
    } catch (e) {
      console.error("Parsing error:", e, "raw:", text);
      return Response.json(
        { success: false, message: "AI returned invalid JSON." },
        { status: 500 }
      );
    }

    // 6) Build and save
    const now = new Date().toISOString();
    const doc = {
      userId: user.id,
      userInput: { interests, skills, goals, education },
      aiResponse: { suggestions, timestamp: now },
      createdAt: now,
    };
    await firebaseDb.collection("career_suggestions").add(doc);

    return Response.json({ success: true, document: doc }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/gemini:", error);
    return Response.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
