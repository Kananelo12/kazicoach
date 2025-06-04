// app/results/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getCareerSuggestionsFromCurrentUser } from "@/lib/actions/crud.action";
import { CareerCarousel } from "@/components/CareerCarousel";

export default async function ResultsPage() {
  // 1) Fetch all suggestions for the signed-in user
  const results = await getCareerSuggestionsFromCurrentUser();

  // 2) If not authenticated, redirect to sign-in
  if (results === null) {
    redirect("/sign-in");
  }

  // 3) If authenticated but no docs, show “no results” message
  if (results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">No Career Suggestions Found</h1>
        <p className="text-gray-600 mb-6">
          You haven’t generated any career suggestions yet.
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // 4) Otherwise, render the carousel
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Your Career Recommendations
        </h1>

        <CareerCarousel results={results} />

        <div className="mt-8 text-center">
          <button
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
