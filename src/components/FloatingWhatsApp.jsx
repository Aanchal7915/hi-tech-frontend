import { useState } from "react";

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  // read number from env or fallback
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "++919560002261";
  const message = encodeURIComponent(
    "Hi, I found you on Hi-Tech Homes and would like to enquire about a property."
  );
  const url = `https://wa.me/${phone.replace(/\D/g, "")}?text=${message}`;

  return (
    <>
      {/* Optional floating panel (not used now) */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "95px",
            width: "320px",
            maxWidth: "90vw",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
            zIndex: 99999,
            overflow: "hidden",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>WhatsApp</strong>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18 }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <a href={url} target="_blank" rel="noreferrer" style={{ color: "#0b8457", fontWeight: 600 }}>
              Start WhatsApp chat →
            </a>
          </div>
        </div>
      )}

      {/* Floating WhatsApp button (positioned above AI chat, with float animation) */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="floating-whatsapp"
        aria-label="Chat on WhatsApp"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          zIndex: 200000,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#25D366",
          color: "white",
          boxShadow: "0 8px 26px rgba(37,211,102,0.25)",
          textDecoration: "none",
          transform: "translateY(0)",
        }}
      >
        {/* SVG WhatsApp icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.93 11.93 0 0 0 12 0C5.373 0 .122 5.25.002 11.88a11.99 11.99 0 0 0 2.05 6.12L0 24l5.16-1.35a11.93 11.93 0 0 0 6.84 2.05c6.627 0 11.878-5.25 11.998-11.88a11.93 11.93 0 0 0-3.48-8.32zM12 21.5a9.44 9.44 0 0 1-5.13-1.4l-.37-.23L4 20l.1-2.5-.23-.37A9.44 9.44 0 1 1 21.5 12 9.44 9.44 0 0 1 12 21.5z" />
          <path d="M17.2 14.1c-.3-.15-1.77-.88-2.04-.98-.27-.08-.47-.12-.67.12-.2.24-.76.98-.93 1.18-.17.2-.34.25-.63.08-.3-.17-1.26-.46-2.4-1.48-.89-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.47.1-.17.05-.33-.03-.48-.08-.15-.67-1.62-.92-2.23-.24-.58-.49-.5-.67-.51-.17 0-.37-.01-.57-.01s-.48.07-.73.33c-.25.27-.96.94-.96 2.28 0 1.34.98 2.64 1.12 2.83.15.2 1.94 3.03 4.7 4.25 2.76 1.22 2.76.81 3.26.76.5-.05 1.63-.66 1.86-1.3.23-.64.23-1.19.16-1.3-.07-.12-.26-.17-.57-.31z" />
        </svg>
      </a>
    </>
  );
}
