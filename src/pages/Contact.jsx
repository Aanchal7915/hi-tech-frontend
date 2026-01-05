import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import logo from "../assets/logo1.png";

const Contact = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    // Consent validation
    if (!consent) {
      newErrors.consent = "You must agree to the Terms & Conditions and Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Your API call would go here
      // await api.post('/enquiries', formData);

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setConsent(false);
      setErrors({});
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    }
    setLoading(false);
  };

  const handleNavigate = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-12 md:py-20 relative overflow-hidden">
        {/* Background Blur Circles */}
        <div className="absolute top-0 left-0 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-rose-100 rounded-full blur-3xl opacity-40"></div>

        {/* Contact Container */}
        <div className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* LEFT SECTION */}
          <div className="flex flex-col justify-center items-start bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 w-full md:w-1/2 gap-4">
            <img
              src={logo}
              alt="Hi-Tech Homes Logo"
              className="h-20 md:h-24 w-auto object-contain drop-shadow-lg mb-2 self-center"
            />

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center w-full">
              Contact & Support
            </h1>

            {/* PHONE CARD */}
            <div className="w-full bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Phone size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                    Sales & Support Team
                  </h3>
                  <a 
                    href="tel:+919560002261" 
                    className="text-sm text-gray-700 hover:text-indigo-600 transition-colors block"
                  >
                    +91-956000 2261
                  </a>
                  <a 
                    href="tel:+918929028000" 
                    className="text-sm text-gray-700 hover:text-indigo-600 transition-colors block"
                  >
                    +91-89290 28000
                  </a>
                </div>
              </div>
            </div>

            {/* EMAIL CARD */}
            <div className="w-full bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Mail size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                    Email To Our Team
                  </h3>
                  <a 
                    href="mailto:Hitechhomesluxury@gmail.com" 
                    className="text-sm text-gray-700 hover:text-indigo-600 transition-colors block"
                  >
                    Hitechhomesluxury@gmail.com
                  </a>
                  {/* <a 
                    href="mailto:mrinal@anukulindia.com" 
                    className="text-sm text-gray-700 hover:text-indigo-600 transition-colors block"
                  >
                    mrinal@anukulindia.com
                  </a> */}
                </div>
              </div>
            </div>

            {/* ADDRESS CARD */}
            <div className="w-full bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MapPin size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                    Find Us Directly At
                  </h3>
                  <p className="text-sm text-gray-700">
                  8101 FF BOUGAINVILLEA LANE DLF PHASE 4, Gurugram, Haryana 122009
                  </p>
                </div>
              </div>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-2 self-center mt-2">
              <a
                href="https://www.facebook.com/100064200993187"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <Facebook size={18} />
              </a>

              <a
                href="https://www.instagram.com/hitechhomesluxury?igsh=MWljd21xOTZ1aHkwcA=="
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <Instagram size={18} />
              </a>

              <a
                href="https://www.linkedin.com/company/hitech-homesgurgaon/"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-gray-300 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* RIGHT SECTION - FORM */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-1">
              Contact Us
            </h2>
            <p className="text-xs md:text-sm text-gray-500 text-center mb-5">
              Fill out the form and we'll get back to you shortly
            </p>

            {submitted && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium">
                ✅ Message sent successfully!
              </div>
            )}

            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm resize-none ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              {/* CONSENT CHECKBOX WITH TERMS & PRIVACY POLICY LINKS */}
              <div className={`flex items-start gap-2 mt-4 p-3 rounded-lg border ${errors.consent ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0 cursor-pointer"
                />
                <label
                  htmlFor="consent"
                  className="text-xs text-gray-700 leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => handleNavigate("terms-conditions")}
                    className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => handleNavigate("privacy-policy")}
                    className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                  >
                    Privacy Policy
                  </button>
                  . You may contact me via Email, WhatsApp, SMS, RCS, or Call.
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-500 text-xs mt-1">{errors.consent}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all duration-300 ${
                  loading
                    ? "bg-indigo-400 cursor-not-allowed opacity-80"
                    : "bg-gradient-to-r from-indigo-600 to-rose-500 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;