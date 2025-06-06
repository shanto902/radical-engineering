// components/Card.tsx
import { TProject } from "@/interfaces";
import Image from "next/image";
import React from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";

const ProjectCardHome = ({ project }: { project: TProject }) => {
  return (
    <div className="group border border-primary w-full p-4 rounded-xl grid grid-cols-3  gap-4 overflow-hidden shadow-none my-5 hover:shadow-xl transition-shadow duration-300">
      <Link
        rel="canonical"
        href={`/projects/${project.slug}`}
        className="flex-shrink-0 block w-full aspect-auto rounded-lg overflow-hidden col-span-1"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}?width=400&height=300`}
          width={400}
          height={300}
          alt={project.title}
          placeholder="blur"
          blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}?width=10&q=1`}
          className="w-full h-full object-cover aspect-video  flex-1 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      <div className="flex flex-col col-span-2 justify-between flex-1 gap-4">
        <div className="flex flex-col gap-2">
          <Link
            rel="canonical"
            href={`/projects/${project.slug}`}
            className="text-base font-bold text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-3"
          >
            {project.title}
          </Link>
        </div>

        <p className="text-xs text-foreground/60 font-medium">
          {`Published on: ${format(
            parseISO(project.date_created),
            "MMM dd, yyyy"
          )}`}
        </p>
      </div>
    </div>
  );
};

export default ProjectCardHome;
