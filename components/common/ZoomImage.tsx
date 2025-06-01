"use client";
// Import necessary modules and types
// Import necessary modules and types
import React from "react";
import "react-medium-image-zoom/dist/styles.css";

import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { Weight } from "lucide-react";

// Define the props type for the ErrorBoundary component

// ZoomImage component
const ZoomImage = ({
  src,
  alt,
  id,
  width,
  height,
}: {
  src: string;
  alt: string;
  id?: string;

  width: string;
  height: string;
}) => {
  return (
    // Wrap the component with the ErrorBoundary

    <Zoom key={id ? id : Math.random()} wrapElement="span">
      <div className="md:m-4 m-2">
        <Image
          className="w-full  md:pb-0 object-cover rounded-lg object-center  aspect-[4/3] h-full"
          src={src}
          alt={alt}
          width={800}
          height={600}
          placeholder="blur"
          blurDataURL={`${src}?width=10&q=1`}
        />
      </div>
    </Zoom>
  );
};

export default ZoomImage;
