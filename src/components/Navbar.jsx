import { useContext, useState } from "react";
import { Menu, X, Sparkles, Phone } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo1.png";
import { UserAuthContext } from "../context/UserAuthContext";
import AuthModal from "./AuthModal";

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user, logout } = useContext(AuthContext);
  const { user: regularUser, logout: userLogout } = useContext(UserAuthContext);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const navLinks = [
    { name: "Home", page: "home" },
    { name: "Listings", page: "listings" },
    { name: "About", page: "about" },
    { name: "Contact", page: "contact" },
  ];

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // enhance navigation to push a URL so direct linking works
  const pushPathForPage = (page) => {
    const pathMap = {
      home: "/",
      listings: "/listings",
      about: "/about",
      contact: "/contact",
      "privacy-policy": "/privacy-policy",
      "terms-conditions": "/terms-conditions",
    };
    const newPath = pathMap[page] || "/";
    try {
      window.history.pushState({}, "", newPath);
    } catch (e) {}
  };

  const handleLogout = () => {
    if (user) logout();
    else if (regularUser) userLogout();
    handleNavigate("home");
    pushPathForPage("home");
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* LEFT: Logo */}
            <div
              onClick={() => { handleNavigate("home"); pushPathForPage("home"); }}
              className="flex items-center cursor-pointer group"
            >
              <img
                src={logo}
                alt="Hi-Tech Homes Logo"
                className="h-16 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* CENTER: Mobile Phone Number (New Position) - Hidden on desktop */}
            <a
              href="tel:+919560002261"
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all text-sm"
            >
              <Phone size={18} />
              <span>9560002261</span>
            </a>

            {/* CENTER: Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                return (
                  <div key={link.page} className="group relative">
                    <button
                      onClick={() => { handleNavigate(link.page); pushPathForPage(link.page); }}
                      className={`text-base font-semibold tracking-wide transition-all pb-1 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                    >
                      {link.name}
                    </button>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </div>
                );
              })}
            </div>

            {/* RIGHT: Desktop Phone + Auth */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:+919560002261"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-rose-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
              >
                <Phone size={20} />
                <span className="text-sm">+91 956000 2261</span>
              </a>

              {user ? (
                <>
                  <button onClick={() => handleNavigate("admin-dashboard")} className="text-base font-semibold text-gray-700 hover:text-indigo-600">
                    Dashboard
                  </button>
                  <button onClick={handleLogout} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:scale-105 transition-all">
                    Logout
                  </button>
                </>
              ) : regularUser ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full border border-indigo-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {regularUser.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{regularUser.name}</span>
                  </div>
                  <button onClick={handleLogout} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg hover:scale-105 transition-all">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-rose-600 text-white font-bold shadow-lg hover:scale-105 transition-all"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden text-gray-700 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              {mobileMenu ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="md:hidden bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 backdrop-blur-lg shadow-2xl border-t border-indigo-100">
            <div className="px-6 py-8 flex flex-col items-center space-y-6">

              {/* Removed Phone Number from here */}

              {/* Divider (Optional: Removed as Phone is no longer here) */}
              {/* <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div> */}

              {/* Navigation Links + Login (Grid Style) */}
              <div className="w-full space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => { handleNavigate(link.page); pushPathForPage(link.page); }}
                    className={`w-full text-left text-base font-semibold px-6 py-4 rounded-xl transition-all ${
                      currentPage === link.page
                        ? "bg-gradient-to-r from-indigo-500 to-rose-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                    style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
                  >
                    {link.name}
                  </button>
                ))}

                {/* Login Button - Grid ke andar hi */}
                {user ? (
                  <>
                    <button
                      onClick={() => { handleNavigate("admin-dashboard"); setMobileMenu(false); }}
                      className="w-full text-left text-base font-semibold text-indigo-600 px-6 py-4 rounded-xl hover:bg-indigo-50"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => { handleLogout(); setMobileMenu(false); }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : regularUser ? (
                  <>
                    <div className="w-full p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-center">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mb-2">
                        {regularUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-bold text-gray-800">{regularUser.name}</p>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setMobileMenu(false); }}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setAuthModalOpen(true); setMobileMenu(false); }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-rose-600 text-white font-bold py-5 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    <Sparkles size={24} />
                    Login / Sign Up
                    <Sparkles size={24} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default Navbar;