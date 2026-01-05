import { useState, useRef, useEffect } from "react";
import api from "../utils/api";
import "../styles/ChatBot.css";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! 👋 I'm your Hi-Tech Homes assistant. I can help you:\n\n🏠 Find properties by BHK, budget, or location\n💰 Check pricing and availability\n📍 Get area information\n📞 Connect with our team\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/chatbot/message", {
        message: userInput,
        conversationHistory: messages.slice(-6),
      });

      const botMessage = {
        type: "bot",
        text: response.data.reply,
        properties: response.data.properties || null,
        suggestions: response.data.suggestions || null,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      // Fallback intelligent responses when backend fails
      const fallbackResponse = getFallbackResponse(userInput.toLowerCase());

      const errorMessage = {
        type: "bot",
        text: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fallback intelligent responses when backend is unavailable
  const getFallbackResponse = (input) => {
    // Property search queries
    if (input.includes("2 bhk") || input.includes("2bhk")) {
      return "I can help you find 2 BHK properties! Currently, we have several options available. Please visit our Listings page or contact us at +91-956000 2261 for detailed information about available 2 BHK properties.";
    }
    if (input.includes("3 bhk") || input.includes("3bhk")) {
      return "We have excellent 3 BHK properties! Check out our Listings page or call us at +91-956000 2261 to discuss your requirements.";
    }

    // Budget queries
    if (
      input.includes("price") ||
      input.includes("budget") ||
      input.includes("cost") ||
      input.includes("lakh") ||
      input.includes("crore")
    ) {
      return "Our properties range from affordable to premium segments. For specific pricing and budget options, please:\n\n📱 Call: +91-956000 2261\n📧 Email: Hitechhomesluxury@gmail.com\n🌐 Visit our Listings page\n\nOur team will help you find properties within your budget!";
    }

    // Location queries
    if (
      input.includes("location") ||
      input.includes("area") ||
      input.includes("where") ||
      input.includes("city")
    ) {
      return "We have properties across prime locations! To explore properties in specific areas, please:\n\n✅ Check our Listings page\n✅ Contact us: +91-956000 2261\n✅ Visit our office\n\nOur team can show you properties in your preferred locations.";
    }

    // Contact queries
    if (
      input.includes("contact") ||
      input.includes("call") ||
      input.includes("phone") ||
      input.includes("email")
    ) {
      return "📞 Contact Hi-Tech Homes:\n\n• Phone: +91-956000 2261\n• Email: Hitechhomesluxury@gmail.com\n• Address: Mumbai, India\n\nYou can also fill out the contact form on our Contact page, and we'll reach out to you shortly!";
    }

    // Amenities
    if (
      input.includes("amenity") ||
      input.includes("amenities") ||
      input.includes("facilities") ||
      input.includes("features")
    ) {
      return "Our properties come with premium amenities:\n\n✨ Modern design & architecture\n🏊 Swimming pools & gym\n🌳 Landscaped gardens\n🔒 24/7 security\n🚗 Ample parking\n⚡ Power backup\n\nFor specific property amenities, check our Listings page or contact us!";
    }

    // Visit/schedule
    if (
      input.includes("visit") ||
      input.includes("schedule") ||
      input.includes("viewing") ||
      input.includes("see property")
    ) {
      return "I'd be happy to help you schedule a property visit! 🏠\n\nPlease contact us to arrange a viewing:\n📱 Call: +91-956000 2261\n📧 Email: Hitechhomesluxury@gmail.com\n\nOr fill out the enquiry form on our Contact page, and our team will reach out to schedule a convenient time for you!";
    }

    // About company
    if (
      input.includes("about") ||
      input.includes("who are you") ||
      input.includes("company")
    ) {
      return "Hi-Tech Homes is your trusted real estate partner! 🏡\n\nWe specialize in:\n✅ Premium residential properties\n✅ Expert property consultation\n✅ Transparent dealings\n✅ Customer satisfaction\n\nVisit our About page to learn more about us, or contact us at +91-956000 2261!";
    }

    // Greetings
    if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! 👋 How can I assist you today? I can help you find properties, answer questions about pricing, or connect you with our team!";
    }

    // Thanks
    if (input.includes("thank") || input.includes("thanks")) {
      return "You're welcome! 😊 If you have any more questions, feel free to ask. Happy house hunting! 🏠";
    }

    // Default fallback
    return "I'm here to help! For detailed information about our properties, pricing, and availability, please:\n\n📱 Call us: +91-956000 2261\n📧 Email: Hitechhomesluxury@gmail.com\n🌐 Visit our Listings page\n\nOur team is ready to assist you with all your property needs!";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Show me 2 BHK properties",
    "Properties under 50 lakh",
    "What amenities are available?",
    "Schedule a property visit",
    "Contact information",
    "About Hi-Tech Homes",
  ];

  const handleQuickAction = (action) => {
    setInput(action);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="flex items-center gap-3">
              <div className="chatbot-avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
              </div>
              <div>
                <h3 className="chatbot-title">Hi-Tech Homes Assistant</h3>
                <p className="chatbot-subtitle">Online • Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close"
              aria-label="Close chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.type}`}>
                <div className="message-content">
                  <p style={{ whiteSpace: "pre-line" }}>{message.text}</p>

                  {/* Property Cards if available */}
                  {message.properties && message.properties.length > 0 && (
                    <div className="property-cards">
                      {message.properties.map((property) => (
                        <div key={property._id} className="property-card">
                          <img
                            src={property.images[0]?.url || "/placeholder.jpg"}
                            alt={property.title}
                          />
                          <div className="property-info">
                            <h4>{property.title}</h4>
                            <p className="property-price">
                              ₹{property.price.toLocaleString()}
                            </p>
                            <p className="property-details">
                              {property.bhk} BHK • {property.bathrooms} Bath •{" "}
                              {property.city}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions if available */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="message-suggestions">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="suggestion-btn"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="quick-actions">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="quick-action-btn"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about properties, prices, locations..."
              className="chatbot-input"
              rows="1"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="chatbot-send-btn"
              aria-label="Send message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
