"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import PaddingContainer from "./PaddingContainer";
import { fetchProjects } from "@/store/projectSlice";

export default function BreadcrumbBanner() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);
  const { items: projects } = useSelector((state: RootState) => state.projects);

  const segments = pathname.split("/").filter(Boolean);

  // 🔁 Only fetch projects if on `/project/...`
  useEffect(() => {
    if (segments[0] === "projects" && projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [segments, projects.length, dispatch]);

  if (pathname === "/" || pathname === "/home") return null;

  const breadcrumb = segments.map((segment, index) => {
    // Try to match product
    const matchedProduct = products.find((p) => p.slug === segment);

    // Try to match category from products
    const matchedCategory = products.find(
      (p) => p.category?.slug === segment
    )?.category;

    // Try to match project
    const matchedProject = projects.find((proj) => proj.slug === segment);

    // Fallback: prettify the segment
    const name =
      matchedProduct?.name ||
      matchedCategory?.name ||
      matchedProject?.title ||
      decodeURIComponent(segment.replace(/-/g, " ")).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

    return {
      name,
      slug: "/" + segments.slice(0, index + 1).join("/"),
    };
  });

  if (breadcrumb.length === 0) return null;

  return (
    <div className="sticky top-[72px] z-40 backdrop-blur-lg bg-white/80 dark:bg-backgroundDark/80 transition-all duration-300">
      <PaddingContainer className="relative w-full">
        <nav className="text-xs md:text-sm flex items-center border-t border-b gap-2 py-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          {breadcrumb.map((item, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <div key={i} className="flex items-center gap-2">
                <span>&gt;</span>
                <Link
                  href={item.slug}
                  className={
                    isLast
                      ? "text-primary font-medium line-clamp-1"
                      : "hover:underline line-clamp-1"
                  }
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>
      </PaddingContainer>
    </div>
  );
}
