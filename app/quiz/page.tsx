import PaddingContainer from "@/components/common/PaddingContainer";
import { fetchQuestions } from "@/helper/fetchFromDirectus";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Question Papers | Radical Engineering",
  description: "Test your knowledge with our technical question papers and quizzes.",
};

const QuizPage = async () => {
  const questions = await fetchQuestions();

  return (
    <main className="min-h-screen bg-background">
      <PaddingContainer className="mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Question Papers
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Select a question paper below to start testing your knowledge.
          </p>
        </div>

        {questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-card group rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  {quiz.questions && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {quiz.questions.length} Questions
                    </span>
                  )}
                </div>

                <div className="flex-grow">
                  <h2 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {quiz.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Added on{" "}
                    {new Date(quiz.date_created).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t">
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary text-background font-medium hover:bg-secondary active:scale-[0.98] transition-all duration-300 shadow-md hover:text-foreground"
                  >
                    <span>Start Quiz</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-xl">
            <div className="bg-muted p-4 rounded-full mb-4 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              No quizzes available
            </h3>
            <p className="text-muted-foreground max-w-sm text-sm">
              Check back later for new question papers and quizzes.
            </p>
          </div>
        )}
      </PaddingContainer>
    </main>
  );
};

export default QuizPage;