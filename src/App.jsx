// =====================================================
// App.jsx
// Root component that wraps everything and defines routes
// =====================================================

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // ✅ Home page we just built
import FeedbackForm from "./components/FeedbackForm";


export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🟣 Main Home Route */}
        <Route path="/" element={<Home />} />
        <Route path="/feedback" element={<FeedbackForm />} />
      </Routes>
    </Router>
  );
}
