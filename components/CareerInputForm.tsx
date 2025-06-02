"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "sonner";

const CareerInputForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    interests: "",
    skills: "",
    goals: "",
    education: "",
  });
  const [interestChips, setInterestChips] = useState<string[]>([]);
  const [skillChips, setSkillChips] = useState<string[]>([]);

  const suggestedInterests = [
    "Technology",
    "Healthcare",
    "Education",
    "Business",
    "Arts",
    "Sports",
    "Environment",
    "Finance",
    "Engineering",
    "Media",
    "Agriculture",
    "Tourism",
  ];

  const addInterestChip = (interest: string) => {
    if (!interestChips.includes(interest)) {
        setInterestChips([...interestChips, interest]);
    }
  };

  const removeInterestChip = (interest: string) => {
    setInterestChips(interestChips.filter((chip) => chip !== interest));
  };

  const addSkillChip = () => {
    const skill = formData.skills.trim();
    if (skill && !skillChips.includes(skill)) {
        setSkillChips([...skillChips, skill]);
        setFormData({...formData, skills: ""});
    }
  };

  const removeSkillChip = (skill: string) => {
    if (!skillChips.includes(skill)) {
        setSkillChips(skillChips.filter((chip) => chip !== skill));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const inputData = {
            interest: interestChips,
            skills: skillChips,
            goals: formData.goals,
            education: formData.education,
        };

        console.log('Submitting career input:', inputData);

        // Call the Gemini API

        // Save to firebase Firestore

    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(`Something went wrong: ${error}`);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tell Us About Yourself
          </h1>
          <p className="text-xl text-gray-600">
            Help us understand your interests, skills, and dreams
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 shadow-xl"
        >
          {/* Interests Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What are your interests?
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={
                    interestChips.includes(interest) ? "default" : "outline"
                  }
                  className={`cursor-pointer px-4 py-2 text-sm ${
                    interestChips.includes(interest)
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "hover:bg-blue-50"
                  }`}
                  onClick={() => addInterestChip(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            {interestChips.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {interestChips.map((interest) => (
                  <Badge
                    key={interest}
                    className="bg-blue-600 text-white px-3 py-1"
                  >
                    {interest}
                    <X
                      className="h-3 w-3 ml-2 cursor-pointer"
                      onClick={() => removeInterestChip(interest)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What skills do you have?
            </label>
            <div className="flex gap-2 mb-4">
              <Input
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                placeholder="Type a skill and press Enter"
                className="flex-1 h-12 text-lg"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkillChip())
                }
              />
              <Button
                type="button"
                onClick={addSkillChip}
                className="h-12"
              >
                Add
              </Button>
            </div>
            {skillChips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillChips.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-green-600 text-white px-3 py-1"
                  >
                    {skill}
                    <X
                      className="h-3 w-3 ml-2 cursor-pointer"
                      onClick={() => removeSkillChip(skill)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Goals Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What are your life goals and aspirations?
            </label>
            <Textarea
              value={formData.goals}
              onChange={(e) =>
                setFormData({ ...formData, goals: e.target.value })
              }
              placeholder="Describe what you want to achieve in your career and life..."
              className="h-32 text-lg resize-none"
              required
            />
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              What is your level of education?
            </label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, education: value })
              }
              required
            >
              <SelectTrigger className="h-12 text-lg">
                <SelectValue placeholder="Select your education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary School</SelectItem>
                <SelectItem value="secondary">Secondary School</SelectItem>
                <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                <SelectItem value="bachelor">Bachelor&apos;s Degree</SelectItem>
                <SelectItem value="master">Master&apos;s Degree</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={
              isSubmitting ||
              interestChips.length === 0 ||
              !formData.goals ||
              !formData.education
            }
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? "Generating Your Career Path..." : "Find My Path"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CareerInputForm;
