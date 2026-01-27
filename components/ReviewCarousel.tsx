/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Review {
  uuid: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  starRating: number;
  datePublished: string;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Autoplay plugin
function AutoplayPlugin(slider: any) {
  let timeout: any;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 4000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

export default function ReviewCarousel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: { perView: 1, spacing: 16 },
      breakpoints: {
        "(min-width: 768px)": {
          slides: { perView: 2, spacing: 24 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 32 },
        },
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [AutoplayPlugin],
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();

        if (data?.success) {
          const mappedReviews = data.widget.reviews.map((r: any) => ({
            uuid: r.id,
            authorName: r.author.name,
            authorAvatar: r.author.avatarUrl,
            text: r.text,
            starRating: r.rating.value,
            datePublished: r.publishedAt,
          }));
          setReviews(mappedReviews);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  if (!reviews.length) return null;

  const totalDots = reviews.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        What Our Customers Are Saying
      </h2>

      <div ref={sliderRef} className="keen-slider">
        {reviews.map((review) => (
          <div key={review.uuid} className="keen-slider__slide">
            <div className="bg-white dark:bg-background border rounded-xl shadow-lg p-6 h-full flex flex-col justify-between transition-transform duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.authorAvatar}
                  alt={review.authorName}
                  className="w-12 h-12 rounded-full border shadow"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {review.authorName}
                  </p>
                  <p className="text-yellow-500 text-sm">
                    {"★".repeat(review.starRating)}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-4">
                {review.text}
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                {formatDate(review.datePublished)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: totalDots }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === idx
                ? "bg-primary scale-125"
                : "bg-gray-400 dark:bg-gray-600"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
