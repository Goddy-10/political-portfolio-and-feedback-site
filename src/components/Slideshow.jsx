


// =====================================================
// Slideshow.jsx
// Handles the campaign photo slideshow
// Features: backend-fetched slides, autoplay (3s), arrows, captions
// Supports both local Flask uploads and cloud URLs
// =====================================================

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { API_URL } from "../config";

export default function Slideshow() {
  // 🟣 State to hold slide images fetched from the backend
  const [slides, setSlides] = useState([]);

  // 🟣 Current slide index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flask backend base URL (adjust if deployed)
  const backendURL = `${API_URL}/api/slides/active`;

  // 🟣 Fetch slides from backend on mount
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(backendURL);
        if (!res.ok) throw new Error("Failed to fetch slides");
        const data = await res.json();

        // 🟣 Normalize image URLs
        // If the backend returns a relative URL (starts with /uploads), prepend backend base
        const normalizedSlides = data.map((slide) => ({
          ...slide,
          image_url: slide.image_url.startsWith("/")
            ? `${API_URL}${slide.image_url}`
            : slide.image_url, // cloud URLs stay as-is
        }));

        setSlides(normalizedSlides);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    fetchSlides();
  }, []);

  // 🟣 Autoplay effect (changes slide every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (slides.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  // 🟣 Manual navigation (previous / next)
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  // 🟣 Placeholder when no slides available
  if (slides.length === 0) {
    return (
      <div className="w-full h-64 bg-purple-100 flex items-center justify-center rounded-2xl shadow-inner">
        <p className="text-purple-700 italic">No slides available yet...</p>
      </div>
    );
  }

  // 🟣 Current slide data
  const { image_url, caption } = slides[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-lg">
      {/* 🖼️ Slide Image */}
      <img
        src={image_url}
        alt={caption}
        className="w-full h-auto object-contain transition-all duration-700 ease-in-out"
      />

      {/* Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent"></div>

      {/* 🟣 Caption */}
      {caption && (
        <div className="absolute bottom-4 left-0 w-full text-center">
          <p className="text-white text-lg font-medium drop-shadow-md bg-purple-900/60 inline-block px-4 py-2 rounded-full">
            {caption}
          </p>
        </div>
      )}

      {/* 🟣 Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-purple-800/70 hover:bg-purple-900/80 p-3 rounded-full shadow-md transition-all"
      >
        <FaArrowLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-purple-800/70 hover:bg-purple-900/80 p-3 rounded-full shadow-md transition-all"
      >
        <FaArrowRight />
      </button>
    </div>
  );
}