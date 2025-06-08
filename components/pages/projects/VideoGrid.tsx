"use client";
import React, { useRef } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";
import { getYouTubeVideoID } from "@/lib/getYoutubeVideo";

const VideoGrid = ({
  videos,
}: {
  videos: {
    link: string;
  }[];
}) => {
  // Keep refs of all players
  const playerRefs = useRef<YouTubePlayer[]>([]);

  // When player is ready, save ref
  const handleReady = (event: { target: YouTubePlayer }, index: number) => {
    playerRefs.current[index] = event.target;
  };

  // When one video plays, pause the others
  const handlePlay = (index: number) => {
    playerRefs.current.forEach((player, i) => {
      if (i !== index && player?.pauseVideo) {
        player.pauseVideo();
      }
    });
  };

  // Responsive grid columns
  const gridColsClass =
    videos.length === 1
      ? "grid-cols-1"
      : videos.length === 2
      ? "sm:grid-cols-1 md:grid-cols-2"
      : videos.length === 3
      ? "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className={`my-10 grid gap-4 ${gridColsClass}`}>
      {videos &&
        videos?.map((video: { link: string }, i: number) => (
          <div
            key={i}
            className="w-full overflow-hidden rounded-lg aspect-video relative"
          >
            <YouTube
              videoId={getYouTubeVideoID(video.link) as string}
              onReady={(e) => handleReady(e, i)}
              onPlay={() => handlePlay(i)}
              className="w-full h-full"
              iframeClassName="absolute top-0 left-0 w-full h-full rounded-lg border-0"
              opts={{
                playerVars: {
                  rel: 0, // no related videos
                  modestbranding: 1, // minimal branding
                },
              }}
            />
          </div>
        ))}
    </div>
  );
};

export default VideoGrid;
