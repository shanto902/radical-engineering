import PaddingContainer from "@/components/common/PaddingContainer";
import Link from "next/link";
import React from "react";
import {
  BookOpen,
  Download,
  LayoutGrid,
  GraduationCap,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "Student Portal | Radical Engineering",
  description: "Access your quizzes, downloads, and other student resources.",
};

const PortalDashboard = () => {
  const portalItems = [
    {
      title: "Question Papers",
      description:
        "Practice with our collection of technical question papers and quizzes.",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      href: "/portal/quiz",
      color: "bg-primary/10",
      delay: "delay-100",
    },
    {
      title: "Downloads",
      description:
        "Access study materials, diagrams, and other important resources.",
      icon: <Download className="w-8 h-8 text-blue-600" />,
      href: "/portal/downloads", // Assuming this is the correct path
      color: "bg-blue-600/10",
      delay: "delay-200",
    },
    // Future items
    /*
    {
      title: "My Progress",
      description: "Track your quiz performance and learning journey.",
      icon: <LayoutGrid className="w-8 h-8 text-purple-600" />,
      href: "/portal/progress",
      color: "bg-purple-600/10",
      delay: "delay-300",
    },
    */
  ];

  return (
    <main className="min-h-[calc(100vh-120px)]">
      {/* Hero Section */}
      <div className="bg-primary text-background py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <PaddingContainer className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Student Portal
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Welcome to your learning hub. Access quizzes, study materials, and
              track your progress.
            </p>
          </div>
        </PaddingContainer>
      </div>

      {/* Dashboard Grid */}
      <PaddingContainer className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {portalItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group bg-card hover:bg-card/80 border rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 ${item.delay}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              <p className="text-muted-foreground mb-6 flex-grow">
                {item.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-primary">
                <span>Access Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </Link>
          ))}

          {/* Coming Soon Card */}
          <div className="bg-muted/30 border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">More Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              We are working on adding more features like progress tracking and
              certifications.
            </p>
          </div>
        </div>
      </PaddingContainer>
    </main>
  );
};

export default PortalDashboard;
