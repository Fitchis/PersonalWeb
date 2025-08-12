"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Plus, Briefcase, FileText, Clock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    setError("");
    e.preventDefault();

    const response = await fetch("/api/interview/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobPosition,
        jobDescription,
        jobExperience,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const mockId = data?.interview?.id || uuidv4();
      setOpenDialog(false);
      setJobPosition("");
      setJobDescription("");
      setJobExperience("");
      router.push(`/dashboard/interview/${mockId}`);
    } else {
      setError("Gagal menyimpan interview. Silakan coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Redesigned Add New Card */}
      <div
        className="group relative p-8 border-2 border-dashed border-gray-700 rounded-xl max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 hover:border-blue-500 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl"
        onClick={() => setOpenDialog(true)}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-gray-800 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <Plus className="w-8 h-8 text-blue-400 group-hover:text-blue-500 transition-colors duration-300" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Create New Interview
            </h2>
            <p className="text-sm text-gray-300">
              Start preparing for your next opportunity
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-900 rounded-full opacity-30"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-indigo-900 rounded-full opacity-20"></div>
      </div>

      {/* Enhanced Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl sm:max-w-[500px] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl border border-gray-800">
          <DialogHeader className="space-y-4 pb-6">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              Create Your Interview Prep
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Provide details about the position you&apos;re preparing for, and
              our AI will generate tailored interview questions to help you
              succeed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Job Position Field */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <Briefcase className="w-4 h-4 text-blue-400" />
                Posisi/Jabatan
              </label>
              <Input
                placeholder="e.g., Senior Software Engineer, Product Manager"
                className="border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12 text-base transition-colors duration-200"
                maxLength={500}
                minLength={5}
                required
                value={jobPosition}
                onChange={(event) => setJobPosition(event.target.value)}
              />
            </div>

            {/* Job Description Field */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <FileText className="w-4 h-4 text-blue-400" />
                Deskripsi Pekerjaan / Tech Stack
              </label>
              <Textarea
                placeholder="e.g., Develop scalable web applications using React, Node.js, and PostgreSQL. Lead technical decisions and mentor junior developers."
                className="border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg min-h-[100px] text-base transition-colors duration-200 resize-none"
                maxLength={500}
                minLength={5}
                required
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
              />
            </div>

            {/* Experience Field */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                <Clock className="w-4 h-4 text-blue-400" />
                Pengalaman Kerja (tahun)
              </label>
              <Input
                placeholder="e.g., 5"
                className="border-gray-700 bg-gray-900 text-white focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12 text-base transition-colors duration-200"
                type="number"
                min={0}
                max={50}
                required
                value={jobExperience}
                onChange={(event) => setJobExperience(event.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm whitespace-pre-line">
                  {error}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
                className="px-6 py-2 rounded-lg border-gray-700 bg-gray-900 text-gray-200 hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin w-4 h-4" />
                    <span>Generating Questions...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Start Interview Prep</span>
                    <Plus className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
