"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TBannerBlock } from "@/interfaces";
import PaddingContainer from "../common/PaddingContainer";

const BannerBlock = ({ block }: { block: TBannerBlock }) => {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  const next = () => instanceRef.current?.next();
  const prev = () => instanceRef.current?.prev();

  return (
    <PaddingContainer>
      <div className="relative mx-auto rounded-lg overflow-hidden  shadow-sm">
        <div
          ref={sliderRef}
          className="keen-slider h-[220px] sm:h-[300px] md:h-[400px]"
        >
          {block.item.banners.map((banner) => (
            <div key={banner.banners_id.id} className="keen-slider__slide">
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${banner.banners_id.image}`}
                alt={"banner"}
                width={1920}
                height={500}
                className="w-full h-full object-cover"
                priority={banner.banners_id.id === 1}
              />
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-primary text-background p-2 rounded-full hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 right-3 -translate-y-1/2  bg-primary text-background p-2 rounded-full hover:bg-secondary hover:text-foreground transition-all duration-200"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </PaddingContainer>
  );
};

export default BannerBlock;
