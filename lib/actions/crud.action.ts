"use server";

import { firebaseDb } from "@/firebase/admin";
import { getCurrentUser } from "./auth.action";
// import { cookies } from "next/headers";

export async function getCareerSuggestions() {
  const snapShot = await firebaseDb.collection("career_suggestions").get();
  snapShot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
}

export async function getCareerSuggestionsFromCurrentUser() {
  // Get the currently authenticated user from cookies/session
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  // Query firestore for this user's document, sorted by newest first
  const snapshots = await firebaseDb
    .collection("career_suggestions")
    .where("userId", "==", user.id)
    .orderBy("createdAt", "desc")
    .get();

    const results: CareerDocument[] = snapshots.docs.map((doc) => {
        const data = doc.data() as Omit<CareerDocument, "id">;

        return {
            id: doc.id,
            userId: data.userId,
            aiResponse: data.aiResponse,
            createdAt: data.createdAt,
        };
    });

    return results;

    // if (snapshots.empty) {
    //     return [];
    // }

    // // Return the AI response from the first doc
    // const doc = snapshots.docs[0];
    // const data = doc.data() as CareerDocument;
    // return data.aiResponse;
}
