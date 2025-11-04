// ===========================================
// Home.jsx
// Main landing page for Thuranira Kathiai Campaign
// Includes Hero, Vision, Objectives, Projects, and Footer
// The slideshow will be imported separately as Slideshow.jsx
// ===========================================
import { useState,useEffect } from "react";
import Slideshow from "../components/Slideshow";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion"
import { API_URL } from "../config";




export default function Home() {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const res = await fetch(`${API_URL}/hero`);
        const data = await res.json();
        setHeroImage(data.image_url);
      } catch (err) {
        console.error("Failed to fetch hero image:", err);
      }
    }
    fetchHeroImage();
  }, []);
  return (
    <div className="bg-purple-50 min-h-screen flex flex-col items-center justify-start text-gray-800">
      <Header />
      {/* 🟣 Hero Section */}
      {/* 🟣 Hero Section (reduced height for better balance) */}
      <section className="w-full min-h-[80vh] mt-20 flex flex-col md:flex-row items-stretch justify-center bg-gray-50 overflow-hidden">
        {/* Left: Candidate Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 h-[70vh] md:h-auto overflow-hidden flex items-center justify-center bg-gray-100"
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt="Candidate"
              className="w-full h-full object-contain md:object-center transition-all duration-700"
            />
          ) : (
            <p className="text-gray-400 italic">Loading candidate image...</p>
          )}
        </motion.div>

        {/* Right: Text Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full md:w-1/2 h-[80vh] flex flex-col items-center justify-center text-center text-white px-6 py-10"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900 animate-gradient-slow"></div>

          {/* Text Content */}
          <div className="relative z-10 w-full max-w-lg px-4">
            <p className="text-xs sm:text-sm md:text-base uppercase tracking-widest bg-white/20 px-4 py-1 rounded-full inline-block mb-3">
              🗳️ Official Campaign Portal
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg leading-tight">
              Thuranira Kathiai
            </h1>

            <p className="text-base sm:text-lg md:text-xl italic mb-6 drop-shadow-md">
              Empowering Communities, Building for the Future Generation
            </p>

            <a
              href="/feedback"
              className="relative overflow-hidden bg-white text-purple-800 font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:scale-105 inline-block"
            >
              <span className="relative z-10">Share Your Feedback ❤️</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
            </a>
          </div>
        </motion.div>
      </section>

      {/* 🟣 Slideshow Section (increased height, cleaner background) */}
      <section className="w-full py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-purple-800 mb-8">
            Our Journey in Pictures
          </h2>

          {/* Slideshow component (autoplay, captions, arrows) */}
          <div className="h-[500px] md:h-[600px]">
            <Slideshow />
          </div>
        </div>
      </section>

      {/* 🟣 Vision Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-purple-800 text-center mb-6">
          Our Vision
        </h2>
        <p className="text-center text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          To create a vibrant and empowered community where opportunities are
          accessible to all, and sustainable development is driven by unity,
          innovation, and integrity.
        </p>
      </section>

      {/* 🟣 Objectives Section */}
      <section className="bg-purple-100 w-full py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-8">
            Core Objectives
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Objective Cards */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Empower Youth
              </h3>
              <p className="text-gray-700">
                Build sustainable youth programs that create jobs, promote
                innovation, and inspire community-driven leadership.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Strengthen Education
              </h3>
              <p className="text-gray-700">
                Improve school infrastructure, access to learning materials, and
                equal opportunities for all learners.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-purple-600">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">
                Boost Local Economy
              </h3>
              <p className="text-gray-700">
                Support local entrepreneurs and cooperatives to ensure
                self-reliant, thriving communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🟣 Projects Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-purple-800 text-center mb-8">
          Key Development Projects
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Project Cards (you’ll edit descriptions later) */}
          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-600">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Water Access Program
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Expanding access to clean water through community boreholes and
              rainwater harvesting initiatives.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-600">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Agricultural Support Fund
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Providing farmers with modern tools, seeds, and training for
              sustainable agricultural growth.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-shadow border-t-4 border-purple-600">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">
              Healthcare Outreach
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Strengthening local health facilities and community-based medical
              outreach programs for better access to healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* 🟣 Footer */}
      <Footer />
    </div>
  );
}
