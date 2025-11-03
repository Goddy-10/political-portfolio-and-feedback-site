// ===========================================
// Home.jsx
// Main landing page for Thuranira Kathiai Campaign
// Includes Hero, Vision, Objectives, Projects, and Footer
// The slideshow will be imported separately as Slideshow.jsx
// ===========================================

import Slideshow from "../components/Slideshow";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="bg-purple-50 min-h-screen flex flex-col items-center justify-start text-gray-800">
      <Header />
      {/* 🟣 Hero Section */}
      {/* 🟣 Hero Section (reduced height for better balance) */}
      <section
        className="
    w-full h-[50vh] flex flex-col items-center justify-center
     bg-left relative mt-20
  "
        // Hero image placeholder (replace with actual image path later)
        style={{
          backgroundImage: `url("https://pbs.twimg.com/media/FTvMAdpVEAA_6gZ?format=jpg&name=small")`,
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-purple-900 bg-opacity-40"></div>

        {/* Text Overlay */}
        <div className="relative text-center text-white px-6 md:px-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            Thuranira Kathiai
          </h1>
          <p className="text-lg md:text-xl italic mb-5 drop-shadow-md">
            Empowering Communities, Building for the Future Generation
          </p>

          {/* Feedback Button */}
          <a
            href="/feedback"
            className="
        bg-purple-700 hover:bg-purple-800 transition-all
        text-white font-semibold px-6 py-2 rounded-full shadow-md
      "
          >
            Share Your Feedback ❤️
          </a>
        </div>
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
