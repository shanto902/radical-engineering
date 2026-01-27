import QuizClient from "@/components/quiz/QuizClient";
import { getQuestionData } from "@/helper/fetchFromDirectus";
import { notFound } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Take Quiz | Radical Engineering",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

import AuthGuard from "@/components/auth/AuthGuard";

const QuizIdPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const data = await getQuestionData(id);

  if (!data) {
    return notFound();
  }

  return (
    <AuthGuard>
      <main className="bg-background">
        <QuizClient quiz={data} />
      </main>
    </AuthGuard>
  );
};

export default QuizIdPage;