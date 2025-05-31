"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-40 flex flex-col items-center justify-center  text-center px-4">
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl ">Page not found</p>
      <p className="mb-6 ">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-primary text-background hover:bg-secondary hover:text-foreground  px-6 py-2 rounded-md  transition"
      >
        Go back home
      </Link>
    </div>
  );
}
