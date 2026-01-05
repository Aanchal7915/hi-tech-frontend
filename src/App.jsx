import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { PropertyProvider } from "./context/PropertyContext";
import { EnquiryProvider } from "./context/EnquiryContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import PropertyDetails from "./pages/PropertyDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminProjectEnquiries from "./pages/AdminProjectEnquiries";
import ThankYou from "./pages/ThankYou";
import ChatBot from "./components/ChatBot";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import SocialBar from "./components/SocialBar";
import TimedWhatsAppPopup from "./components/TimedWhatsAppPopup";
import { UserAuthProvider } from "./context/UserAuthContext";
import "./styles/index.css";
import AdminAnalytics from "./pages/AdminAnalytics";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import ProjectLanding from "./pages/ProjectLanding";
import { useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProperty={setSelectedProperty}
          />
        );
      case "listings":
        return (
          <Listings
            setCurrentPage={setCurrentPage}
            setSelectedProperty={setSelectedProperty}
          />
        );
      case "property-details":
        return (
          <PropertyDetails
            property={selectedProperty}
            setCurrentPage={setCurrentPage}
          />
        );
      case "admin-analytics":
        return (
          <AdminAnalytics
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        );
      case "about":
        return <About setCurrentPage={setCurrentPage} />;
      case "contact":
        return <Contact setCurrentPage={setCurrentPage} />;
      case "privacy-policy":
        return <PrivacyPolicy setCurrentPage={setCurrentPage} />;
      case "terms-conditions":
        return <TermsConditions setCurrentPage={setCurrentPage} />;
      case "admin-login":
        return <AdminLogin setCurrentPage={setCurrentPage} />;
      case "admin-dashboard":
        return (
          <AdminDashboard
            setCurrentPage={setCurrentPage}
            selectedPropertyId={selectedPropertyId}
            setSelectedPropertyId={setSelectedPropertyId}
          />
        );
      case "add-property":
        return <AddProperty setCurrentPage={setCurrentPage} />;
      case "edit-property":
        return (
          <EditProperty
            setCurrentPage={setCurrentPage}
            propertyId={selectedPropertyId}
          />
        );
      case "admin-enquiries":
        return <AdminEnquiries setCurrentPage={setCurrentPage} />;
      case "admin-project-enquiries":
        return <AdminProjectEnquiries setCurrentPage={setCurrentPage} />;
      case "project":
        return <ProjectLanding setCurrentPage={setCurrentPage} />;
      case "thank-you":
        return <ThankYou setCurrentPage={setCurrentPage} />;
      default:
        return (
          <Home
            setCurrentPage={setCurrentPage}
            setSelectedProperty={setSelectedProperty}
          />
        );
    }
  };


  // sync currentPage with URL path so direct links like /privacy-policy work
  useEffect(() => {
    const pathToPage = (path) => {
      // Remove any hash prefix if present (for backward compatibility)
      if (path.startsWith("#")) path = path.slice(1);
      if (!path || path === "/") return "home";
      if (path.startsWith("/property/")) return "property-details";
      switch (path) {
        case "/listings":
          return "listings";
        case "/about":
          return "about";
        case "/contact":
          return "contact";
        case "/privacy-policy":
          return "privacy-policy";
        case "/terms-conditions":
          return "terms-conditions";
        case "/project":
          return "project";
        default:
          return "home";
      }
    };

    // Set initial page based on pathname
    const initialPath = window.location.pathname;
    setCurrentPage((prev) => {
      const mapped = pathToPage(initialPath);
      return prev === mapped ? prev : mapped;
    });

    // Handle browser back/forward buttons
    const onPopState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [setCurrentPage]);

  const showNavbar = ![
    "admin-login",
    "admin-dashboard",
    "add-property",
    "edit-property",
    "admin-enquiries",
    "admin-project-enquiries",
    "project",
    "thank-you",
  ].includes(currentPage);
  const showFooter = ![
    "admin-login",
    "admin-dashboard",
    "add-property",
    "edit-property",
    "admin-enquiries",
    "admin-project-enquiries",
    "project",
    "thank-you",
  ].includes(currentPage);

  return (
    <AuthProvider>
      <UserAuthProvider>
        <PropertyProvider>
          <EnquiryProvider>
            <div className="min-h-screen bg-gray-50">
              {showNavbar && (
                <Navbar
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
              {/* Site-wide right-side social icons */}
              {currentPage !== "project" && <SocialBar />}
              <ErrorBoundary>
                {renderPage()}
              </ErrorBoundary>
              {showFooter && <Footer setCurrentPage={setCurrentPage} />}
              <ChatBot />
              <FloatingWhatsApp />
              {currentPage !== "project" && <TimedWhatsAppPopup />}
            </div>
          </EnquiryProvider>
        </PropertyProvider>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
