// components/Card.tsx
import { TProject } from "@/interfaces";
import Image from "next/image";
import React from "react";

import moment from "moment";

import Link from "next/link";

const ProjectCard = ({ project }: { project: TProject }) => {
  return (
    <div className="mb-0 border border-primary w-full p-3 rounded-lg flex flex-col lg:grid grid-cols-3 overflow-hidden shadow-none my-5 hover:shadow-2xl transition-all duration-300">
      <Link className="h-full w-full p-2  " href={`/projects/${project.slug}`}>
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}`}
          width={300}
          height={400}
          alt={project.title}
          placeholder="blur"
          blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}?width=10&q=1`}
          className="w-full h-full aspect-video lg:aspect-[3/4] object-cover rounded-lg"
        />
      </Link>

      <div className="p-4 col-span-2 flex flex-col gap-2 justify-center">
        <Link
          href={`/projects/${project.slug}`}
          className="text-xl font-bold  transition-all duration-300 line-clamp-2"
        >
          {project.title}
        </Link>
        <p className="line-clamp-4 text-sm">{project.short_description}</p>
        <div className="py-2 gap-2 text-sm items-center flex   flex-wrap">
          {project.tags &&
            project.tags.map((tag, i) => (
              <div
                className="bg-transparent text-xs w-fit border border-primary  font-bold px-2 text-foreground rounded-lg py-1"
                key={i}
              >
                {tag}
              </div>
            ))}
        </div>
        <p className="text-sm font-semibold">{`Published on: ${moment(
          project.date_created
        ).format("MMM DD, YYYY")}`}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
