import { Sparkles } from "lucide-react";

const Loader = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "16rem",
    padding: "2rem",
    gap: "1.5rem",
  };

  const spinnerStyle = {
    width: "4rem",
    height: "4rem",
    border: "4px solid rgba(99, 102, 241, 0.1)",
    borderTopColor: "#6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)",
  };

  const spinnerInnerStyle = {
    width: "3rem",
    height: "3rem",
    border: "3px solid rgba(244, 63, 94, 0.1)",
    borderTopColor: "#f43f5e",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite reverse",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 0 15px rgba(244, 63, 94, 0.2)",
  };

  const spinnerMiddleStyle = {
    width: "2rem",
    height: "2rem",
    border: "2px solid rgba(168, 85, 247, 0.1)",
    borderTopColor: "#a855f7",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 0 10px rgba(168, 85, 247, 0.2)",
  };

  const wrapperStyle = {
    position: "relative",
    width: "4rem",
    height: "4rem",
  };

  const textStyle = {
    fontFamily: "'Poppins', 'Inter', sans-serif",
    fontSize: "1rem",
    fontWeight: "600",
    background: "linear-gradient(to right, #6366f1, #a855f7, #f43f5e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    animation: "pulse 2s ease-in-out infinite",
  };

  const sparkleWrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const sparkleStyle = {
    animation: "sparkle 1.5s ease-in-out infinite",
    color: "#f59e0b",
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
        }
      `}</style>

      <div style={containerStyle}>
        <div style={wrapperStyle}>
          <div style={spinnerStyle}></div>
          <div style={spinnerMiddleStyle}></div>
          <div style={spinnerInnerStyle}></div>
        </div>
        <div style={sparkleWrapperStyle}>
          <Sparkles size={18} style={sparkleStyle} />
          <span style={textStyle}>Loading...</span>
          <Sparkles size={18} style={sparkleStyle} />
        </div>
      </div>
    </>
  );
};

export default Loader;
