"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CareerDocument } from "@/lib/actions/crud.action";

interface CareerCarouselProps {
  results: CareerDocument[];
}

export function CareerCarousel({ results }: CareerCarouselProps) {
  if (!results.length) {
    return <p className="text-center text-gray-500">No career suggestions found.</p>;
  }

  return (
    <Carousel className="w-full max-w-2xl mx-auto">
      <CarouselContent>
        {results.map((doc, idx) => (
          <CarouselItem key={doc.id}>
            <div className="p-2">
              <Card>
                <CardContent className="flex flex-col p-6 gap-4">
                  <h3 className="text-xl font-semibold">Result {idx + 1}</h3>

                  {/* preview 3 suggestions */}
                  <ul className="space-y-1">
                    {doc.aiResponse.suggestions.slice(0, 3).map((s, i) => (
                      <li key={i} className="text-gray-700">
                        • {s.title}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 text-right">
                    <Link href={`/results/${doc.id}`}>
                      <Button size="sm">View More</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
