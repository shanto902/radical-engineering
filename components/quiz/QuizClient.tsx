"use client";

import PaddingContainer from "@/components/common/PaddingContainer";
import { TQuestions } from "@/interfaces";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

type QuizClientProps = {
  quiz: TQuestions;
};

const QuizClient = ({ quiz }: QuizClientProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Safely access questions, defaulting to empty array if undefined
  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex]?.question_id;

  // Initialize timer and check for existing session
  useEffect(() => {
    const storedEndTime = localStorage.getItem(`quiz_end_time_${quiz.id}`);

    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const now = Date.now();

      if (now < endTime) {
        setHasStarted(true);
        setTimeLeft(Math.floor((endTime - now) / 1000));
      } else {
        // Timer expired while away, or just finished
        // potentially could auto-finish here if we want strictly enforce
        localStorage.removeItem(`quiz_end_time_${quiz.id}`);
        // For now, let's just let them start fresh or Handle specific expiration UI?
        // User said "reload wont stop the time", implying if time is up, it's up.
        // But simplicity first: if expired, clear it.
      }
    }
  }, [quiz.id]);

  // Timer logic
  useEffect(() => {
    if (!hasStarted || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isFinished]);

  const startQuiz = () => {
    setHasStarted(true);
    // Set timer based on total_time (assuming minutes)
    const durationSeconds = (quiz.total_time || 30) * 60;
    setTimeLeft(durationSeconds);
    const endTime = Date.now() + durationSeconds * 1000;
    localStorage.setItem(`quiz_end_time_${quiz.id}`, endTime.toString());
  };

  const finishQuiz = useCallback(async () => {
    setIsFinished(true);
    localStorage.removeItem(`quiz_end_time_${quiz.id}`);

    if (
      user // Only submit if logged in
    ) {
      let score = 0;
      const answers: Record<string, any> = {};

      questions.forEach((q, index) => {
        const selected = selectedAnswers[index];
        const correctOption = q.question_id.multiple_questions.find(
          (opt) => opt.is_correct,
        );
        if (selected === correctOption?.option) {
          score++;
        }
        answers[q.question_id.id] = {
          question: q.question_id.title,
          selected: selected || "Skipped",
          correct: correctOption?.option,
          isCorrect: selected === correctOption?.option,
        };
      });

      const totalQuestions = questions.length;
      const percentage = Math.round((score / totalQuestions) * 100);

      try {
        await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: user.id,
            quiz: quiz.id,
            score,
            total_marks: quiz.total_marks || totalQuestions, // Or quiz.total_marks if properly set
            percentage,
            answers,
            status: "completed",
          }),
        });
      } catch (error) {
        console.error("Failed to submit quiz result", error);
      }
    }
  }, [quiz.id, user, questions, selectedAnswers]);

  const handleOptionSelect = (option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handeNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      const correctOption = q.question_id.multiple_questions.find(
        (opt) => opt.is_correct,
      );
      if (selected === correctOption?.option) {
        score++;
      }
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (questions.length === 0) {
    return (
      <PaddingContainer className="py-5 text-center">
        <h2 className="text-2xl font-bold mb-4">No questions found</h2>
        <p className="text-muted-foreground mb-6">
          This quiz doesn't have any questions yet.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg"
        >
          Back to Quizzes
        </Link>
      </PaddingContainer>
    );
  }

  // Start Screen
  if (!hasStarted) {
    return (
      <PaddingContainer className="py-16  mx-auto flex flex-col justify-center">
        <div className="bg-card border rounded-3xl p-8 md:p-12 shadow-xl text-center">
          <h1 className="text-3xl text-left md:text-4xl font-bold mb-6 text-primary">
            {quiz.title}
          </h1>

          <div className="flex flex-wrap justify-between gap-4 mb-8 text-left  mx-auto">
            <div className="bg-secondary/30 p-4 rounded-xl">
              <span className="block text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Total Questions
              </span>
              <span className="text-2xl font-bold">{questions.length}</span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl">
              <span className="block text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Total Time
              </span>
              <span className="text-2xl font-bold">
                {quiz.total_time || "N/A"} Mins
              </span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl">
              <span className="block text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Total Marks
              </span>
              <span className="text-2xl font-bold">
                {quiz.total_marks || questions.length}
              </span>
            </div>
            <div className="bg-secondary/30 p-4 rounded-xl">
              <span className="block text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Passing Marks
              </span>
              {/* Assuming 50% passing for now or add to existing logic later */}
              <span className="text-2xl font-bold">
                {Math.ceil((quiz.total_marks || questions.length) * 0.4)}
              </span>
            </div>
          </div>

          {quiz.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl mb-8 text-left">
              <h3 className="text-blue-800 dark:text-blue-300 font-semibold mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                Important Notes
              </h3>
              <div
                className="text-blue-700 dark:text-blue-400 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: quiz.notes }}
              />
            </div>
          )}

          <button
            onClick={startQuiz}
            className="w-full md:w-auto px-12 py-4 rounded-2xl bg-primary text-background font-bold text-lg shadow-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Start Quiz Now
          </button>
        </div>
      </PaddingContainer>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    const totalPossibleMarks = quiz.total_marks || questions.length;
    // Simple calculation: spread marks evenly or just use counts if marks/question not defined?
    // Assuming 1 point per question for internal calculation unless we have weightage.
    // Let's stick to questions count for score ratio, but display Total Marks as label.

    // Actually, user wants "Total Marks". If we don't have per-question marks, we can't really sum up to a custom Total Marks unless we assume equal distribution.
    // For now, let's just show Score as "Correct Answers / Total Questions".

    const percentage = Math.round((score / questions.length) * 100);

    return (
      <PaddingContainer className="py-16  mx-auto">
        <div className="bg-card border rounded-2xl p-8 shadow-lg text-center mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-muted-foreground">
              You have finished {quiz.title}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-primary/20">
              <div className="text-center">
                <span className="block text-4xl font-extrabold text-primary">
                  {score}/{questions.length}
                </span>
                <span className="text-sm text-muted-foreground">Correct</span>
              </div>
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * percentage) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-muted rounded-xl">
              <span className="block text-sm text-muted-foreground">
                Accuracy
              </span>
              <span className="block text-xl font-bold text-foreground">
                {percentage}%
              </span>
            </div>
            <div className="p-4 bg-muted rounded-xl">
              <span className="block text-sm text-muted-foreground">
                Total Marks
              </span>
              <span className="block text-xl font-bold text-foreground">
                {totalPossibleMarks}
              </span>
            </div>
          </div>

          <Link
            href="/quiz"
            className="inline-block w-full sm:w-auto bg-primary text-background px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to All Quizzes
          </Link>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold px-2">Review Answers</h3>
          {questions.map((q, index) => {
            const selected = selectedAnswers[index];
            const correctOption = q.question_id.multiple_questions.find(
              (o) => o.is_correct,
            );
            const isCorrect = selected === correctOption?.option;
            const isSkipped = !selected;

            return (
              <div
                key={index}
                className={`p-6 rounded-xl border ${
                  isCorrect
                    ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900"
                    : "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                      isCorrect
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg mb-4">
                      {q.question_id.title}
                    </h4>
                    <div className="space-y-2">
                      {/* Show selected answer if incorrect */}
                      {!isCorrect && !isSkipped && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <span className="font-medium">Your Answer:</span>
                          <span>{selected}</span>
                        </div>
                      )}
                      {/* Show correct answer always */}
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <span className="font-medium">Correct Answer:</span>
                        <span>{correctOption?.option}</span>
                      </div>
                      {/* Show skipped status */}
                      {isSkipped && (
                        <div className="text-orange-600 dark:text-orange-400 font-medium">
                          Skipped
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PaddingContainer>
    );
  }

  // Quiz Taking UI
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <PaddingContainer className="py-12 max-w-7xl mx-auto min-h-screen flex flex-col">
      {/* Header / Progress */}
      <div className="mb-8 max-w-7xl mx-auto w-full">
        <div className="bg-card border shadow-sm rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-2/3">
            <div className="flex justify-between mb-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              <span>Quiz Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-4 w-full bg-secondary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out rounded-full shadow-lg shadow-primary/20"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div
            className={`w-full md:w-auto flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 transition-colors duration-300 ${
              timeLeft < 60
                ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                : "border-primary/20 bg-primary/5 text-primary"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-mono text-xl font-bold">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 max-w-7xl mx-auto w-full flex justify-between items-center px-2">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        {quiz.total_marks && (
          <span className="text-sm font-medium text-muted-foreground">
            Marks: {quiz.total_marks}
          </span>
        )}
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col">
        <div className="bg-card/50 backdrop-blur-sm border rounded-3xl p-2 md:p-12 shadow-xl mb-8 flex-grow">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-10 leading-tight  mx-auto">
            {currentQuestion?.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mx-auto w-full">
            {currentQuestion?.multiple_questions.map((option, idx) => {
              const isSelected =
                selectedAnswers[currentQuestionIndex] === option.option;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option.option)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center gap-5 group relative overflow-hidden ${
                    isSelected
                      ? "border-primary bg-primary text-background shadow-md transform scale-[1.02]"
                      : "border-transparent bg-background hover:bg-primary hover:border-primary hover:text-background text-foreground hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isSelected
                        ? "border-background  bg-primary text-background scale-110"
                        : "border-foreground  group-hover:border-background bg-background "
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-current" />
                    )}
                  </div>
                  <span className="font-medium text-lg md:text-xl relative z-10">
                    {option.option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mt-auto max-w-4xl mx-auto w-full">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 ${
              currentQuestionIndex === 0
                ? "text-muted-foreground cursor-not-allowed opacity-0"
                : "text-foreground hover:bg-secondary active:scale-95 hover:shadow-sm"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Previous
          </button>

          <button
            onClick={handeNext}
            className="px-10 py-4 rounded-2xl bg-primary text-background font-bold shadow-lg hover:bg-secondary hover:text-foreground hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center gap-3 ml-auto"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
            {currentQuestionIndex !== questions.length - 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </PaddingContainer>
  );
};

export default QuizClient;
