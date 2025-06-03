import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { firebaseDb } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET() {
  return Response.json(
    { success: true, data: "Gemini endpoint is live!" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  const { interests, skills, goals, education } = await request.json();

  if (!interests || !skills || !goals || !education) {
    return Response.json(
      { success: false, message: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Get user ID from session
    const user = await getCurrentUser();
    if (!user) {
      return Response.json(
        { success: false, data: "User not authenticated." },
        { status: 401 }
      );
    }
    const userId = user.id;

    // Call Gemini AI to generate career suggestions
    const { text } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Suggest 3 suitable career paths in JSON array format based on the following user profile:
            Interests: ${interests.join(", ")}
            Skills: ${skills.join(", ")}
            Goals: ${goals}
            Education: ${education}
            
            Return only a JSON array of strings, for example:
        ["Career 1", "Career 2", "Career 3"]`,
    });

    // Parse the AI response (expects a JSON array)
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(text);
    } catch {
      // If parsing fails, wrap raw text in array
      suggestions = [text.trim()];
    }

    // Build the document to save
    const careerDocument = {
      userId: userId,
      userInput: { interests, skills, goals, education },
      aiResponse: suggestions,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    await firebaseDb.collection("career_suggestions").add(careerDocument);
    console.log("Career suggestions saved successfully:", careerDocument);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/gemini:", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
