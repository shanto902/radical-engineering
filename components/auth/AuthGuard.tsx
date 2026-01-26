"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import PaddingContainer from "../common/PaddingContainer";
import Link from "next/link";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
        // Option 1: Redirect immediately
        // router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        
        // Option 2: Show access denied message (Doing this for better UX so they know WHY)
    }
  }, [mounted, isAuthenticated, router, pathname]);

  if (!mounted) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return (
      <PaddingContainer className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
        <div className="bg-card border rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to access the quizzes and question papers.
          </p>
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="block w-full py-3 px-4 bg-primary text-background font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Login to Continue
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
             Don't have an account? <Link href="/login?mode=register" className="text-primary hover:underline font-medium">Register here</Link>
          </p>
        </div>
      </PaddingContainer>
    );
  }

  return <>{children}</>;
}
