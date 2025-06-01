import ProjectCard from "@/components/cards/ProjectCard";
import PaddingContainer from "@/components/common/PaddingContainer";
import { fetchProjects } from "@/helper/fetchFromDirectus";
import { Metadata } from "next";

import React from "react";
export const metadata: Metadata = {
  title: "Projects | Radical Engineering",
  description:
    "Discover our solar panel and battery installation projects for homes—delivering reliable, energy-efficient solutions that power households with clean, sustainable technology.",
  openGraph: {
    title: "Projects | Radical Engineering",
    description:
      "Discover our solar panel and battery installation projects for homes—delivering reliable, energy-efficient solutions that power households with clean, sustainable technology.",
    images: [
      {
        url: "/og/projects.jpg", // Ensure this path is public (inside the `public` directory)
        width: 1200,
        height: 630,
        alt: "Projects Cover - Radical Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice | Radical Engineering",
    description:
      "Discover our solar panel and battery installation projects for homes—delivering reliable, energy-efficient solutions that power households with clean, sustainable technology.",
    images: ["/og/projects.jpg"],
  },
};
const page = async () => {
  const projects = await fetchProjects();
  console.log(projects);
  return (
    <PaddingContainer className="py-5">
      <div className="grid gap-5  grid-cols-1 pb-10 mx-auto md:grid-cols-2 w-full">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-center col-span-2 my-32 text-2xl font-bold flex flex-col gap-20 justify-center items-center">
            Nothing to Show
          </p>
        )}
      </div>
    </PaddingContainer>
  );
};

export default page;
