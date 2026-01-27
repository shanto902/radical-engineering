"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PaddingContainer from "../common/PaddingContainer";
import logo from "@/assets/logo.svg";
import logoDark from "@/assets/logo-dark.svg";
import LogoutButton from "../auth/LogoutButton";
import { ThemeToggle } from "../ThemeToggle";

const PortalNavbar = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <PaddingContainer className="flex items-center justify-between h-16">
        <Link href="/">
          <Image
            src={theme === "light" ? logo : logoDark}
            alt="Radical Engineering"
            width={150}
            height={50}
            className="h-10 w-auto  rounded-lg"
          />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/e-learning/quiz"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Quiz
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/e-learning/downloads"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Downloads
            </Link>
          </div>

          <div className="border-l border-r px-4  border-border flex justify-center items-center">
            <ThemeToggle />
          </div>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/e-learning/profile"
                className="hidden md:flex flex-col text-right hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-foreground">
                  {user.email || user.phone}
                </span>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold hover:underline bg-primary text-background px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          )}
        </div>
      </PaddingContainer>
    </nav>
  );
};

export default PortalNavbar;
