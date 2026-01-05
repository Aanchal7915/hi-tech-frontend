import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import logo from "../assets/logo1.png";

export default function Footer({ setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (page) => {
    setCurrentPage(page);
    // set a hash so refresh doesn't cause a server 404 (works without server rewrites)
    const pathMap = {
      "home": "/",
      "listings": "/listings",
      "about": "/about",
      "contact": "/contact",
      "privacy-policy": "/privacy-policy",
      "terms-conditions": "/terms-conditions",
    };
    const newPath = pathMap[page] || "/";
    try {
      window.history.pushState({}, "", newPath);
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 pt-12 md:pt-16 pb-6 md:pb-8 mt-16 md:mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

        {/* ===== BRAND SECTION ===== */}
        <div className="text-center sm:text-left">

          {/* LOGO */}
          <div
            onClick={() => handleNavigate("home")}
            className="cursor-pointer hover:scale-[1.02] transition-all inline-block"
          >
            <img
              src={logo}
              alt="Hi-Tech Homes Logo"
              className="h-44 md:h-56 w-auto object-contain mx-auto sm:mx-0"
            />
          </div>

          {/* SERVING SINCE - NO GAP */}
          <div className="text-gray-300 text-sm font-semibold mt-0">
            Serving since 2000
          </div>

          {/* DESCRIPTION - ALSO NO GAP */}
          <p
            className="text-gray-400 text-sm md:text-base leading-relaxed mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Building dreams into reality. Explore premium properties designed
            for comfort, style, and innovation — where luxury meets lifestyle.
          </p>
        </div>

        {/* ===== QUICK LINKS ===== */}
        <div className="text-center sm:text-left">
          <h3
            className="text-base md:text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Quick Links
          </h3>

          <ul
            className="space-y-2 md:space-y-2.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {[ 
              { label: "Home", page: "home" },
              { label: "Listings", page: "listings" },
              { label: "About", page: "about" },
              { label: "Contact", page: "contact" },
              { label: "Privacy Policy", page: "privacy-policy" },
            ].map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => handleNavigate(link.page)}
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-sm md:text-base"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== CONTACT INFO ===== */}
        <div className="text-center sm:text-left">
          <h3
            className="text-base md:text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Contact Us
          </h3>

          <ul
            className="space-y-2 md:space-y-3 text-gray-400 text-sm md:text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* ADDRESS */}
            <li className="flex items-start gap-2 justify-center sm:justify-start">
              <MapPin size={18} className="text-indigo-400 mt-1" />
              <span>
               8101 FF BOUGAINVILLEA LANE DLF PHASE 4, Gurugram, Haryana 122009
              </span>
            </li>

            {/* PHONE */}
            <li className="flex items-start gap-2 justify-center sm:justify-start">
              <Phone size={18} className="text-indigo-400 mt-1" />
              <div className="flex flex-col leading-relaxed">
                <a href="tel:+919560002261" className="hover:text-indigo-400 transition-colors">
                  +91-956000 2261
                </a>
                <a href="tel:+918929028000" className="hover:text-indigo-400 transition-colors">
                  +91-89290 28000
                </a>
              </div>
            </li>

            {/* EMAIL */}
            <li className="flex items-start gap-2 justify-center sm:justify-start">
              <Mail size={18} className="text-indigo-400 mt-1" />
              <div className="flex flex-col leading-relaxed">
                <a href="mailto:Hitechhomesluxury@gmail.com" className="hover:text-indigo-400 transition-colors">
                  Hitechhomesluxury@gmail.com
                </a>
                {/* <a href="mailto:mrinal@anukulindia.com" className="hover:text-indigo-400 transition-colors">
                  mrinal@anukulindia.com
                </a> */}
              </div>
            </li>
          </ul>
        </div>

        {/* ===== LEGAL & SOCIAL ===== */}
        <div className="text-center sm:text-left">
          <h3
            className="text-base md:text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Legal
          </h3>

          <ul
            className="space-y-2 mb-4 md:mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <li>
              <button
                onClick={() => handleNavigate("privacy-policy")}
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm md:text-base"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate("terms-conditions")}
                className="text-gray-400 hover:text-indigo-400 transition-colors text-sm md:text-base"
              >
                Terms & Conditions
              </button>
            </li>
          </ul>

          <h3
            className="text-base md:text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Connect With Us
          </h3>

          <div className="flex space-x-3 md:space-x-4 justify-center sm:justify-start">
            <a
              href="https://www.facebook.com/100064200993187"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all duration-300"
            >
              <Facebook size={18} />
            </a>

            <a
              href="https://www.instagram.com/hitechhomesluxury"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full border border-[#E1306C] text-[#E1306C] hover:bg-gradient-to-br hover:from-[#E1306C] hover:to-[#C13584] hover:text-white transition-all duration-300"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://www.linkedin.com/company/hitech-homesgurgaon/"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-all duration-300"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="https://m.youtube.com/@hitech_homes"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full border border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000] transition-all duration-300"
            >
              <Youtube size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* ===== COPYRIGHT ===== */}
      <div
        className="border-t border-gray-800 mt-8 md:mt-12 pt-4 md:pt-6 text-center px-4"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <p className="text-xs md:text-sm text-gray-500 mb-2">
          © {currentYear}{" "}
          <span className="font-semibold text-gray-400">
            Anukul Infosystems India LLP
          </span>
          . All rights reserved.
        </p>

        <p className="text-xs text-gray-600">
          Powered by{" "}
          <span className="font-medium text-gray-400">Hi-Tech Homes</span>
        </p>
      </div>
    </footer>
  );
}