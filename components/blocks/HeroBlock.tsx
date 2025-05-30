"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { THeroBlock } from "@/interfaces";
import { Body } from "../common/Body";
import PaddingContainer from "../common/PaddingContainer";

const HeroBlock = ({ block }: { block: THeroBlock }) => {
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    renderMode: "performance",
    slides: { origin: "center", perView: 1 },
    created: () => setCurrentSlide(0),
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

  // Autoplay
  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [isClient, instanceRef]);

  // Wait for hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderSlide = (
    slide: (typeof block.item.sliders)[number],
    idx: number
  ) => (
    <div
      key={idx}
      className="keen-slider__slide relative h-full w-full flex items-center justify-center"
    >
      <Image
        src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${slide.sliders_id.image}`}
        alt={slide.sliders_id.body}
        fill
        priority={idx === 0}
        placeholder="blur"
        blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${slide.sliders_id.image}?width=10&quality=1`}
        className="object-cover brightness-[.6]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
      <PaddingContainer className="z-10 text-center space-y-4 flex flex-col justify-center items-center">
        <Body className="hero-body">{slide.sliders_id.body}</Body>
        {slide.sliders_id.button && (
          <Link
            href={slide.sliders_id.button_link || "#"}
            className="bg-primary hover:bg-secondary text-background hover:text-foreground w-fit font-semibold px-6 py-3 rounded-2xl shadow-md transition"
          >
            {slide.sliders_id.button_text || "Learn More"}
          </Link>
        )}
      </PaddingContainer>
    </div>
  );

  return (
    <div className="relative -mt-4 h-[60vh] overflow-hidden">
      {isClient ? (
        <>
          <div ref={sliderRef} className="keen-slider h-full">
            {block.item.sliders.map((slide, idx) => renderSlide(slide, idx))}
          </div>

          {/* Pagination */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {block.item.sliders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === idx ? "bg-foreground" : "bg-white/40"
                } transition-all`}
              />
            ))}
          </div>
        </>
      ) : (
        // Render only first slide (static, no KeenSlider)
        renderSlide(block.item.sliders[0], 0)
      )}
    </div>
  );
};

export default HeroBlock;
