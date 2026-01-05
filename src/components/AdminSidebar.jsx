import { useState, useContext, useEffect } from "react";
import { EnquiryContext } from "../context/EnquiryContext";
// Update the import line (around line 2-8) to include Mail:
import {
  Building2,
  TrendingUp,
  Plus,
  Home,
  LogOut,
  Menu,
  X,
  Mail,
  BarChart3,
  Layout,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const AdminSidebar = ({ currentPage, setCurrentPage }) => {
  const { logout } = useContext(AuthContext);

  // ✅ Sidebar open/closed state
  const [isOpen, setIsOpen] = useState(false);
  const { pendingCount } = useContext(EnquiryContext);

  const menuItems = [
    { name: "Dashboard", page: "admin-dashboard", icon: TrendingUp },
    {
      name: "Enquiries",
      page: "admin-enquiries",
      icon: Mail,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      name: "Landing Enquiries",
      page: "admin-project-enquiries",
      icon: Layout
    },
    { name: "Analytics", page: "admin-analytics", icon: BarChart3 }, // ADD THIS LINE
    { name: "Add Property", page: "add-property", icon: Plus },
    { name: "View Site", page: "home", icon: Home },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Close sidebar when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);


  return (
    <>
      {/* ===== HAMBURGER MENU BUTTON (Always Visible) ===== */}
      <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "1.5rem",
          left: "1.5rem",
          zIndex: 0,
          background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
          border: "none",
          borderRadius: "12px",
          padding: "0.75rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
        }}
      >
        <Menu style={{ width: "1.5rem", height: "1.5rem", color: "white" }} />
      </button>

      {/* ===== OVERLAY (Fades Dashboard when sidebar is open) ===== */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1998,
            animation: "fadeIn 0.3s ease",
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          width: "280px",
          background: "white",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1999,
          boxShadow: "4px 0 20px rgba(0, 0, 0, 0.15)",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* ===== HEADER ===== */}
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "800",
                  fontSize: "1.25rem",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                }}
              >
                A
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#1f2937",
                  }}
                >
                  Admin
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Dashboard
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={toggleSidebar}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#4b5563",
                padding: "0.5rem",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
              title="Close Sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Admin Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              borderRadius: "9999px",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "#10b981",
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite",
              }}
            ></div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: "700",
                color: "white",
                letterSpacing: "0.025em",
              }}
            >
              ADMIN ACCESS
            </span>
          </div>
        </div>

        {/* ===== NAVIGATION ===== */}
        <nav
          style={{
            flex: 1,
            padding: "1rem 0",
            overflowY: "auto",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page);
                  setIsOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  justifyContent: "space-between",
                  padding: "1rem 1.5rem",
                  color: isActive ? "#2563eb" : "#4b5563",
                  fontWeight: 600,
                  background: isActive
                    ? "linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%)"
                    : "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderLeft: isActive
                    ? "4px solid #2563eb"
                    : "4px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#f9fafb";
                    e.currentTarget.style.color = "#2563eb";
                    e.currentTarget.style.paddingLeft = "1.75rem";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#4b5563";
                    e.currentTarget.style.paddingLeft = "1.5rem";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Icon
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      flexShrink: 0,
                    }}
                  />
                  {item.name}
                </div>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "9999px",
                      minWidth: "1.5rem",
                      textAlign: "center",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ===== FOOTER ===== */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
        >
          <button
            onClick={() => { logout(); setCurrentPage("home"); }}
            title="Logout"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "1rem",
              padding: "0.875rem 1.5rem",
              color: "#dc2626",
              fontWeight: 600,
              background: "transparent",
              border: "2px solid transparent",
              borderRadius: "12px",
              width: "100%",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fef2f2";
              e.currentTarget.style.color = "#991b1b";
              e.currentTarget.style.borderColor = "#fecaca";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#dc2626";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <LogOut
              style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0 }}
            />
            Logout
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>
    </>
  );
};

export default AdminSidebar;
