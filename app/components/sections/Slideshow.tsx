"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { slides, type Slide } from "@/lib/data/slides";
import { useTranslation } from '../../contexts/TranslationContext';

export default function Slideshow() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [shuffledSlides, setShuffledSlides] = useState<Slide[]>(slides);

  // Shuffle slides on mount
  useEffect(() => {
    // Modern Fisher-Yates shuffle
    const newSlides = [...slides];
    for (let i = newSlides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newSlides[i], newSlides[j]] = [newSlides[j], newSlides[i]];
    }
    setShuffledSlides(newSlides);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!autoplay || !mounted) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % shuffledSlides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoplay, mounted, shuffledSlides.length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % shuffledSlides.length);
    setAutoplay(false);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + shuffledSlides.length) % shuffledSlides.length);
    setAutoplay(false);
  };

  return (
    <section className="section-slideshow-v1 w-full">
      <div className="slick-side-h1 relative w-full h-screen md:h-[600px] overflow-hidden bg-gray-900">
        {shuffledSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="info-sideh1 relative w-full h-full">
              {/* Desktop Image */}
              <div className="hidden md:block absolute inset-0">
                <a href={slide.ctaLink} className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === current}
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>

              {/* Mobile Image */}
              <div className="block md:hidden absolute inset-0">
                <a href={slide.ctaLink} className="absolute inset-0">
                  <Image
                    src={slide.mobileImage}
                    alt={slide.title}
                    fill
                    priority={index === current}
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>

              {/* Content Overlay */}
              <div className="box-content absolute inset-0 flex items-center">
                <div
                  className={`text-left box-info animated p-6 md:p-12 w-full md:w-1/2 transition-all duration-1000 ease-in-out ${index === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  <div className="box-title1 mb-0">
                    <h3 className="title-small text-sm md:text-base font-light text-white uppercase tracking-widest leading-tight">
                      {t(`slideshow.slide${slide.id}.subtitle`)}
                    </h3>
                  </div>
                  <div className="box-title mt-1 mb-1">
                    <h3 className="titlebig text-3xl md:text-5xl font-light text-white leading-tight">
                      {t(`slideshow.slide${slide.id}.title`)}
                    </h3>
                  </div>
                  <div className="box-title2 mt-1">
                    <h3 className="title-small text-sm md:text-base font-light text-gray-100 leading-relaxed">
                      {t(`slideshow.slide${slide.id}.description`)}
                    </h3>
                  </div>

                  <div className="btn-animation mt-4">
                    <Link
                      href={slide.ctaLink}
                      className="button-main2 button-shop inline-block px-8 py-3 text-white border-2 border-white transition hover:bg-white hover:text-black font-semibold"
                    >
                      {t(`slideshow.slide${slide.id}.ctaText`)}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          className="slick-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
          aria-label="Previous slide"
        >
          <span className="fa fa-angle-left text-white text-xl"></span>
        </button>
        <button
          onClick={nextSlide}
          className="slick-next absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-3 transition"
          aria-label="Next slide"
        >
          <span className="fa fa-angle-right text-white text-xl"></span>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {shuffledSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === current ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
