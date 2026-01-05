import { useState, useContext, useEffect } from "react";
import { PropertyContext } from "../context/PropertyContext";
import AdminSidebar from "../components/AdminSidebar";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Home,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize,
  Sparkles,
} from "lucide-react";
import api from "../utils/api";

const EditProperty = ({ setCurrentPage, propertyId }) => {
  const { properties, fetchProperties } = useContext(PropertyContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    bhk: "",
    area: "",
    bathrooms: "",
    amenities: "",
    status: "active",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [existingCurated, setExistingCurated] = useState(null);
  const [existingCuratedOptions, setExistingCuratedOptions] = useState([]);
  const [selectedCuratedProperty, setSelectedCuratedProperty] = useState("");
  const [existingFeatured, setExistingFeatured] = useState(null);
  const [existingFeaturedOptions, setExistingFeaturedOptions] = useState([]);
  const [selectedFeaturedLocation, setSelectedFeaturedLocation] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [curatedPropertyFile, setCuratedPropertyFile] = useState(null);
  const [curatedPropertyPreview, setCuratedPropertyPreview] = useState(null);
  const [removeCurated, setRemoveCurated] = useState(false);
  const [featuredPropertyFile, setFeaturedPropertyFile] = useState(null);
  const [featuredPropertyPreview, setFeaturedPropertyPreview] = useState(null);
  const [removeFeatured, setRemoveFeatured] = useState(false);
  const [existingVideos, setExistingVideos] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const property = properties.find((p) => p._id === propertyId);
    if (property) {
      setFormData({
        title: property.title,
        description: property.description,
        price: property.price,
        city: property.city,
        address: property.address,
        bhk: property.bhk,
        area: property.area || "",
        bathrooms: property.bathrooms,
        amenities: Array.isArray(property.amenities)
          ? property.amenities.join(", ")
          : property.amenities,
        status: property.status,
      });
      setExistingImages(property.images || []);
      // Normalize existing video(s) to an array
      if (Array.isArray(property.video)) {
        setExistingVideos(property.video || []);
      } else if (property.video) {
        setExistingVideos([property.video]);
      } else {
        setExistingVideos([]);
      }
      setExistingCurated(property.curatedProperty || null);
      setExistingFeatured(property.featuredLocation || null);
      // Pre-select any manual curated/featured titles if present
      setSelectedCuratedProperty(property.curatedProperty?.title || "");
      setSelectedFeaturedLocation(property.featuredLocation?.title || "");
    }
    setInitialLoading(false);
  }, [propertyId, properties]);

  // Fetch existing curated titles and featured locations for reuse
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const curatedRes = await fetch(`${import.meta.env.VITE_API_URL}/properties/curated/titles`);
        const curatedJson = await curatedRes.json();
        if (curatedJson.success) setExistingCuratedOptions(curatedJson.data || []);
      } catch (err) {
        console.error('Failed to fetch curated titles', err);
        setExistingCuratedOptions([]);
      }

      try {
        const featuredRes = await fetch(`${import.meta.env.VITE_API_URL}/properties/locations/featured`);
        const featuredJson = await featuredRes.json();
        if (featuredJson.success) {
          const manual = featuredJson.data?.manual || [];
          setExistingFeaturedOptions(manual || []);
        }
      } catch (err) {
        console.error('Failed to fetch featured locations', err);
        setExistingFeaturedOptions([]);
      }
    };

    fetchOptions();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (existingImages.length + imageFiles.length + files.length > 15) {
      setError("Maximum 15 images allowed in total");
      return;
    }

    const invalidFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError("Each image must be less than 5MB");
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (existingVideos.length + videoFiles.length + files.length > 2) {
      setError("Maximum 2 videos allowed in total");
      return;
    }

    const invalidFiles = files.filter((file) => file.size > 50 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError("Each video must be less than 50MB");
      return;
    }

    setVideoFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCuratedPropertyFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Curated property image must be less than 5MB");
      return;
    }
    setCuratedPropertyFile(file);
    // If admin uploads a new curated image, clear any selected existing curated option
    setSelectedCuratedProperty("");
    const reader = new FileReader();
    reader.onloadend = () => setCuratedPropertyPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleFeaturedPropertyFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Featured location image must be less than 5MB");
      return;
    }
    setFeaturedPropertyFile(file);
    // If admin uploads a new featured image, clear any selected existing featured option
    setSelectedFeaturedLocation("");
    const reader = new FileReader();
    reader.onloadend = () => setFeaturedPropertyPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const removeNewVideo = (index) => {
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("bhk", formData.bhk);
      formDataToSend.append("bathrooms", formData.bathrooms);
      if (formData.area) formDataToSend.append("area", formData.area);
      if (formData.amenities)
        formDataToSend.append("amenities", formData.amenities);
      formDataToSend.append("status", formData.status);

      // Add new images only
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // Add new videos (up to 2 total)
      videoFiles.forEach((file) => {
        formDataToSend.append("videos", file);
      });

      // If existingVideos were modified (some removed), send the remaining list so backend can keep them.
      if (existingVideos && existingVideos.length > 0) {
        try {
          formDataToSend.append('existingVideos', JSON.stringify(existingVideos));
        } catch (e) {
          // ignore
        }
      }

      // Curated property handling
      if (removeCurated) {
        formDataToSend.append("removeCuratedProperty", true);
      } else if (selectedCuratedProperty) {
        // Reuse existing curated title (backend will reuse image)
        formDataToSend.append("curatedPropertyTitle", selectedCuratedProperty);
      } else if (curatedPropertyFile) {
        // If new curated image provided, include it and the edited/existing title
        formDataToSend.append("curatedPropertyImage", curatedPropertyFile);
        if (existingCurated?.title) formDataToSend.append("curatedPropertyTitle", existingCurated.title);
      } else if (existingCurated?.title) {
        // Admin typed/edited a curated title but didn't upload a new image — send title-only update
        formDataToSend.append("curatedPropertyTitle", existingCurated.title);
      }

      // Featured location handling (mirror curated behavior)
      if (removeFeatured) {
        formDataToSend.append("removeFeaturedLocation", true);
      } else if (selectedFeaturedLocation) {
        formDataToSend.append("featuredLocationTitle", selectedFeaturedLocation);
      } else if (featuredPropertyFile) {
        formDataToSend.append("featuredLocationImage", featuredPropertyFile);
        if (existingFeatured?.title) formDataToSend.append("featuredLocationTitle", existingFeatured.title);
      } else if (existingFeatured?.title) {
        // Admin typed/edited a featured title but didn't upload a new image — send title-only update
        formDataToSend.append("featuredLocationTitle", existingFeatured.title);
      }

      const response = await api.put(
        `/properties/${propertyId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        await fetchProperties();
        setTimeout(() => {
          setCurrentPage("admin-dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        setCurrentPage("admin-login");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to update property. Please try again."
        );
      }
    }

    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar currentPage="edit-property" setCurrentPage={setCurrentPage} />
        <div className="flex-1 bg-gradient-to-br from-sky-50 to-red-50 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        currentPage="edit-property"
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 bg-gradient-to-br from-sky-50 to-red-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Edit Property
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Update your property details and media
            </p>
          </div>

          {success && (
            <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-500 text-green-900 p-5 rounded-2xl mb-6 shadow-lg">
              <p className="font-bold text-lg mb-1">🎉 Success!</p>
              <p className="text-sm">
                Property updated successfully. Redirecting to dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-500 text-red-900 p-5 rounded-2xl mb-6 shadow-lg">
              <p className="font-bold text-lg mb-1">⚠️ Error!</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/50">
            <form onSubmit={handleSubmit}>
              {/* Property Details Section */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Home className="text-blue-600" />
                  Property Details
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <Home size={18} className="text-blue-600" />
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      placeholder="e.g., Luxury 3BHK Villa in Bandra West"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <MapPin size={18} className="text-blue-600" />
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                      placeholder="Mumbai"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <IndianRupee size={18} className="text-red-600" />
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                      placeholder="5000000"
                      min="0"
                      step="1000"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-red-600 focus:ring-4 focus:ring-red-100 outline-none transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <MapPin size={18} className="text-blue-600" />
                      Full Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                      placeholder="123 Main Street, Bandra West, Mumbai - 400050"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Curated Property Section */}
              {/* Featured Location Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Sparkles className="text-yellow-600" />
                  Featured Location
                </h2>

                {existingFeatured ? (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden">
                        <img src={existingFeatured.image?.url} alt="featured" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{existingFeatured.title}</p>
                        <p className="text-xs text-gray-600">Existing featured tag</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={removeFeatured} onChange={(e) => setRemoveFeatured(e.target.checked)} />
                          <span className="text-sm">Remove featured tag</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">No featured tag assigned</p>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Existing Featured (optional)</label>
                    <select
                      value={selectedFeaturedLocation}
                      onChange={(e) => {
                        setSelectedFeaturedLocation(e.target.value);
                        setFeaturedPropertyFile(null);
                        setFeaturedPropertyPreview(null);
                        setExistingFeatured((prev) => ({ ...(prev||{}), title: e.target.value }));
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                    >
                      <option value="">-- Choose existing --</option>
                      {existingFeaturedOptions.map((f) => (
                        <option key={f.title} value={f.title}>{f.title}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">Re-use an existing featured image/title without uploading a new image.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Or Upload New Featured Image</label>
                    <button
                      type="button"
                      onClick={() => document.getElementById('featuredLocationImage').click()}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold"
                    >
                      Upload Image
                    </button>
                    <input id="featuredLocationImage" type="file" accept="image/*" onChange={handleFeaturedPropertyFile} className="hidden" />
                    {featuredPropertyPreview && (
                      <div className="mt-3 w-36 h-24 rounded-lg overflow-hidden shadow-md">
                        <img src={featuredPropertyPreview} alt="featured new" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">If you upload an image, the featured title will be set from the selected option or existing data.</p>
                    <div className="mt-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Title (optional)</label>
                      <input
                        type="text"
                        value={existingFeatured?.title || ''}
                        onChange={(e) => {
                          // Editing title means we're not using a pre-selected existing option
                          setSelectedFeaturedLocation("");
                          setExistingFeatured((prev) => ({ ...(prev||{}), title: e.target.value }));
                        }}
                        placeholder="e.g., Mumbai Central"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">If you upload an image, the title here will be used.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Sparkles className="text-yellow-600" />
                  Curated Property
                </h2>

                {existingCurated ? (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden">
                        <img src={existingCurated.image?.url} alt="curated" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{existingCurated.title}</p>
                        <p className="text-xs text-gray-600">Existing curated tag</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={removeCurated} onChange={(e) => setRemoveCurated(e.target.checked)} />
                          <span className="text-sm">Remove curated tag</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">No curated tag assigned</p>
                )}

                {/* Title field appears here (under Curated header) */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Curated Title (optional)</label>
                  <input
                    type="text"
                    value={existingCurated?.title || ''}
                    onChange={(e) => {
                      // Editing title means we're not using a pre-selected existing option
                      setSelectedCuratedProperty("");
                      setExistingCurated((prev) => ({ ...(prev||{}), title: e.target.value }));
                    }}
                    placeholder="e.g., Editor's Pick - South Gurgaon"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Type a title to set/update the curated title, or choose an existing option below.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Existing Curated (optional)</label>
                    <select
                      value={selectedCuratedProperty}
                      onChange={(e) => {
                        setSelectedCuratedProperty(e.target.value);
                        // clear any new upload/preview when choosing existing
                        setCuratedPropertyFile(null);
                        setCuratedPropertyPreview(null);
                        setExistingCurated((prev) => ({ ...(prev||{}), title: e.target.value }));
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                    >
                      <option value="">-- Choose existing --</option>
                      {existingCuratedOptions.map((c) => (
                        <option key={c.title} value={c.title}>{c.title}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-2">Re-use an existing curated image/title without uploading a new image.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Or Upload New Curated Image</label>
                    <button
                      type="button"
                      onClick={() => document.getElementById('curatedPropertyImage').click()}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold"
                    >
                      Upload Image
                    </button>
                    <input id="curatedPropertyImage" type="file" accept="image/*" onChange={handleCuratedPropertyFile} className="hidden" />
                    {curatedPropertyPreview && (
                      <div className="mt-3 w-36 h-24 rounded-lg overflow-hidden shadow-md">
                        <img src={curatedPropertyPreview} alt="curated new" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">If you upload an image, the title above will be used (if provided).</p>
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Bed className="text-blue-600" />
                  Specifications
                </h2>

                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <Bed size={18} className="text-blue-600" />
                      BHK *
                    </label>
                    <input
                      type="number"
                      value={formData.bhk}
                      onChange={(e) =>
                        setFormData({ ...formData, bhk: e.target.value })
                      }
                      required
                      placeholder="3"
                      min="1"
                      max="10"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <Bath size={18} className="text-blue-600" />
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bathrooms: e.target.value })
                      }
                      required
                      placeholder="2"
                      min="1"
                      max="10"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      <Maximize size={18} className="text-blue-600" />
                      Area (sq.ft)
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="1200"
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-base font-semibold text-gray-700 mb-3">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description & Amenities */}
              <div className="mb-10">
                <div className="mb-6">
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    placeholder="Describe your property in detail..."
                    rows={5}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-vertical"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) =>
                      setFormData({ ...formData, amenities: e.target.value })
                    }
                    placeholder="Swimming Pool, Gym, Parking, 24/7 Security"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ImageIcon className="text-blue-600" />
                  Media Management
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Images Management */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-700 mb-3">
                        Current Images ({existingImages.length})
                      </h3>
                      {existingImages.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {existingImages.map((image, index) => (
                            <div
                              key={index}
                              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md"
                            >
                              <img
                                src={image.url}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-1 right-1 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No images yet</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Add New Images (Max {15 - existingImages.length} more)
                      </label>
                      <button
                        type="button"
                        onClick={() => document.getElementById("images").click()}
                        disabled={existingImages.length >= 15}
                        className={`w-full px-6 py-4 ${
                          existingImages.length >= 15
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-sky-400 to-sky-400 hover:from-blue-700 hover:to-blue-800"
                        } text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                      >
                        <ImageIcon size={20} />
                        Upload New Images
                      </button>
                      <input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        PNG, JPG, WEBP up to 5MB each
                      </p>

                      {imagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md border-2 border-green-400"
                            >
                              <img
                                src={preview}
                                alt={`New Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeNewImage(index)}
                                className="absolute top-1 right-1 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Management */}
                  <div>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-700 mb-3">
                        Current Video(s)
                      </h3>
                      {existingVideos && existingVideos.length > 0 ? (
                        <div className="space-y-3">
                          {existingVideos.map((v, idx) => (
                            <div key={idx} className="p-3 bg-gray-100 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <video src={v.url || v} className="w-40 h-24 object-cover rounded-md" controls />
                                <span className="text-sm text-gray-700 font-medium">Video {idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExistingVideo(idx)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No video yet</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-base font-semibold text-gray-700 mb-3">
                        Upload New Video (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => document.getElementById("video").click()}
                        className={`w-full px-6 py-4 ${
                          videoFiles.length > 0
                            ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                            : "bg-gradient-to-r from-red-400 to-red-400 hover:from-red-400 hover:to-red-700"
                        } text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl`}
                      >
                        <Video size={20} />
                        {videoFiles.length > 0 ? `${videoFiles.length} video(s) ready` : "Upload Video(s)"}
                      </button>
                      <input
                        id="video"
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        MP4, MOV up to 50MB
                      </p>

                      {videoPreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 gap-3">
                          {videoPreviews.map((preview, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                              <div className="flex items-center gap-3">
                                <video src={preview} className="w-40 h-24 object-cover rounded-md" controls />
                                <span className="text-sm text-gray-700 font-medium">New Video {idx + 1}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeNewVideo(idx)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 pt-8 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 px-8 py-5 ${
                    loading
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-400 to-sky-400 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-1 hover:shadow-2xl"
                  } text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Property...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Update Property
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage("admin-dashboard")}
                  className="px-10 py-5 bg-white text-gray-700 rounded-xl font-bold text-lg border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 hover:-translate-y-1 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
