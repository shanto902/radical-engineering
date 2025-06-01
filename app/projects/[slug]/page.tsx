import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Image from "next/image";
import React from "react";

import moment from "moment";

import { Metadata, ResolvingMetadata } from "next";
import { getProjectData } from "@/helper/fetchFromDirectus";
import PaddingContainer from "@/components/common/PaddingContainer";
import { Facebook, Twitter } from "lucide-react";
import PostBody from "@/components/common/PostBody";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await getProjectData(slug);

    const previousImages = (await parent).openGraph?.images || [];
    if (project !== null) {
      return {
        title: `${project.title} | Projects | Radical Engineering`,
        description: `${project.short_description}` || "",
        openGraph: {
          images: project.image
            ? [
                {
                  url: `${process.env.NEXT_PUBLIC_ASSETS_URL}${project.image}`,
                },
              ]
            : [...previousImages],
        },
      };
    }

    // Default metadata if the page is not found
    return {
      title: "Project not Found",
      description: "This page does not exist.",
    };
  } catch (error) {
    console.error("Error fetching page metadata:", error);

    // Return default metadata in case of error
    return {
      title: "Error",
      description: "Failed to fetch page metadata.",
    };
  }
}
export const generateStaticParams = async () => {
  try {
    const result = await directus.request(
      readItems("projects", {
        filter: {
          status: {
            _eq: "published",
          },
        },
        fields: ["slug"],
      })
    );

    const allParams =
      (
        result as {
          slug: string;
        }[]
      ).map((item) => ({
        slug: item.slug,
        permalink: "projects",
      })) || [];
    return allParams;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts");
  }
};
const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const projectsData = await getProjectData(slug);

  const currentURL = `${process.env.NEXT_PUBLIC_SITE_URL}projects/${projectsData.slug}`;

  // Facebook share URL
  const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;

  const xShareURL = `https://twitter.com/intent/tweet?url=${currentURL}&text=${`Check out this project: ${projectsData.title}`}`;
  return (
    <main>
      {/* Desktop layout  */}
      <div className="sm:block hidden relative h-[400px] overflow-hidden w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${projectsData.image}`}
          alt={projectsData.title}
          width={1920}
          height={1080}
          blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${projectsData.image}?width=10&q=10`}
          placeholder="blur"
          style={{ objectPosition: "50% 50%" }}
          className=" w-full h-full object-cover absolute object-center"
        />
        <div className=" bg-gradient-to-b backdrop-blur-sm from-transparent  to-background absolute w-full h-full indent-0 z-10"></div>
        <PaddingContainer className="relative  h-full w-full">
          <div className="absolute  left-0 bottom-0 z-20 w-full">
            <h2 className=" drop-shadow-xl text-4xl font-bold  px-5">
              {projectsData.title}
            </h2>

            {projectsData.short_description && (
              <p className=" py-3 max-w-screen-md text-pretty px-5">
                {projectsData.short_description}
              </p>
            )}

            <div className="flex justify-between px-5 py-3">
              <div className="pb-5  gap-2 text-sm items-center flex flex-wrap">
                {projectsData.tags &&
                  projectsData.tags.map((tag, i) => (
                    <div
                      className="bg-primary  w-fit font-bold px-3 text-background  rounded-full py-1"
                      key={i}
                    >
                      {tag}
                    </div>
                  ))}
                <p className=" text-sm">{`Updated: ${
                  projectsData?.date_updated
                    ? moment(projectsData.date_updated).format("MMM DD, YYYY")
                    : moment(projectsData.date_created).format("MMM DD, YYYY")
                }`}</p>
              </div>
              <div className="text-white text-sm md:flex items-center gap-2 hidden ">
                <p className=" text-white text-sm">Share On: </p>

                <a target="_blank" href={facebookShareURL}>
                  <Facebook className="bg-primary hover:bg-secondary hover:text-foreground text-background h-8 w-8 p-2 rounded-full transition-all duration-300" />
                </a>
                <a target="_blank" href={xShareURL}>
                  <Twitter className="bg-primary hover:bg-secondary hover:text-foreground text-background h-8 w-8 p-2 rounded-full transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>
        </PaddingContainer>
      </div>

      {/* Mobile Layout  */}
      <div className="sm:hidden block relative  overflow-hidden w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${projectsData.image}`}
          alt={projectsData.title}
          width={1920}
          height={1080}
          blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${projectsData.image}?width=10&q=1`}
          placeholder="blur"
          style={{ objectPosition: "50% 50%" }}
          className=" w-full h-full "
        />
        <div className=" absolute bottom-0 bg-gradient-to-b from-transparent  to-background  w-full h-full indent-0 z-10" />
        <div className="absolute bottom-0 left-0 z-20  h-full w-full">
          <div className=" flex backdrop-blur-sm flex-col justify-end   items-start h-full  w-full  pb-5">
            <PaddingContainer>
              <h2 className=" text-2xl pb-1 font-bold  ">
                {projectsData.title}
              </h2>
              {projectsData.short_description && (
                <p className="   text-sm">{projectsData.short_description}</p>
              )}
            </PaddingContainer>
          </div>
        </div>
      </div>

      <article className="relative max-w-screen-xl mx-auto px-5 py-10">
        <PostBody body={projectsData.body} />
      </article>
    </main>
  );
};

export default page;
