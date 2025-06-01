/* eslint-disable @typescript-eslint/no-explicit-any */
import parse from "html-react-parser";

import ZoomImage from "./ZoomImage";

interface PostBodyProps {
  body: string;
  blurDataMap?: { src: string; blurDataURL: string }[];
}

const PostBody = ({ body }: PostBodyProps) => {
  // Fetch blurData for each image asynchronously
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === "img") {
        const { src, alt } = domNode.attribs;
        const widthMatch = src.match(/width=(\d+)/);
        const heightMatch = src.match(/height=(\d+)/);

        return (
          <ZoomImage
            src={src}
            alt={alt}
            width={widthMatch && widthMatch[1]}
            height={heightMatch && heightMatch[1]}
          />
        );
      }
    },
  };

  const getParsedHtml = (body: string) => {
    return parse(body, options);
  };

  return (
    <article className="richtext h-full mx-auto">{getParsedHtml(body)}</article>
  );
};

export default PostBody;
