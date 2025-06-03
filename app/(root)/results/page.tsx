// app/results/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { firebaseDb } from "@/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CareerResult {
  aiResponse: string[];
  createdAt: string;
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [careerResult, setCareerResult] = useState<CareerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchLatestResult = async (uid: string) => {
      try {
        // Query for the most recent document where userId == uid
        const q = query(
          collection(firebaseDb, "career_suggestions"),
          where("userId", "==", uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError("No career suggestions found for your account.");
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data() as DocumentData;
          setCareerResult({
            aiResponse: data.aiResponse,
            createdAt: data.createdAt,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results from database.");
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth state
    // eslint-disable-next-line prefer-const
    unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (!user) {
        toast.error("You must be signed in to view your results.");
        router.push("/sign-in");
      } else {
        fetchLatestResult(user.uid);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [auth, router]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Career Recommendations</h1>
      <ul className="space-y-4">
        {careerResult?.aiResponse.map((career, idx) => (
          <li key={idx} className="bg-white p-4 rounded-lg shadow-sm text-lg">
            {career}
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.push("/")}
        className="mt-8 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
