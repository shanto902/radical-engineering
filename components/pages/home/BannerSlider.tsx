"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072", // Replace with your actual image
    alt: "24-hour delivery across Bangladesh",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1676337167752-2062c6ca7366?q=80&w=2070",
    alt: "Promo 2",
  },
];

export default function BannerSlider() {
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
  });

  const next = () => instanceRef.current?.next();
  const prev = () => instanceRef.current?.prev();

  return (
    <div className="relative mb-20 max-w-7xl mx-auto rounded-lg overflow-hidden bg-white shadow-sm">
      <div
        ref={sliderRef}
        className="keen-slider h-[220px] sm:h-[300px] md:h-[400px]"
      >
        {banners.map((banner) => (
          <div key={banner.id} className="keen-slider__slide">
            <Image
              src={banner.image}
              alt={banner.alt}
              width={1920}
              height={500}
              className="w-full h-full object-cover"
              priority={banner.id === 1}
            />
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-200"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-200"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
