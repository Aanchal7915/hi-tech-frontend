import React, { useEffect, useState } from "react";
import { MessageCircle, ArrowLeft, CheckCircle } from "lucide-react";

const ThankYou = ({ setCurrentPage }) => {
    const [countdown, setCountdown] = useState(10);
    const whatsappNumber = "+919560002261"; // Using the 10-digit number from the project landing for consistency

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCurrentPage("project");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [setCurrentPage]);

    const handleWhatsAppClick = () => {
        const message = "Hi, I just submitted an enquiry on your landing page. I would like to know more.";
        const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen bg-[#1c1915] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#dfae75]/5 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#dfae75]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-[#242b2e]/50 backdrop-blur-xl border border-[#dfae75]/20 p-8 md:p-12 rounded-3xl shadow-2xl text-center">
                {/* Logo Area */}
                <div className="mb-8">
                    <img
                        src="/logo-img.png"
                        alt="Hi-Tech Properties"
                        className="h-16 md:h-20 mx-auto drop-shadow-lg"
                    />
                </div>

                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 animate-pulse">
                        <CheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wider uppercase">
                    Thank <span className="text-[#dfae75]">You!</span>
                </h1>

                <p className="text-gray-300 text-lg md:text-xl mb-8 font-light italic">
                    "Your interest in Shapoorji Pallonji Dualis is appreciated. Our executive will reach out to you shortly."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                    <button
                        onClick={handleWhatsAppClick}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                    >
                        <MessageCircle className="w-6 h-6" />
                        CHAT ON WHATSAPP
                    </button>

                    <button
                        onClick={() => setCurrentPage("project")}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 border border-[#dfae75] text-[#dfae75] hover:bg-[#dfae75] hover:text-black font-bold py-4 px-8 rounded-full transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        BACK TO HOME
                    </button>
                </div>

                <div className="pt-8 border-t border-[#dfae75]/10">
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                        Redirecting in <span className="text-[#dfae75] font-bold">{countdown}</span> seconds
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
