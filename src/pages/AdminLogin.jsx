import { useState, useContext } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo1.png";

const AdminLogin = ({ setCurrentPage }) => {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Attempting login with:", formData.email);
      const data = await login(formData.email, formData.password);

      console.log("📥 Login response:", data);

      if (data.success) {
        console.log("✅ Login successful! Token saved.");
        alert("Login successful!");
        setCurrentPage("admin-dashboard");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => handleNavigate("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={logo}
              alt="Hi-Tech Homes Logo"
              className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <button
            onClick={() => handleNavigate("home")}
            className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors hover:scale-105"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-600">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-rose-500/20"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-sm font-semibold">Admin Access</span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-2xl leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Admin <span className="text-rose-200">Dashboard</span>
          </h1>
          <p className="text-lg text-white/95 leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
            Secure access to manage properties, enquiries, and analytics
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-100 rounded-full blur-3xl opacity-40"></div>

        {/* Login Card */}
        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-indigo-100">
          {/* Left Side - Branding */}
          <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50 p-10 w-1/2 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-2xl opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-200 rounded-full blur-2xl opacity-30"></div>

            <div className="mb-6 transition-transform duration-500 hover:scale-105 relative z-10">
              <img
                src={logo}
                alt="Hi-Tech Homes Logo"
                className="h-32 w-auto object-contain drop-shadow-lg"
              />
            </div>
            <h1
              className="text-4xl font-extrabold text-gray-900 text-center leading-snug mb-4 relative z-10"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Hi-Tech{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent">
                Homes
              </span>
            </h1>
            <p
              className="text-gray-600 mt-4 text-center max-w-sm relative z-10 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Building dreams into reality — manage your listings, enquiries,
              and more from the admin dashboard.
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <h2
              className="text-3xl font-bold text-gray-900 text-center mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Welcome Back
            </h2>
            <p
              className="text-gray-500 text-center mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Sign in to continue to your dashboard
            </p>

            {error && (
              <div
                className="flex items-center gap-2 p-4 mb-6 text-rose-700 bg-rose-50 border-2 border-rose-200 rounded-xl text-sm font-semibold"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full pl-12 pr-4 py-4 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 focus:bg-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full pl-12 pr-12 py-4 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 focus:bg-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors hover:scale-110"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Remember Me + Forgot */}
              <div
                className="flex items-center justify-between text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="accent-indigo-600 w-4 h-4 rounded border-2 border-indigo-300 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-indigo-600 hover:text-rose-600 font-semibold transition-colors hover:scale-105"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-indigo-600 to-rose-500 hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </form>

            {/* Back to Home */}
            <div className="text-center mt-8">
              <button
                onClick={() => handleNavigate("home")}
                className="text-indigo-600 hover:text-rose-600 font-semibold text-sm transition-colors hover:scale-105 flex items-center justify-center gap-1 mx-auto"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 text-white py-12 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div
                onClick={() => handleNavigate("home")}
                className="flex items-center gap-2 mb-4 cursor-pointer group"
              >
                <img
                  src={logo}
                  alt="Hi-Tech Homes Logo"
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p
                className="text-gray-300 text-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Building dreams into reality with innovative real estate
                solutions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="font-bold mb-4 text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Quick Links
              </h3>
              <ul
                className="space-y-2 text-sm text-gray-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <li>
                  <button
                    onClick={() => handleNavigate("home")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("listings")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Properties
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("about")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("contact")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3
                className="font-bold mb-4 text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Services
              </h3>
              <ul
                className="space-y-2 text-sm text-gray-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <li>
                  <button
                    onClick={() => handleNavigate("listings")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Buy Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("listings")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Sell Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("listings")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Rent Property
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate("contact")}
                    className="hover:text-indigo-300 transition-colors hover:scale-105 transform origin-left"
                  >
                    Property Management
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="font-bold mb-4 text-white"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Contact Us
              </h3>
              <ul
                className="space-y-2 text-sm text-gray-300"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <li>+91-956000 2261</li>
                <li>Hitechhomesluxury@gmail.com</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-indigo-800 mt-8 pt-8 text-center text-sm text-gray-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <p>&copy; 2025 Hi-Tech Homes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLogin;
