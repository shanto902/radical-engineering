import { fetchBlockProjects } from "@/helper/fetchFromDirectus";
import { TProjectsBlock } from "@/interfaces";
import Link from "next/link";
import ProjectCardHome from "../cards/ProjectCardHome";
import PaddingContainer from "../common/PaddingContainer";

const ProjectsBlock = async ({ block }: { block: TProjectsBlock }) => {
  const projects = await fetchBlockProjects(block.item.limit);

  return (
    <PaddingContainer className="my-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        {block.item.header_text || "Featured Categories"}
      </h2>

      <div className="grid gap-5 pb-20  mx-auto grid-cols-1  md:grid-cols-2 lg:grid-cols-3 w-full">
        {projects ? (
          projects.map((project) => (
            <ProjectCardHome key={project.id} project={project} />
          ))
        ) : (
          <p>Nothing to Show</p>
        )}
      </div>
      {projects.length > 6 && (
        <div className="flex justify-center">
          <Link href={`/projects`} className="text-sm">
            Load More Projects
          </Link>
        </div>
      )}
    </PaddingContainer>
  );
};

export default ProjectsBlock;
