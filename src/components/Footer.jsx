// ====================================
//  Footer.jsx
//  Styled footer section inspired by kinotimungania.com
//  Includes WhatsApp and email contact, purple/white theme
// ====================================

import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 🟣 Column 1: Candidate Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Thuranira Kathiai</h2>
          <p className="text-sm leading-relaxed text-purple-100">
            Empowering Communities, Building for the Future Generation.
          </p>
        </div>

        {/* 🟣 Column 2: Links (you can edit or replace text freely later) */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-purple-400 inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-purple-100">
            <li className="hover:text-white transition-colors cursor-pointer">
              Home
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              About
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Projects
            </li>
            <li className="hover:text-white transition-colors cursor-pointer">
              Feedback
            </li>
          </ul>
        </div>

        {/* 🟣 Column 3: Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-purple-400 inline-block pb-1">
            Contact
          </h3>

          {/* WhatsApp contact */}
          <div className="flex items-center space-x-2 mb-3">
            <FaWhatsapp className="text-green-400 text-xl" />
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 text-sm"
            >
              +254 700 000 000
            </a>
          </div>

          {/* Email contact */}
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-purple-300 text-lg" />
            <a
              href="mailto:info@thuranirakathiai.org"
              className="hover:text-purple-200 text-sm"
            >
              info@thuranirakathiai.org
            </a>
          </div>
        </div>
      </div>

      {/* 🟣 Bottom Line */}
      <div className="text-center text-xs text-purple-200 mt-8 border-t border-purple-700 pt-3">
        © {new Date().getFullYear()} Thuranira Kathiai Campaign Team. All Rights
        Reserved.
      </div>
    </footer>
  );
}
