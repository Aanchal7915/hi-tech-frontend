import { useEffect, useState, useRef } from "react";

export default function TimedWhatsAppPopup({ phone = "+919560002261" }) {
  const [visible, setVisible] = useState(false);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    // Show first popup immediately on mount
    setVisible(true);
    try { nameRef.current?.focus(); } catch (e) {}

    // Then show every 2 minutes (120000 ms)
    const interval = setInterval(() => {
      setVisible(true);
      try { nameRef.current?.focus(); } catch (e) {}
    }, 120000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => setVisible(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = (nameRef.current?.value || "").trim();
    const userPhone = (phoneRef.current?.value || "").trim();
    const msg = (messageRef.current?.value || "").trim();

    const finalText = `Name: ${name}\nPhone: ${userPhone}\nMessage: ${msg}`;
    const cleaned = phone.replace(/\D/g, "");
    const url = `https://wa.me/${cleaned}?text=${encodeURIComponent(finalText)}`;

    // Redirect to WhatsApp in a new tab/window
    window.open(url, "_blank");

    // Optionally hide the popup after redirect
    setVisible(false);
  };

  if (!visible) return null;

  const PopupContent = (
    <div className="max-w-lg w-full pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">WA</div> */}
            <div>
              <div className="text-sm font-bold text-gray-900">Send a Request</div>
              <div className="text-xs text-gray-500">Connect with Our Advisor</div>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close popup"
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-600">Name</label>
            <input ref={nameRef} required type="text" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Your name" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Phone</label>
            <input ref={phoneRef} required type="tel" className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="Mobile number" />
          </div>

          <div>
            <label className="text-xs text-gray-600">Message</label>
            <textarea ref={messageRef} rows={3} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" placeholder="How can we help?" />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">Send</button>
            <button type="button" onClick={handleClose} className="text-sm text-gray-500">Close</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: centered */}
      <div className="fixed inset-0 z-[200000] flex items-center justify-center px-4 pointer-events-none sm:hidden">
        {PopupContent}
      </div>

      {/* Desktop / tablet: bottom center */}
      <div className="hidden sm:flex fixed left-0 right-0 bottom-32 z-[200000] justify-center px-4 pointer-events-none">
        {PopupContent}
      </div>
    </>
  );
}
