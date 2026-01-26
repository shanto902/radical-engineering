"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import PaddingContainer from "@/components/common/PaddingContainer";
import { RootState } from "@/store/index";
import { TQuizResult } from "@/interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Clock,
  CheckCircle,
  BarChart,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [history, setHistory] = useState<TQuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/quiz/history?userId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setHistory(data.results);
          }
        })
        .catch((err) => console.error("Failed to load history", err))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  // Calculate Stats
  const totalQuizzes = history.length;
  const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = history.reduce(
    (acc, curr) => acc + (curr.total_marks || 0),
    0,
  ); // Assuming total_marks is saved
  const averagePercentage =
    totalQuizzes > 0
      ? Math.round(
          history.reduce((acc, curr) => acc + curr.percentage, 0) /
            totalQuizzes,
        )
      : 0;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-muted/10">
        <PaddingContainer className="py-8 md:py-12">
          {/* Back Header */}
          <div className="mb-8">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <div className="p-2 bg-background border rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Back to Portal
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: User Profile */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border rounded-2xl shadow-sm p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{user?.name}</h2>
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full mt-2">
                    Student
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.email || "No email provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.phone || "No phone provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{user?.address || "No address provided"}</span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-card border rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-primary" />
                  Performance Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-xl text-center">
                    <span className="block text-2xl font-bold mb-1">
                      {totalQuizzes}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Quizzes Taken
                    </span>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-xl text-center">
                    <span className="block text-2xl font-bold mb-1">
                      {averagePercentage}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Avg. Score
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Quiz History */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Quiz History
                  </h3>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-muted-foreground">
                    Loading history...
                  </div>
                ) : history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                          <th className="px-6 py-4">Quiz Name</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Score</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {history.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium">
                              {/* @ts-ignore */}
                              {item.quiz?.title || "Unknown Quiz"}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {new Date(item.date_created).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold">{item.score}</span>
                              <span className="text-muted-foreground">
                                /{item.total_marks || "?"}
                              </span>
                              <span className="ml-2 text-xs py-0.5 px-2 rounded-full bg-secondary">
                                {item.percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-16 text-center text-muted-foreground">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <Award className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                    <p>No quizzes taken yet.</p>
                    <Link
                      href="/portal/quiz"
                      className="text-primary hover:underline mt-2 inline-block"
                    >
                      Start your first quiz
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PaddingContainer>
      </main>
    </AuthGuard>
  );
}
