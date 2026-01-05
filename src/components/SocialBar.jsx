import React, { useState } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const SocialBar = () => {
  const [activeLink, setActiveLink] = useState(null); // मोबाइल क्लिक स्टेट

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "#1DA1F2", label: "Follow us on Twitter" },
    { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/100064200993187", color: "#1877F2", label: "Like us on Facebook" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/hitechhomesluxury?igsh=MWljd21xOTZ1aHkwcA==", color: "#C13584", label: "Follow us on Instagram" },
    // 'Subscribe' की जगह 'Connect' ज़्यादा सही है LinkedIn के लिए
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/hitech-homesgurgaon/", color: "#0A66C2", label: "Connect on LinkedIn" }, 
    { name: "YouTube", icon: Youtube, href: "https://m.youtube.com/@hitech_homes", color: "#FF0000", label: "Subscribe on YouTube" },
  ];

  const handleLinkClick = (e, link) => {
    // मोबाइल/टच डिवाइस पर पहले क्लिक पर लेबल दिखाओ, दूसरे क्लिक पर रीडायरेक्ट करो
    if (activeLink === link.name) {
      setActiveLink(null); // रीडायरेक्ट होने दो
    } else {
      e.preventDefault(); 
      setActiveLink(link.name);
    }
  };

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
      <div className="flex flex-col gap-3 md:gap-4">
        {socialLinks.map((link) => {
          const Icon = link.icon;
          const isHovered = activeLink === link.name;
          
          return (
            <div 
              key={link.name} 
              className="relative group flex items-center justify-end"
            >
              {/* Hover Label (Pill Shape) */}
              <div className="flex items-center overflow-hidden">
                <span
                  style={{ 
                    backgroundColor: "white", 
                    color: link.color,
                  }}
                  // 🚨 mr-[-2] (8px negative margin) जोड़ा गया है ताकि यह आइकन पर ओवरलैप हो
                  className={`py-2 px-3.5 text-sm whitespace-nowrap transition-all duration-500 ease-out 
                    rounded-full shadow-lg mr-[-2] // 👈 चिपकाने के लिए नेगेटिव मार्जिन
                    
                    ${isHovered 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-full opacity-0'
                    } 
                    md:group-hover:translate-x-0 md:group-hover:opacity-100
                  `}
                >
                  {link.label}
                </span>
              </div>

              {/* Icon Button (Fully Round) */}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                style={{ backgroundColor: link.color }} 
                onClick={(e) => handleLinkClick(e, link)}
                // 🚨 translate-x-3 (12px) पर सेट किया गया है ताकि ओवरलैप के बाद भी आइकन सही से खिसक जाए
                className={`p-3 md:p-3 rounded-full shadow-lg transition-all duration-500 ease-out block hover:shadow-2xl relative z-10 
                    ${isHovered ? '-translate-x-3' : ''} 
                    md:group-hover:-translate-x-3`} // 👈 बढ़ी हुई ट्रांसलेशन
              >
                <Icon size={18} className="w-4 h-4 md:w-5 md:h-5 text-white transition-transform duration-500 group-hover:scale-110" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialBar;