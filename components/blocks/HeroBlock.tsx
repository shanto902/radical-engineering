"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";
import { THeroBlock } from "@/interfaces";
import { Body } from "../common/Body";

const HeroBlock = ({ block }: { block: THeroBlock }) => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "snap",
    renderMode: "performance",
    slides: { origin: "center", perView: 1 },
  });

  return (
    <div
      ref={sliderRef}
      className="keen-slider relative h-[90vh] overflow-hidden"
    >
      {block.item.sliders.map((slide, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative h-full w-full flex items-center justify-center"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${slide.sliders_id.image}`}
            alt={slide.sliders_id.body}
            fill
            priority={idx === 0}
            className="object-cover brightness-[.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="text-white z-10 space-y-4 px-8 flex flex-col items-start gap-5">
            <Body className="hero-body">{slide.sliders_id.body}</Body>
            {slide.sliders_id.button && (
              <Link
                href={slide.sliders_id.button_link || "#"}
                className="bg-primary hover:bg-yellow-300 text-white w-fit hover:text-black font-semibold px-6 py-3 rounded-2xl shadow-md transition"
              >
                {slide.sliders_id.button_text || "Learn More"}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroBlock;
