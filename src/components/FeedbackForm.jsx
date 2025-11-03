// =====================================================
// FeedbackForm.jsx
// Feedback form page for voter engagement
// - Collects region, age, and voting intention
// - Sends data to Flask backend (later integration)
// =====================================================

import { useState } from "react";

export default function FeedbackForm() {
  // Local form states
  const [formData, setFormData] = useState({
    subcounty: "",
    ward: "",
    village: "",
    age_bracket: "",
    vote_input: "",
    reason: "",
  });

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Map frontend form fields to backend expectations
    const payload = {
      subcounty: formData.subcounty,
      ward: formData.ward,
      village: formData.area, // ✅ area → village
      age_bracket: formData.ageBracket, // ✅ ageBracket → age_bracket
      will_vote: formData.vote, // ✅ vote → will_vote
      reason: formData.reason,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/feedback/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Thank you for your feedback! ❤️");
        setFormData({
          subcounty: "",
          ward: "",
          area: "",
          ageBracket: "",
          vote: "",
          reason: "",
        });
      } else {
        const err = await response.json();
        console.error("Server responded with:", err);
        alert(err.error || "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Unable to reach server. Try again later.");
    }
  };
 

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center pt-24 pb-16 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">
          Voter Feedback Form 🗳️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subcounty */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">
              Subcounty
            </label>
            <input
              type="text"
              name="subcounty"
              value={formData.subcounty}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Ward */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">
              Ward
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Area / Village */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">
              Area / Village
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Age Bracket */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">
              Age Bracket
            </label>
            <select
              name="ageBracket"
              value={formData.ageBracket}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Select age range</option>
              <option value="18-28">18–28</option>
              <option value="28-35">28–35</option>
              <option value="35+">35 and above</option>
            </select>
          </div>

          {/* Vote Question */}
          <div>
            <label className="block text-purple-800 font-semibold mb-2">
              Would you vote for Thuranira Kathiai in 2027?
            </label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="vote"
                  value="yes"
                  checked={formData.vote === "yes"}
                  onChange={handleChange}
                  required
                />{" "}
                Yes ❤️
              </label>
              <label>
                <input
                  type="radio"
                  name="vote"
                  value="no"
                  checked={formData.vote === "no"}
                  onChange={handleChange}
                  required
                />{" "}
                No 😕
              </label>
            </div>
          </div>

          {/* Reason (shows only if 'No' selected) */}
          {formData.vote === "no" && (
            <div>
              <label className="block text-purple-800 font-semibold mb-2">
                Please tell us why or how we can improve:
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              ></textarea>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2 rounded-full font-semibold transition-all"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
