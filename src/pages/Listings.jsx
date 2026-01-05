import { useContext, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { PropertyContext } from "../context/PropertyContext";
import Loader from "../components/Loader";
import api from "../utils/api";

const Listings = ({ setCurrentPage, setSelectedProperty }) => {
  const {
    filteredProperties = [],
    loading,
    error,
    fetchProperties,
  } = useContext(PropertyContext);

  const [animateCards, setAnimateCards] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "",
    priceRange: "",
    bhk: "",
    curated: "",
    featuredLocation: "",
    featuredOnly: false,
  });

  const [curatedOptions, setCuratedOptions] = useState([]);
  const [featuredLocationOptions, setFeaturedLocationOptions] = useState([]);

  useEffect(() => {
    fetchProperties();
    setTimeout(() => setAnimateCards(true), 200);
    // Apply any initial listing filter set by Home (localStorage handshake)
    try {
      const raw = localStorage.getItem("listingsFilter");
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj?.type === "curated" && obj.title) {
          setFilters((prev) => ({ ...prev, curated: obj.title }));
        } else if (obj?.type === "featured" && obj.title) {
          setFilters((prev) => ({ ...prev, featuredLocation: obj.title }));
        }
        // remove handshake after applying; keep filters panel closed
        localStorage.removeItem("listingsFilter");
      }
    } catch (e) {
      console.error("Failed to apply listingsFilter:", e);
    }
    // fetch curated and featured location options
    const fetchOptions = async () => {
      try {
        const curatedRes = await api.get('/properties/curated/titles');
        if (curatedRes.data?.success) setCuratedOptions(curatedRes.data.data || []);
      } catch (err) {
        console.error('Failed to fetch curated options', err);
        setCuratedOptions([]);
      }

      try {
        const featuredRes = await api.get('/properties/locations/featured');
        if (featuredRes.data?.success) {
          const manual = featuredRes.data.data?.manual || [];
          setFeaturedLocationOptions(manual || []);
        }
      } catch (err) {
        console.error('Failed to fetch featured location options', err);
        setFeaturedLocationOptions([]);
      }
    };

    fetchOptions();
  }, []);

  // ✅ ANALYTICS: Track filter changes
  useEffect(() => {
    const trackFilters = async () => {
      if (filters.location || filters.priceRange || filters.bhk) {
        try {
          let sessionId = localStorage.getItem("sessionId");
          if (!sessionId) {
            sessionId =
              Date.now().toString() + Math.random().toString(36).substring(2);
            localStorage.setItem("sessionId", sessionId);
          }

          const priceMax = filters.priceRange
            ? parseInt(filters.priceRange.split("-")[1]) || null
            : null;

          await api.post("/analytics/filter", {
            city: filters.location || null,
            priceRange: priceMax ? { max: priceMax } : null,
            bhk: filters.bhk ? parseInt(filters.bhk) : null,
            sessionId: sessionId,
          });
        } catch (error) {
          console.error("Analytics filter tracking error:", error);
        }
      }
    };

    // Debounce the tracking to avoid too many requests
    const timeoutId = setTimeout(trackFilters, 500);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  // ✅ ANALYTICS: Track property click
  const handlePropertyClick = async (property) => {
    try {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId =
          Date.now().toString() + Math.random().toString(36).substring(2);
        localStorage.setItem("sessionId", sessionId);
      }

      await api.post("/analytics/click", {
        propertyId: property._id,
        sessionId: sessionId,
      });
    } catch (error) {
      console.error("Analytics click tracking error:", error);
    }

    // Navigate to property details
    setSelectedProperty(property);
    setCurrentPage("property-details");
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) {}
  };

  // Get unique cities from properties
  const uniqueCities = [
    ...new Set(filteredProperties.map((p) => p.city)),
  ].filter(Boolean);

  // Filter properties based on search and filters
  const getFilteredProperties = () => {
    let result = filteredProperties;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (property) =>
          property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      result = result.filter(
        (property) =>
          property.city?.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Curated filter (manual curated titles)
    if (filters.curated) {
      const wanted = String(filters.curated || "").toLowerCase().trim();
      result = result.filter((property) =>
        String(property.curatedProperty?.title || "").toLowerCase().trim() === wanted
      );
    }

    // Featured location filter (manual featuredLocation.title)
    if (filters.featuredLocation) {
      const wantedF = String(filters.featuredLocation || "").toLowerCase().trim();
      result = result.filter((property) => {
        const ft = String(property.featuredLocation?.title || "").toLowerCase().trim();
        const city = String(property.city || "").toLowerCase().trim();
        return ft === wantedF || city === wantedF;
      });
    }

    // Featured-only toggle
    if (filters.featuredOnly) {
      result = result.filter((property) => property.featured === true);
    }

    // Property type filter
    if (filters.propertyType) {
      result = result.filter(
        (property) =>
          property.type?.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((property) => {
        const price = property.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // BHK filter
    if (filters.bhk) {
      result = result.filter(
        (property) => property.bhk?.toString() === filters.bhk
      );
    }

    return result;
  };

  const displayedProperties = getFilteredProperties();

  const clearFilters = () => {
    setFilters({
      location: "",
      propertyType: "",
      priceRange: "",
      bhk: "",
      curated: "",
      featuredLocation: "",
      featuredOnly: false,
    });
    setSearchQuery("");
  };

  const activeFilterCount = [
    filters.location,
    filters.propertyType,
    filters.priceRange,
    filters.bhk,
    filters.curated,
    filters.featuredLocation,
    filters.featuredOnly ? 'featured' : '',
    searchQuery,
  ].filter(Boolean).length;

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md border-2 border-rose-200">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home size={32} className="text-white" />
          </div>
          <h2
            className="text-2xl font-bold text-rose-600 mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Error Loading Properties
          </h2>
          <p
            className="text-gray-600 mb-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {error}
          </p>
          <button
            onClick={fetchProperties}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-b from-indigo-50 via-white to-purple-50 min-h-screen listings-compact"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* ===== HEADER ===== */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        {/* Background Image Slideshow */}
        {[
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920",
        ].map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              idx === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.5) saturate(1.1)",
            }}
          ></div>
        ))}

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

        <div className="relative z-10 max-w-7xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <Sparkles size={18} className="text-yellow-300" />
            <span
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Premium Collection
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 drop-shadow-2xl leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Discover Your <span className="text-rose-200">Dream Property</span>
          </h1>
          <p
            className="text-lg text-white/95 mb-6 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Browse through our exclusive collection of premium homes that
            redefine luxury living
          </p>
          <div
            className="flex justify-center gap-2 text-white/90 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span
              onClick={() => setCurrentPage("home")}
              className="cursor-pointer hover:text-white transition-colors font-semibold hover:underline"
            >
              Home
            </span>
            <span>/</span>
            <span className="font-semibold">All Properties</span>
          </div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[250px] max-w-[500px]">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-indigo-200 rounded-xl text-sm bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400"
                size={18}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 border-2 border-indigo-200 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700 font-semibold text-sm hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-400 transition-all relative group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <SlidersHorizontal size={18} className="text-indigo-600" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Dropdown */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-2xl border-2 border-indigo-200 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-bold text-gray-900"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Filter Properties
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <X
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Location Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Locations</option>
                    {uniqueCities.map((city, idx) => (
                      <option key={idx} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) =>
                      setFilters({ ...filters, propertyType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Price Range
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      setFilters({ ...filters, priceRange: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Any Price</option>
                    <option value="0-2000000">Under ₹20 Lakhs</option>
                    <option value="2000000-5000000">₹20L - ₹50L</option>
                    <option value="5000000-10000000">₹50L - ₹1 Cr</option>
                    <option value="10000000-99999999">Above ₹1 Cr</option>
                  </select>
                </div>

                {/* BHK Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    BHK
                  </label>
                  <select
                    value={filters.bhk}
                    onChange={(e) =>
                      setFilters({ ...filters, bhk: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>

                {/* Curated Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Curated</label>
                  <select
                    value={filters.curated}
                    onChange={(e) => setFilters({ ...filters, curated: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Curated</option>
                    {curatedOptions.map((c) => (
                      <option key={c.title} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Featured Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Location</label>
                  <select
                    value={filters.featuredLocation}
                    onChange={(e) => setFilters({ ...filters, featuredLocation: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-indigo-200 rounded-xl bg-indigo-50/50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <option value="">All Locations</option>
                    {featuredLocationOptions.map((f) => (
                      <option key={f.title} value={f.title}>{f.title}</option>
                    ))}
                  </select>
                </div>

                {/* Featured only toggle */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => setFilters({ ...filters, featuredOnly: e.target.checked })} />
                    <span className="text-sm font-semibold text-gray-700">Featured only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ===== PROPERTIES GRID ===== */}
      <div className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-b from-white to-indigo-50/30">
        {/* Results Count */}
        <div className="mb-6">
          <p
            className="text-gray-600 text-sm font-semibold"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Showing {displayedProperties.length} of {filteredProperties.length}{" "}
            properties
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="ml-3 text-indigo-600 hover:text-indigo-700 underline font-semibold"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>

        {displayedProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home size={48} className="text-indigo-600" />
            </div>
            <h3
              className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent mb-2"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              No properties found
            </h3>
            <p
              className="text-gray-600 mb-4"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Try adjusting your search or filters.
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProperties.map((property, idx) => (
              <article
                key={property._id}
                onClick={() => handlePropertyClick(property)}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-indigo-200 ${
                  animateCards
                    ? "opacity-100 translate-y-0 animate-fade-in"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={
                      property.images?.[0]?.url ||
                      property.images?.[0] ||
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600"
                    }
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="absolute top-4 right-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-1 animate-pulse">
                    <Sparkles size={12} />
                    For Sale
                  </div>

                  {/* Price on Hover */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-full">
                      <span className="text-indigo-600 font-bold text-lg">
                        ₹{property.price?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-rose-600 bg-clip-text text-transparent mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    ₹{property.price?.toLocaleString("en-IN")}
                  </div>

                  <h3
                    className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {property.title}
                  </h3>

                  <div className="flex items-center text-gray-500 mb-4 text-sm">
                    <MapPin size={16} className="mr-1 text-rose-500" />
                    <span className="font-semibold">{property.city}</span>
                  </div>

                  <div className="flex justify-between items-center gap-3 text-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex flex-col items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                        <Bed size={18} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {property.bhk} BHK
                      </span>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-b from-indigo-200 to-indigo-200"></div>

                    <div className="flex flex-col items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                        <Bath size={18} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {property.bathrooms || 2}
                      </span>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-b from-indigo-200 to-rose-200"></div>

                    <div className="flex flex-col items-center">
                      <div className="bg-indigo-100 p-2 rounded-lg mb-1">
                        <Square size={18} className="text-indigo-600" />
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        {property.area || 1200} sqft
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Listings;
