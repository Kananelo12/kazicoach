/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { firebaseDb } from "@/firebase/admin";
import { getCurrentUser } from "@/lib/actions/auth.action";

export interface CareerSuggestion {
  title: string;
  description: string;
  suggestedSkills: string[];
  motivationQuote: string;
}

export interface CareerDocument {
  id: string;
  userId: string;
  input: {
    interests: string[];
    skills: string[];
    goals: string;
    education: string;
  };
  aiResponse: {
    suggestions: CareerSuggestion[];
    timestamp: string;
  };
  createdAt: string;
}

export async function getCareerSuggestionsFromCurrentUser(): Promise<CareerDocument[] | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const snapshots = await firebaseDb
    .collection("career_suggestions")
    .where("userId", "==", user.id)
    .orderBy("createdAt", "desc")
    .get();

  return snapshots.docs.map((snap) => {
    const raw = snap.data() as any;
    let normalizedAI: CareerDocument["aiResponse"];

    // 1. If Firestore gave us an array of strings, wrap it:
    if (Array.isArray(raw.aiResponse)) {
      normalizedAI = {
        suggestions: raw.aiResponse.map((title: string) => ({
          title,
          description: "",
          suggestedSkills: [],
          motivationQuote: "",
        })),
        timestamp: raw.createdAt,
      };
    } else {
      // 2. Otherwise assume it's already the proper object shape
      normalizedAI = raw.aiResponse;
    }

    return {
      id: snap.id,
      userId: raw.userId,
      input: raw.userInput,
      aiResponse: normalizedAI,
      createdAt: raw.createdAt,
    };
  });
}
