



// src/components/AdminDashboard.jsx
// ======================================================
// Modern Admin Dashboard (single-file update)
// - Dashboard (Feedback + Slides) on main view (modern layout + Pie chart)
// - Admin Management as a tab (Add / Remove / Change password)
// - Cloudinary direct upload flow: upload file -> get secure_url -> POST to backend
// - Small built-in Toast system and upload spinner
// - Uses fetch(), Recharts, and react-icons
// NOTE: keep other backend routes unchanged. Replace CLOUDINARY_* constants below.
// ======================================================

import React, { useEffect, useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import { FiUploadCloud, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

/* =========================
   CONFIG - change these
   ========================= */
const API_URL = "http://127.0.0.1:5000/api"; // backend base (keep /api here)
const CLOUDINARY_CLOUD_NAME = "dqbnwmsta"; // <-- set your cloud name
const CLOUDINARY_UPLOAD_PRESET = "yoqc1jjuawt"; // <-- set your unsigned preset
const AUTH_TOKEN_KEY = "token"; // localStorage JWT key (if you use auth) - adjust if needed

/* =========================
   Small Toast system (no external lib)
   ========================= */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = (text, type = "success", ttl = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  };
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  return { toasts, add, remove };
}

function Toasts({ toasts, remove }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-lg shadow-md text-sm ${
            t.type === "error" ? "bg-red-50 text-red-700" : "bg-white text-gray-800"
          } border`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>{t.text}</div>
            <button onClick={() => remove(t.id)} className="text-xs text-gray-400">x</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   Small Spinner
   ========================= */
function Spinner() {
  return (
    <div className="inline-block animate-spin" aria-hidden>
      <svg className="w-5 h-5" viewBox="0 0 50 50">
        <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M25 5a20 20 0 0 1 0 40 20 20 0 0 1 0-40z" />
      </svg>
    </div>
  );
}

/* =========================
   Main component
   ========================= */
export default function AdminDashboard() {
  // Data states
  const [summary, setSummary] = useState({
    total_feedback: 0,
    total_yes: 0,
    total_no: 0,
  });
  const [bySubcounty, setBySubcounty] = useState([]); // regional breakdown
  const [reasons, setReasons] = useState([]); // reasons for No votes
  const [slides, setSlides] = useState([]);
  const [noReasons, setNoReasons] = useState([]);

  // Upload UI states
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  // Admin management states (tab)
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'admins'
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    password: "",
    is_super: false,
  });
  const [changingPasswordFor, setChangingPasswordFor] = useState(null); // username or null
  const [changePw, setChangePw] = useState({
    old_password: "",
    new_password: "",
  });

  // toasts
  const { toasts, add: addToast, remove: removeToast } = useToasts();

  // refs
  const fileRef = useRef();

  // Pie chart colors
  const PIE_COLORS = ["#7e58f0ff", "#e97a7aff"]; // Yes (purple), No (soft red)

  // Helpers for auth header (if JWT is used)
  const AUTH_TOKEN_KEY = "token";
  function authHeaders() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /* =========================
     Fetching functions (keep logic intact)
     ========================= */

  // Summary for pie & cards
  async function fetchSummary() {
    try {
      const res = await fetch(`${API_URL}/dashboard/summary`);
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      // normalize keys (your backend uses total_feedback/total_yes/total_no)
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
      addToast("Failed to load summary", "error");
    }
  }

  // Regional breakdown by subcounty
  async function fetchBySubcounty() {
    try {
      const res = await fetch(`${API_URL}/dashboard/by-subcounty`);
      if (!res.ok) throw new Error("Failed to fetch regional data");
      const data = await res.json();
      setBySubcounty(data);
    } catch (err) {
      console.error("Error fetching regional data:", err);
      addToast("Failed to load regional data", "error");
    }
  }

  // Reasons for No votes (new route)
  async function fetchReasons() {
    try {
      const res = await fetch(`${API_URL}/feedback/reasons`);
      if (!res.ok) throw new Error("Failed to fetch reasons");
      const data = await res.json(); // expecting [{reason: "..."}]
      setReasons(data);
    } catch (err) {
      console.error("Error fetching reasons:", err);
      // reasons are optional; do not spam errors
    }
  }

  // Slides
  async function fetchSlides() {
    try {
      const res = await fetch(`${API_URL}/slides/`);
      if (!res.ok) throw new Error("Failed to fetch slides");
      const data = await res.json();
      // normalize slide fields (active vs is_active)
      const normalized = data.map((s) => ({
        id: s.id,
        image_url: s.image_url,
        caption: s.caption,
        active: s.is_active ?? s.active ?? false,
      }));
      setSlides(normalized);
    } catch (err) {
      console.error("Error fetching slides:", err);
      addToast("Failed to load slides", "error");
    }
  }

  // Admins list
  async function fetchAdmins() {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      console.log("token raw:", token, "Type:", typeof token);

      if (!token) {
        addToast("Cannot fetch admins: no token", "error");
        return;
      }

      const res = await fetch(`${API_URL}/admin/all`, {
        headers: authHeaders(),
      });
      if (!res.ok) {
        if (res.status === 403) {
          addToast("Unauthorized to fetch admins", "error");
        }
        throw new Error("Failed to fetch admins");
      }
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  }

  useEffect(() => {
    // initial load
    fetchSummary();
    fetchBySubcounty();
    fetchReasons();
    fetchSlides();
    fetchNoReasons();

    // fetchAdmins only when admin tab active
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNoReasons = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/no-reasons`);
      const data = await res.json();
      setNoReasons(data);
    } catch (err) {
      console.error("Error fetching 'no' reasons:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  /* =========================
     Pie chart data
     ========================= */
  const pieData = [
    { name: "Yes", value: summary.total_yes ?? summary.total_yes ?? 0 },
    { name: "No", value: summary.total_no ?? summary.total_no ?? 0 },
  ];

  /* =========================
     Cloudinary direct upload (unsigned preset)
     Flow:
      - Upload file to Cloudinary via client-side unsigned endpoint
      - Cloudinary returns secure_url
      - POST { image_url, caption, uploaded_by } to backend
     IMPORTANT:
      - Create an unsigned upload preset in Cloudinary and set its name in CLOUDINARY_UPLOAD_PRESET
      - CLOUDINARY_CLOUD_NAME must be set above
  ========================= */
  async function uploadToCloudinary(fileToUpload) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error(
        "Cloudinary configuration missing - set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET"
      );
    }
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
    const form = new FormData();
    form.append("file", fileToUpload);
    form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // optional: add folder, tags, etc:
    // form.append("folder", "campaign_slides");

    const res = await fetch(url, { method: "POST", body: form });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
    }
    const data = await res.json();
    return data.secure_url; // the usable image URL
  }

  /* =========================
     Upload handler (keeps UI & other logic intact)
     - uploads to Cloudinary first then tells backend
     ========================= */
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return addToast("Please select an image first", "error");
    if (!caption || caption.trim().length === 0)
      return addToast("Please add a caption", "error");

    setUploading(true);
    try {
      addToast("Uploading to Cloudinary...", "success");
      // 1) Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // 2) Send URL to backend to persist
      const payload = {
        image_url: imageUrl,
        caption: caption,
        uploaded_by: localStorage.getItem("username") || "admin", // adjust as needed
      };

      const res = await fetch(`${API_URL}/slides/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save slide in backend");
      }

      const body = await res.json();
      addToast(body.message || "Slide uploaded successfully");
      setFile(null);
      setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      fetchSlides();
    } catch (err) {
      console.error("Upload failed:", err);
      addToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  /* =========================
     Slide delete & toggle (fix API path)
     ========================= */
  async function handleDelete(id) {
    if (!window.confirm("Delete this slide?")) return;
    try {
      const res = await fetch(`${API_URL}/slides/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Delete failed");
      const body = await res.json();
      addToast(body.message || "Deleted slide");
      fetchSlides();
    } catch (err) {
      console.error("Delete failed:", err);
      addToast("Delete failed", "error");
    }
  }

  async function handleToggleActive(id) {
    try {
      const res = await fetch(`${API_URL}/slides/${id}/toggle`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Toggle failed");
      const body = await res.json();
      addToast(body.message || "Slide status updated");
      fetchSlides();
    } catch (err) {
      console.error("Toggle failed:", err);
      addToast("Toggle failed", "error");
    }
  }

  async function handleSetHero(imageUrl) {
    try {
      const res = await fetch(`${API_URL}/hero`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!res.ok) throw new Error("Failed to set hero image");
      const body = await res.json();
      addToast(body.message || "Hero image updated!");
    } catch (err) {
      console.error("Failed to set hero image:", err);
      addToast("Failed to set hero image", "error");
    }
  }

  /* =========================
     Admin management handlers
     - addAdmin, removeAdmin, changePassword
     - Uses /api/admin/* routes (see backend example)
     ========================= */

  async function addAdmin(e) {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.password)
      return addToast("Username and password required", "error");
    try {
      const res = await fetch(`${API_URL}/admin/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(newAdmin),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Add admin failed");
      addToast(body.message || "Admin added");
      setNewAdmin({ username: "", password: "", is_super: false });
      fetchAdmins();
    } catch (err) {
      console.error("Add admin error:", err);
      addToast(err.message || "Add admin failed", "error");
    }
  }

  async function removeAdmin(id) {
    if (!window.confirm("Remove this admin?")) return;
    try {
      const res = await fetch(`${API_URL}/admin/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Remove failed");
      addToast(body.message || "Admin removed");
      fetchAdmins();
    } catch (err) {
      console.error("Remove admin failed:", err);
      addToast("Remove admin failed", "error");
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (!changingPasswordFor) return;
    if (!changePw.old_password || !changePw.new_password)
      return addToast("Both passwords required", "error");
    try {
      const res = await fetch(`${API_URL}/admin/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(changePw),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Change password failed");
      addToast(body.message || "Password changed");
      setChangingPasswordFor(null);
      setChangePw({ old_password: "", new_password: "" });
    } catch (err) {
      console.error("Change password failed:", err);
      addToast(err.message || "Change password failed", "error");
    }
  }

  /* =========================
     Render UI
     ========================= */

  // 🔒 Logout handler
  const navigate=useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    addToast("Logged out successfully", "success");
    navigate("/", { replace: true }); // redirect to dashboard page
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10 px-4 md:px-8">
      {/* Toasts */}
      <Toasts toasts={toasts} remove={removeToast} />

      {/* Top header and tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview • Feedback • Slides • Admins
            </p>
          </div>

          {/* Tabs: Dashboard (feedback & slides) and Admins */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                activeTab === "dashboard"
                  ? "bg-purple-700 text-white"
                  : "text-purple-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-2 rounded-2xl text-sm font-medium ${
                activeTab === "admins"
                  ? "bg-purple-700 text-white"
                  : "text-purple-700"
              }`}
            >
              Admin Management
            </button>
            <button
              onClick={handleLogout}
              className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8">
        {activeTab === "dashboard" && (
          <>
            {/* Top row: Pie + Summary cards */}
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {/* Pie chart card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Yes vs No
                    </h3>
                    <p className="text-xs text-gray-500">
                      Distribution of votes
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: {summary.total_feedback ?? summary.total_feedback}
                  </div>
                </div>

                <div style={{ width: "100%", height: 240 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <ReTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary cards */}
              <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
                  <div className="text-sm text-gray-500">YES Votes</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {summary.total_yes}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
                  <div className="text-sm text-gray-500">NO Votes</div>
                  <div className="text-2xl font-bold text-red-500">
                    {summary.total_no}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-md flex flex-col justify-between">
                  <div className="text-sm text-gray-500">Total Feedback</div>
                  <div className="text-2xl font-bold text-green-600">
                    {summary.total_feedback}
                  </div>
                </div>
              </div>
            </div>

            {/* Regional breakdown + Reasons */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Regions list */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Regional Breakdown (by Subcounty)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {bySubcounty.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border-l-4"
                      style={{
                        borderColor:
                          r.yes_count >= r.no_count ? "#A78BFA" : "#FCA5A5",
                      }}
                    >
                      <div className="text-sm text-gray-500">{r.subcounty}</div>
                      <div className="text-xl font-semibold text-gray-800 mt-2">
                        Yes: {r.yes_count} • No: {r.no_count}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 italic">
                        {r.no_count > r.yes_count
                          ? "⚠️ Needs Action"
                          : "✅ Positive Engagement"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🟣 Community Concerns Section */}
              <section className="mb-16">
                <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
                  Community Concerns (Reasons for "No" Votes)
                </h2>
                {noReasons.length === 0 ? (
                  <p className="text-center text-gray-500 italic">
                    No negative feedback yet 🎉
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-2xl shadow-md overflow-hidden">
                      <thead className="bg-purple-700 text-white">
                        <tr>
                          <th className="py-3 px-4 text-left">Ward</th>
                          <th className="py-3 px-4 text-left">Village</th>
                          <th className="py-3 px-4 text-left">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {noReasons.map((item, i) => (
                          <tr
                            key={i}
                            className="border-b hover:bg-purple-50 transition-all"
                          >
                            <td className="py-2 px-4 font-medium text-purple-800">
                              {item.ward || "—"}
                            </td>
                            <td className="py-2 px-4 text-purple-700">
                              {item.village || "—"}
                            </td>
                            <td className="py-2 px-4 text-gray-700 italic">
                              {item.reason || "No reason provided"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Reasons (No votes) and slideshow upload */}
              <div className="space-y-6">
                {/* Reasons */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Reasons for "No" Votes
                  </h3>
                  {reasons.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No reasons submitted yet.
                    </div>
                  ) : (
                    <ul className="space-y-2 max-h-48 overflow-auto">
                      {reasons.map((r, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 border-b pb-2"
                        >
                          {r.reason}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Slideshow upload & gallery */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Slideshow Management
                  </h3>

                  {/* Upload form */}
                  <form
                    onSubmit={handleUpload}
                    className="flex flex-col gap-3 mb-4"
                  >
                    <label className="text-sm text-gray-600">
                      Select image (will upload to Cloudinary)
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Caption for the image..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full text-sm"
                      >
                        {uploading ? (
                          <>
                            <Spinner /> Uploading...
                          </>
                        ) : (
                          <>
                            <FiUploadCloud /> Upload
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setCaption("");
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="px-4 py-2 border rounded-full text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </form>

                  {/* Gallery */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {slides.map((s) => (
                      <div
                        key={s.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <img
                          src={s.image_url}
                          alt={s.caption}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-3">
                          <div className="text-sm text-gray-700 italic">
                            {s.caption || "No caption"}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleToggleActive(s.id)}
                              className="flex-1 px-3 py-1 rounded-full bg-purple-600 text-white text-sm"
                            >
                              {s.active ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              onClick={() => handleSetHero(s.image_url)}
                              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-full text-sm flex-1 transition-all"
                            >
                              Set as Hero
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="flex-1 px-3 py-1 rounded-full bg-red-500 text-white text-sm"
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Admin Management tab */}
        {activeTab === "admins" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Admin Users</h3>

            {/* Add admin form */}
            <form
              onSubmit={addAdmin}
              className="grid md:grid-cols-3 gap-3 mb-6"
            >
              <input
                value={newAdmin.username}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
                placeholder="Username"
                className="p-2 border rounded-md"
              />
              <input
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                type="password"
                placeholder="Password"
                className="p-2 border rounded-md"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={newAdmin.is_super}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, is_super: e.target.checked })
                    }
                  />{" "}
                  Super Admin
                </label>
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-purple-700 text-white rounded-full"
                >
                  Add Admin
                </button>
              </div>
            </form>

            {/* Admins list */}
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">#</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a, idx) => (
                    <tr key={a.id || idx} className="border-t">
                      <td className="p-2">{idx + 1}</td>
                      <td className="p-2">{a.username}</td>
                      <td className="p-2">
                        {a.is_super ? "Super Admin" : "Admin"}
                      </td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => {
                            setChangingPasswordFor(a.username);
                          }}
                          className="px-3 py-1 rounded-full border text-sm"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => removeAdmin(a.id)}
                          className="px-3 py-1 rounded-full bg-red-500 text-white text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Change password modal (simple inline) */}
            {changingPasswordFor && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">
                  Change password for {changingPasswordFor}
                </h4>
                <form
                  onSubmit={changePassword}
                  className="grid md:grid-cols-3 gap-2 mt-2"
                >
                  <input
                    value={changePw.old_password}
                    onChange={(e) =>
                      setChangePw({ ...changePw, old_password: e.target.value })
                    }
                    type="password"
                    placeholder="Current password"
                    className="p-2 border rounded-md"
                  />
                  <input
                    value={changePw.new_password}
                    onChange={(e) =>
                      setChangePw({ ...changePw, new_password: e.target.value })
                    }
                    type="password"
                    placeholder="New password"
                    className="p-2 border rounded-md"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-3 py-2 bg-green-600 text-white rounded-full"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setChangingPasswordFor(null)}
                      className="px-3 py-2 border rounded-full"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}






