

// ====================================
//  Footer.jsx (Final)
//  Enhanced footer with social icons and functional links
// ====================================

import { FaWhatsapp, FaEnvelope, FaFacebook, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-12 mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        
        {/* 🟣 Column 1: Candidate Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-3 hover:text-purple-300 transition-colors">
            Thuranira Kathiai
          </h2>
          <p className="text-purple-100 leading-relaxed">
            Empowering Communities, Building for the Future Generation.
          </p>
        </div>

        {/* 🟣 Column 2: Quick Links */}
        <div className="flex flex-col items-start md:items-center">
          <h3 className="text-lg font-semibold mb-3 border-b border-purple-400 pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-purple-100">
            <li>
              <Link
                to="/"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </Link>
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              About
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Projects
            </li>
            <li>
              <Link
                to="/feedback"
                className="hover:text-white transition-colors cursor-pointer"
              >
                Feedback
              </Link>
            </li>
          </ul>
        </div>

        {/* 🟣 Column 3: Contact Info */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-lg font-semibold mb-3 border-b border-purple-400 pb-1">
            Contact
          </h3>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 mb-4">
            <a
              href="https://facebook.com/thuranirakathiai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a
              href="https://x.com/thuranirakathiai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              <FaXTwitter className="text-xl" />
            </a>
          </div>

          {/* WhatsApp */}
          <div className="flex items-center space-x-2 mb-3">
            <FaWhatsapp className="text-green-400 text-lg" />
            <a
              href="https://wa.me/254722108878"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300"
            >
              +254 722108878
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-purple-300 text-lg" />
            <a
              href="mailto:info@thuranirakathiai.org"
              className="hover:text-purple-200"
            >
              info@thuranirakathiai.org
            </a>
          </div>
        </div>
      </div>

      {/* 🟣 Bottom Line */}
      <div className="text-center text-xs text-purple-200 mt-10 border-t border-purple-700 pt-4">
        © {new Date().getFullYear()} Thuranira Kathiai Campaign Team. All Rights Reserved.
      </div>
    </footer>
  );
}