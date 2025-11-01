// src/components/AdminDashboard.jsx
// ======================================================
// Combined Admin + Superadmin Dashboard
// - Sidebar navigation (Feedback Analytics, Slideshow Management, User Mgmt (superadmin only))
// - Purple / white theme consistent with the app
// - Backend-ready: expects JWT token in localStorage.key 'token' and role in 'role'
// - Uses axios for API calls and recharts for the pie chart
// - All API endpoints referenced here should be implemented by your Flask backend:
//
//   GET  /api/admin/summary           -> { total, yes, no, by_subcounty: [...], by_ward: [...], by_area: [...] }
//   GET  /api/admin/feedbacks?page=X  -> { feedbacks: [...], total }
//   GET  /api/admin/slides            -> [{id, image_url, caption}]
//   POST /api/admin/slides            -> form-data (file: 'image', caption) -> saves slide
//   DELETE /api/admin/slides/:id      -> deletes slide
//
// Notes:
// - Keep tokens secure in production (use httpOnly cookies). localStorage used here for simplicity.
// - Install required packages:
//     npm install axios recharts react-icons
// ======================================================

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import {
  FiImage,
  FiPieChart,
  FiUsers,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";

// ====================
// CONFIG - change these if your backend is on a different URL
// ====================
const API_BASE = "http://localhost:5000"; // <-- change if backend hosted elsewhere
const AUTH_TOKEN_KEY = "token";
const AUTH_ROLE_KEY = "role";

// Theme colors (change here to tweak colors across dashboard)
const COLORS = {
  primary: "#6B21A8", // purple
  accent: "#A78BFA",
  bg: "#ffffff",
  text: "#111827",
  cardBg: "#FAF5FF",
  danger: "#dc2626",
  success: "#16a34a",
};

// Helper for axios with auth header
function axiosWithAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return axios.create({
    baseURL: API_BASE,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

// ====================
// Small presentational components used in the dashboard
// ====================
function Sidebar({ active, setActive, onLogout, role }) {
  return (
    <aside
      className="w-64 pt-8 pb-12 px-4 border-r"
      style={{ background: "#fff" }}
    >
      <div className="mb-8 px-2">
        <h3 className="text-xl font-bold" style={{ color: COLORS.primary }}>
          Dashboard
        </h3>
        <p className="text-sm text-gray-500">
          {role === "superadmin" ? "Super Admin" : "Admin"}
        </p>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <button
          onClick={() => setActive("analytics")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-left w-full ${
            active === "analytics" ? "bg-purple-50" : "hover:bg-gray-50"
          }`}
        >
          <FiPieChart /> <span>Feedback Analytics</span>
        </button>

        <button
          onClick={() => setActive("slides")}
          className={`flex items-center gap-3 px-3 py-2 rounded-md text-left w-full ${
            active === "slides" ? "bg-purple-50" : "hover:bg-gray-50"
          }`}
        >
          <FiImage /> <span>Slideshow Manager</span>
        </button>

        {/* User management only visible to superadmin */}
        {role === "superadmin" && (
          <button
            onClick={() => setActive("users")}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-left w-full ${
              active === "users" ? "bg-purple-50" : "hover:bg-gray-50"
            }`}
          >
            <FiUsers /> <span>Admin Users</span>
          </button>
        )}

        <div className="mt-6 px-3">
          <button
            onClick={onLogout}
            className="w-full text-sm px-3 py-2 rounded-md border hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}

// Small stats card
function StatCard({ label, value, hint }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className="text-2xl font-bold mt-2"
        style={{ color: COLORS.primary }}
      >
        {value}
      </div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

// ====================
// Dashboard main component
// ====================
export default function AdminDashboard() {
  // UI state
  const [active, setActive] = useState("analytics"); // analytics | slides | users
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null); // holds summary from /api/admin/summary
  const [feedbacks, setFeedbacks] = useState([]); // paginated feedback list
  const [slides, setSlides] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(50);
  const [totalFeedback, setTotalFeedback] = useState(0);
  const [role, setRole] = useState(
    localStorage.getItem(AUTH_ROLE_KEY) || "admin"
  );
  const [error, setError] = useState(null);

  // Slide upload state
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");

  // Fetch summary + feedbacks + slides on mount (if token present)
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    const client = axiosWithAuth();
    try {
      // Summary (aggregates)
      const resSummary = await client.get("/api/admin/summary");
      setSummary(resSummary.data);

      // Feedbacks (first page)
      const resFeedbacks = await client.get(
        `/api/admin/feedbacks?page=${page}&per_page=${perPage}`
      );
      setFeedbacks(resFeedbacks.data.feedbacks || []);
      setTotalFeedback(resFeedbacks.data.total || 0);

      // Slides
      const resSlides = await client.get("/api/admin/slides");
      setSlides(resSlides.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err?.response?.data?.error || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  // ====================
  // Logout - clear tokens and reload (or navigate)
  // ====================
  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    // simplest: reload to force auth gating in app
    window.location.href = "/";
  }

  // ====================
  // Slide upload handler
  // ====================
  async function handleUpload(e) {
    e.preventDefault();
    setError(null);
    if (!fileRef.current || !fileRef.current.files.length) {
      setError("Please choose an image file to upload.");
      return;
    }
    setUploading(true);

    const form = new FormData();
    form.append("image", fileRef.current.files[0]);
    form.append("caption", caption);

    try {
      const client = axiosWithAuth();
      const resp = await client.post("/api/admin/slides", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Refresh slides list
      setCaption("");
      fileRef.current.value = "";
      setSlides((prev) => [resp.data, ...prev]); // assume API returns created slide
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  // ====================
  // Slide delete handler
  // ====================
  async function handleDeleteSlide(id) {
    if (!window.confirm("Delete this slide? This action cannot be undone."))
      return;
    try {
      const client = axiosWithAuth();
      await client.delete(`/api/admin/slides/${id}`);
      setSlides((s) => s.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Delete slide error:", err);
      setError(err?.response?.data?.error || "Delete failed");
    }
  }

  // ====================
  // Pagination for feedbacks (simple previous/next)
  // ====================
  async function changePage(nextPage) {
    setPage(nextPage);
    try {
      const client = axiosWithAuth();
      const res = await client.get(
        `/api/admin/feedbacks?page=${nextPage}&per_page=${perPage}`
      );
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error("Page fetch error:", err);
    }
  }

  // ====================
  // Small helper to render region breakdown as modern cards
  // We prefer cards (clean, modern) for quick scanning, with small tables for details
  // ====================
  function renderBreakdownCards(list, labelKey = "name") {
    // expected list: [{ name: 'X', count: 123 }, ...]
    if (!Array.isArray(list)) return null;
    return (
      <div className="grid md:grid-cols-3 gap-4">
        {list.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-md shadow-sm border">
            <div className="text-sm text-gray-500">
              {" "}
              {item[labelKey] || item.name}{" "}
            </div>
            <div
              className="text-2xl font-bold mt-2"
              style={{ color: COLORS.primary }}
            >
              {item.count ?? item.value ?? 0}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --------------------
  // Pie chart data
  // --------------------
  const pieData = summary
    ? [
        { name: "Yes", value: summary.yes || 0 },
        { name: "No", value: summary.no || 0 },
      ]
    : [
        { name: "Yes", value: 0 },
        { name: "No", value: 0 },
      ];

  const PIE_COLORS = ["#A78BFA", "#FCA5A5"]; // yes purple, no soft red

  // ====================
  // Render the analytics content
  // ====================
  function AnalyticsView() {
    return (
      <div className="p-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          Feedback Analytics
        </h2>

        {loading && <div className="text-sm text-gray-500">Loading...</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {/* Top stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Responses" value={summary?.total ?? 0} />
          <StatCard
            label="Yes ❤️"
            value={summary?.yes ?? 0}
            hint="Support expressed"
          />
          <StatCard
            label="No"
            value={summary?.no ?? 0}
            hint="Areas to improve"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Pie chart */}
          <div className="bg-white p-4 rounded-md shadow-sm border">
            <div className="text-sm text-gray-500 mb-2">Yes vs No</div>
            <div style={{ width: "100%", height: 260 }}>
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

          {/* Region breakdowns */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">By Subcounty</div>
              </div>
              {renderBreakdownCards(summary?.by_subcounty)}
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">By Ward</div>
              </div>
              {renderBreakdownCards(summary?.by_ward)}
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-500">By Area / Village</div>
              </div>
              {renderBreakdownCards(summary?.by_area)}
            </div>
          </div>
        </div>

        {/* Feedback list (paginated) */}
        <div className="mt-6 bg-white p-4 rounded-md shadow-sm border">
          <h3 className="font-semibold mb-3">Recent Feedback</h3>
          {feedbacks.length === 0 ? (
            <div className="text-sm text-gray-500">No feedback yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">#</th>
                    <th className="p-2">Subcounty</th>
                    <th className="p-2">Ward</th>
                    <th className="p-2">Area</th>
                    <th className="p-2">Age</th>
                    <th className="p-2">Vote</th>
                    <th className="p-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f, i) => (
                    <tr key={f.id || i} className="border-t">
                      <td className="p-2">{i + 1 + (page - 1) * perPage}</td>
                      <td className="p-2">{f.subcounty}</td>
                      <td className="p-2">{f.ward}</td>
                      <td className="p-2">{f.area_village}</td>
                      <td className="p-2">{f.age_bracket}</td>
                      <td className="p-2">{f.would_vote ? "Yes ❤️" : "No"}</td>
                      <td className="p-2">{f.reason ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {feedbacks.length} of {totalFeedback}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changePage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border text-sm"
              >
                Prev
              </button>
              <button
                onClick={() => changePage(page + 1)}
                className="px-3 py-1 rounded border text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================
  // Slides management view
  // ====================
  function SlidesView() {
    return (
      <div className="p-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          Slideshow Manager
        </h2>

        {/* Upload form */}
        <div className="bg-white p-4 rounded-md shadow-sm border mb-6">
          <form
            onSubmit={handleUpload}
            className="flex flex-col md:flex-row gap-3 items-start"
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="block"
            />
            <input
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="px-3 py-2 border rounded-md flex-1"
            />
            <button
              type="submit"
              disabled={uploading}
              className="bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FiUpload /> {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </div>

        {/* Existing slides list */}
        <div className="grid md:grid-cols-3 gap-4">
          {slides.map((s) => (
            <div
              key={s.id}
              className="bg-white p-3 rounded-md border shadow-sm"
            >
              <div className="w-full h-40 overflow-hidden rounded">
                <img
                  src={s.image_url}
                  alt={s.caption || "slide"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 text-sm text-gray-700 min-h-[48px]">
                {s.caption}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleDeleteSlide(s.id)}
                  className="flex-1 px-3 py-1 rounded-md border text-sm text-red-600 hover:bg-red-50"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====================
  // Users management view (superadmin only)
  // Minimal: simple list + add/remove admin (keeps app lightweight)
  // Backend endpoints expected:
  // GET /api/admin/users
  // POST /api/admin/users { username, password, role }
  // DELETE /api/admin/users/:id
  // ====================
  function UsersView() {
    // For simplicity and keeping the app light, this is a small placeholder view.
    // We'll only fetch + show users, and allow adding a new admin (superadmin).
    // Implementation note: keep passwords hashed on backend.
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
      username: "",
      password: "",
      role: "admin",
    });
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState(null);

    useEffect(() => {
      // fetch users if superadmin
      if (role !== "superadmin") return;
      const load = async () => {
        setLoadingUsers(true);
        try {
          const client = axiosWithAuth();
          const res = await client.get("/api/admin/users");
          setUsers(res.data || []);
        } catch (err) {
          setUsersError("Could not load users");
        } finally {
          setLoadingUsers(false);
        }
      };
      load();
    }, [role]);

    async function addUser(e) {
      e.preventDefault();
      try {
        const client = axiosWithAuth();
        const res = await client.post("/api/admin/users", newUser);
        setUsers((u) => [res.data, ...u]);
        setNewUser({ username: "", password: "", role: "admin" });
      } catch (err) {
        setUsersError("Could not add user");
      }
    }

    async function deleteUser(id) {
      if (!window.confirm("Delete admin user?")) return;
      try {
        const client = axiosWithAuth();
        await client.delete(`/api/admin/users/${id}`);
        setUsers((u) => u.filter((x) => x.id !== id));
      } catch (err) {
        setUsersError("Delete failed");
      }
    }

    return (
      <div className="p-6">
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: COLORS.primary }}
        >
          Admin Users
        </h2>

        {usersError && (
          <div className="text-sm text-red-600 mb-4">{usersError}</div>
        )}
        {loadingUsers && (
          <div className="text-sm text-gray-500 mb-4">Loading users...</div>
        )}

        <div className="bg-white p-4 rounded-md shadow-sm border mb-6">
          <form onSubmit={addUser} className="grid md:grid-cols-3 gap-2">
            <input
              placeholder="username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <input
              placeholder="password"
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="px-3 py-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-purple-700 text-white px-4 py-2 rounded"
            >
              Add Admin
            </button>
          </form>
        </div>

        <div className="grid gap-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white p-3 rounded-md border flex items-center justify-between"
            >
              <div>
                <div className="font-semibold">{u.username}</div>
                <div className="text-xs text-gray-500">Role: {u.role}</div>
              </div>
              <div>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="px-3 py-1 rounded border text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====================
  // Main render
  // ====================
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-6 py-8 px-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Sidebar
            active={active}
            setActive={setActive}
            onLogout={handleLogout}
            role={role}
          />
        </div>

        {/* Content */}
        <div className="md:col-span-5 bg-transparent rounded-md">
          {/* Topbar: role + quick refresh */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: COLORS.primary }}
              >
                {role === "superadmin" ? "Super Admin Panel" : "Admin Panel"}
              </h1>
              <div className="text-sm text-gray-500">
                Manage feedback, slideshow, and settings.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={fetchAll} className="px-3 py-1 rounded border">
                Refresh
              </button>
              <div className="text-sm text-gray-500">
                Role: <span className="font-semibold">{role}</span>
              </div>
            </div>
          </div>

          {/* active view */}
          <div className="bg-transparent rounded">
            {active === "analytics" && <AnalyticsView />}
            {active === "slides" && <SlidesView />}
            {active === "users" &&
              (role === "superadmin" ? (
                <UsersView />
              ) : (
                <div className="p-6">Unauthorized</div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
