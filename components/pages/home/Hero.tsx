"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    title: "Harness the Power of the Sun",
    subtitle: "High-efficiency solar panels for your home or business.",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072",
    href: "/products",
    cta: "Explore Products",
  },
  {
    title: "Energy That Never Sleeps",
    subtitle: "Smart battery systems for day and night energy storage.",
    image:
      "https://images.unsplash.com/photo-1676337167752-2062c6ca7366?q=80&w=2070",
    href: "/batteries",
    cta: "See Batteries",
  },
  {
    title: "Clean Energy, Brighter Future",
    subtitle: "Make the switch to a more sustainable lifestyle today.",
    image:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=1932",
    href: "/about",
    cta: "Why Solar?",
  },
];

export default function Hero() {
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
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="keen-slider__slide relative h-full w-full flex items-center justify-center"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={idx === 0}
            className="object-cover brightness-[.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          <div className="absolute z-10 text-white px-8 max-w-3xl">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl mb-6 text-white/90">
              {slide.subtitle}
            </p>
            <Link
              href={slide.href}
              className="bg-primary hover:bg-yellow-300 text-white hover:text-black font-semibold px-6 py-3 rounded-full shadow-md transition"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
