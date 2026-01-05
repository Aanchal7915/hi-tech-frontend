import { Target, Eye, Award, Heart, Home, Sparkles } from "lucide-react";

const About = ({ setCurrentPage }) => {
  return (
    <div
      className="bg-gradient-to-b from-indigo-50 via-white to-purple-50"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Hero Section with Background Image and Gradient */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.5) saturate(1.1)",
          }}
        ></div>

        {/* Gradient Overlay - Indigo to Rose */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/25 to-rose-500/30"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
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

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-sm font-semibold">Our Story</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-2xl leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            About <span className="text-rose-200">Hi-Tech Homes</span>
          </h1>
          <p className="text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-lg max-w-3xl mx-auto">
            Turning Transactions into Relationships — Building trust and
            creating lasting partnerships in real estate.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Mission */}
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Target size={32} />
              </div>
              <h2
                className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Our Mission
              </h2>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                To revolutionize the real estate industry by providing
                exceptional service, cutting-edge technology, and personalized
                attention to every client. We believe that buying or selling a
                property is not just a transaction—it's a life-changing decision
                that deserves expert guidance and care.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Mission"
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-200 rounded-full opacity-30 blur-2xl"></div>
            </div>
          </div>

          {/* Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
                alt="Vision"
                className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-rose-200 rounded-full opacity-30 blur-2xl"></div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                <Eye size={32} />
              </div>
              <h2
                className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Our Vision
              </h2>
              <p className="text-base text-gray-700 leading-relaxed mb-6">
                To be the most trusted and innovative real estate company, known
                for turning transactions into lasting relationships. We envision
                a future where finding your dream home is seamless, transparent,
                and exciting, powered by technology and driven by genuine care
                for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-0 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-indigo-100 px-4 py-2 rounded-full mb-3">
              <Heart size={16} className="text-rose-600" />
              <span className="text-sm font-bold text-rose-700">
                Core Values
              </span>
            </div>
            <h2
              className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-rose-600 to-indigo-600 bg-clip-text text-transparent"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Our Core Values
            </h2>
            <p className="text-base text-gray-600">What drives us every day</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Trust",
                desc: "Building lasting relationships through transparency and honesty",
                img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400",
                icon: <Heart size={24} />,
                gradient: "from-indigo-500 to-indigo-600",
              },
              {
                title: "Excellence",
                desc: "Delivering outstanding service and exceeding expectations",
                img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400",
                icon: <Award size={24} />,
                gradient: "from-rose-500 to-rose-600",
              },
              {
                title: "Innovation",
                desc: "Embracing technology to simplify the real estate experience",
                img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
                icon: <Home size={24} />,
                gradient: "from-indigo-600 to-rose-500",
              },
            ].map((value, idx) => (
              <div key={idx} className="text-center group">
                <div className="relative inline-block mb-6">
                  <img
                    src={value.img}
                    alt={value.title}
                    className="rounded-full w-48 h-48 object-cover mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300 border-4 border-indigo-100"
                  />
                  <div
                    className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${value.gradient} transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                  </div>
                </div>
                <h3
                  className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {value.title}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-600 text-white relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-rose-500/20"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <Sparkles size={16} className="text-yellow-300" />
            <span className="text-sm font-bold">Get Started</span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-extrabold mb-4"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 text-white/95 leading-relaxed">
            Let us help you find your dream property today.
          </p>
          <button
            onClick={() => setCurrentPage && setCurrentPage("contact")}
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300"
          >
            Contact Us Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
