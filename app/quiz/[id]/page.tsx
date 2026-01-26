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

const QuizIdPage = async ({ params }: PageProps) => {
  const { id } = await params;
  const data = await getQuestionData(id);

  console.log(data)
  if (!data) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <QuizClient quiz={data} />
    </main>
  );
};

export default QuizIdPage;