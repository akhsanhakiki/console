"use client";

import React, { useState, useEffect } from "react";

interface SlideContent {
  title: string;
  description: string;
}

const slides: SlideContent[] = [
  {
    title: "Platform that helps you\nDo Smart Business",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu...",
  },
  {
    title: "AI-Powered Documentation\nMade Simple",
    description:
      "Generate comprehensive documentation automatically with our advanced AI technology, saving you time and effort.",
  },
  {
    title: "Collaborate Seamlessly\nWith Your Team",
    description:
      "Work together in real-time, share documents, and maintain version control effortlessly across your organization.",
  },
];

const IntroductionSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 15000); // 15 seconds

    return () => clearInterval(timer);
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-8">
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-8 w-[480px] h-[280px] text-white flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-4 whitespace-pre-line">
            {slides[currentSlide].title}
          </h2>
          <p className="text-sm opacity-80">
            {slides[currentSlide].description}
          </p>
        </div>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer hover:bg-white ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-4"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroductionSlider;
