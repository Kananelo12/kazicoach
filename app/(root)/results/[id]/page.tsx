// app/results/[id]/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { firebaseDb } from "@/firebase/admin";
import { doc, getDoc } from "firebase/firestore";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface CareerDocument {
  userId: string;
  aiResponse: string[];
  createdAt: string;
  userInput: {
    interests: string[];
    skills: string[];
    goals: string;
    education: string;
  };
}

export default async function CareerDetailPage({ params }: { params: { id: string } }) {
  // 1) Verify user is signed in and fetch their UID
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // 2) Fetch the document by its ID
  const docRef = doc(firebaseDb, "career_suggestions", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Not Found</h1>
        <p className="text-gray-600">This career suggestion does not exist.</p>
      </div>
    );
  }

  // 3) Check that the document belongs to the signed-in user
  const data = docSnap.data() as CareerDocument;
  if (data.userId !== user.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to view this.</p>
      </div>
    );
  }

  // 4) Render full details
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Career Suggestions Detail</h1>

        <h2 className="text-lg font-semibold mb-2">Your Input</h2>
        <ul className="mb-6 list-disc list-inside text-gray-700">
          <li>
            <strong>Interests:</strong> {data.userInput.interests.join(", ")}
          </li>
          <li>
            <strong>Skills:</strong> {data.userInput.skills.join(", ")}
          </li>
          <li>
            <strong>Goals:</strong> {data.userInput.goals}
          </li>
          <li>
            <strong>Education:</strong> {data.userInput.education}
          </li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">AI Recommendations</h2>
        <ul className="space-y-2 mb-6">
          {data.aiResponse.map((career, idx) => (
            <li
              key={idx}
              className="bg-gray-100 p-3 rounded text-gray-800"
            >
              {career}
            </li>
          ))}
        </ul>

        <button
          onClick={() => redirect("/results")}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Results
        </button>
      </div>
    </div>
  );
}
