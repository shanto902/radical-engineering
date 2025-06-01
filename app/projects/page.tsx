import ProjectCard from "@/components/cards/ProjectCard";
import PaddingContainer from "@/components/common/PaddingContainer";
import { fetchProjects } from "@/helper/fetchFromDirectus";

import React from "react";

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
