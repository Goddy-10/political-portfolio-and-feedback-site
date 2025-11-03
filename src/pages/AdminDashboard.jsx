// ================================
//  AdminDashboard.jsx
//  Unified dashboard for Admin & Super Admin
//  Displays feedback analytics, slideshow management, and regional insights
//  Uses purple-white theme, backend-ready with Flask API
// ================================

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  // 🟣 State for analytics & slideshow
  const [summary, setSummary] = useState({
    total_yes: 0,
    total_no: 0,
    total_responses: 0,
  });
  const [regionalData, setRegionalData] = useState([]);
  const [slides, setSlides] = useState([]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:5000/api";

  // 🟣 Fetch all data on mount
  useEffect(() => {
    fetchSummary();
    fetchRegionalData();
    fetchSlides();
  }, []);

  // 🟣 Fetch feedback summary totals
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/summary`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // 🟣 Fetch breakdown by subcounty, ward, and village
  const fetchRegionalData = async () => {
    try {
      const res = await fetch(`${API_URL}/feedback/by-region`);
      const data = await res.json();
      setRegionalData(data);
    } catch (err) {
      console.error("Error fetching regional data:", err);
    }
  };

  // 🟣 Fetch all slideshow images
  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_URL}/slides/`);
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("Error fetching slides:", err);
    }
  };

  // 🟣 Handle slide upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image first.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      const res = await fetch(`${API_URL}/slides/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
      setFile(null);
      setCaption("");
      fetchSlides();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // 🟣 Handle slide deletion
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/slides/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setMessage(data.message);
      fetchSlides();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // 🟣 Toggle active/inactive slideshow image
  const handleToggleActive = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/slides/${id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      setMessage(data.message);
      fetchSlides();
    } catch (err) {
      console.error("Toggle failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 py-20 px-6">
      {/* 🟣 Page Header */}
      <h1 className="text-3xl font-bold text-center text-purple-800 mb-10">
        Admin Dashboard
      </h1>

      {/* 🟣 Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center border-t-4 border-purple-600">
          <h2 className="text-lg font-semibold text-purple-700">YES Votes</h2>
          <p className="text-3xl font-bold text-purple-800 mt-2">
            {summary.total_yes}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center border-t-4 border-red-400">
          <h2 className="text-lg font-semibold text-purple-700">NO Votes</h2>
          <p className="text-3xl font-bold text-red-500 mt-2">
            {summary.total_no}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center border-t-4 border-green-400">
          <h2 className="text-lg font-semibold text-purple-700">
            Total Feedback
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {summary.total_responses}
          </p>
        </div>
      </div>

      {/* 🟣 Regional Breakdown */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          Regional Feedback Breakdown
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {regionalData.map((region, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-purple-500"
            >
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                {region.subcounty}
              </h3>
              <p className="text-sm text-purple-700">
                Ward: <span className="font-medium">{region.ward}</span>
              </p>
              <p className="text-sm text-purple-700">
                Village: <span className="font-medium">{region.village}</span>
              </p>
              <p className="text-sm mt-3">
                ✅ Yes:{" "}
                <span className="font-semibold text-green-600">
                  {region.yes_count}
                </span>{" "}
                | ❌ No:{" "}
                <span className="font-semibold text-red-500">
                  {region.no_count}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-600 italic">
                {region.no_count > region.yes_count
                  ? "⚠️ Needs Action"
                  : "✅ Positive Engagement"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🟣 Slideshow Management */}
      <section>
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          Slideshow Management
        </h2>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-2xl shadow-md max-w-xl mx-auto mb-10"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 w-full text-sm"
          />
          <input
            type="text"
            placeholder="Caption for the image..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-2 border rounded-md mb-4 text-sm"
          />
          <button
            type="submit"
            className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-full w-full transition-all"
          >
            Upload Image
          </button>
          {message && (
            <p className="text-center text-green-600 mt-3">{message}</p>
          )}
        </form>

        {/* Display Slides */}
        <div className="grid md:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white p-4 rounded-xl shadow-md">
              <img
                src={slide.image_url}
                alt={slide.caption}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <p className="text-center text-purple-800 text-sm italic">
                {slide.caption || "No caption"}
              </p>

              {/* Active/Inactive status indicator */}
              <p className="text-center mt-1 text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    slide.active ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {slide.active ? "Active" : "Inactive"}
                </span>
              </p>

              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-full text-sm flex-1 transition-all"
                >
                  {slide.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-full text-sm flex-1 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}













