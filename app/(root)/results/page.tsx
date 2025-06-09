// app/results/page.tsx
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCareerSuggestionsFromCurrentUser } from "@/lib/actions/crud.action";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Target, BookOpen } from "lucide-react";

export default async function ResultsPage() {
  const results = await getCareerSuggestionsFromCurrentUser();
  if (results === null) redirect("/sign-in");
  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl mb-4">No Career Suggestions Found</h1>
          <Link href="/input">
            <Button size="lg">Take Assessment</Button>
          </Link>
        </div>
      </div>
    );
  }

  const latest = results[0];
  const { input, aiResponse } = latest;

  return (
    <div className="min-h-screen">
      <header className="p-6 flex items-center justify-between shadow dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft /> Home
            </Button>
          </Link>
          <Link href="/input">
            <Button variant="outline">Start Over</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target /> Your Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {input.interests.map((i) => (
                    <Badge key={i}>{i}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {input.skills.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Goals</h4>
              <p>{input.goals}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Education</h4>
              <Badge>{input.education}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {aiResponse.suggestions.map((s, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles /> {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{s.description}</p>
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-1">
                    <BookOpen /> Skills to Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {s.suggestedSkills.map((sk) => (
                      <Badge key={sk}>{sk}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h4 className="font-semibold mb-1">Motivation</h4>
                  <p className="italic">&quot;{s.motivationQuote}&quot;</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/input">
            <Button size="lg">Explore More Paths</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
