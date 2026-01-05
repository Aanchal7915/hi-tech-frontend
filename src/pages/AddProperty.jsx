import { useState, useContext } from "react";
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

const AddProperty = ({ setCurrentPage }) => {
  const { fetchProperties } = useContext(PropertyContext);
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
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [isFeaturedLocation, setIsFeaturedLocation] = useState(false);
  const [existingFeaturedLocations, setExistingFeaturedLocations] = useState([]);
  const [existingCuratedProperties, setExistingCuratedProperties] = useState([]);
  const [selectedFeaturedLocation, setSelectedFeaturedLocation] = useState("");
  const [newFeaturedTitle, setNewFeaturedTitle] = useState("");
  const [featuredLocationFile, setFeaturedLocationFile] = useState(null);
  const [featuredLocationPreview, setFeaturedLocationPreview] = useState(null);
  // Curated property fields (mirror featured location behavior)
  const [isCuratedProperty, setIsCuratedProperty] = useState(false);
  const [selectedCuratedProperty, setSelectedCuratedProperty] = useState("");
  const [newCuratedTitle, setNewCuratedTitle] = useState("");
  const [curatedPropertyFile, setCuratedPropertyFile] = useState(null);
  const [curatedPropertyPreview, setCuratedPropertyPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 15) {
      setError("Maximum 15 images allowed");
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

    if (videoFiles.length + files.length > 2) {
      setError("Maximum 2 videos allowed");
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

  const handleFeaturedLocationFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Featured location image must be less than 5MB");
      return;
    }
    setFeaturedLocationFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setFeaturedLocationPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const handleCuratedPropertyFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Curated property image must be less than 5MB");
      return;
    }
    setCuratedPropertyFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCuratedPropertyPreview(reader.result);
    reader.readAsDataURL(file);
    setError("");
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoFiles([]);
    setVideoPreviews([]);
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

      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      videoFiles.forEach((file) => {
        formDataToSend.append("videos", file);
      });

      // Featured location fields
      if (isFeaturedLocation) {
        // If selected existing location, use that title
        if (selectedFeaturedLocation) {
          formDataToSend.append("featuredLocationTitle", selectedFeaturedLocation);
        } else if (newFeaturedTitle) {
          formDataToSend.append("featuredLocationTitle", newFeaturedTitle);
          if (featuredLocationFile) {
            formDataToSend.append("featuredLocationImage", featuredLocationFile);
          }
        }
      }

      // Curated property fields
      if (isCuratedProperty) {
        if (selectedCuratedProperty) {
          formDataToSend.append("curatedPropertyTitle", selectedCuratedProperty);
        } else if (newCuratedTitle) {
          formDataToSend.append("curatedPropertyTitle", newCuratedTitle);
          if (curatedPropertyFile) {
            formDataToSend.append("curatedPropertyImage", curatedPropertyFile);
          }
        }
      }

      const response = await api.post("/properties", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess(true);
        fetchProperties();
        setTimeout(() => {
          setCurrentPage("admin-dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding property:", error);
      setError(
        error.response?.data?.message ||
          "Failed to add property. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        currentPage="add-property"
        setCurrentPage={setCurrentPage}
      />
      <div className="flex-1 bg-gradient-to-br from-sky-50 to-red-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* <Sparkles className="w-10 h-10 text-blue-600" /> */}
              <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                Add Property
              </h1>
              {/* <Sparkles className="w-10 h-10 text-red-600" /> */}
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              List your premium property and reach thousands of potential buyers
            </p>
          </div>

          {success && (
            <div className="bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-500 text-green-900 p-5 rounded-2xl mb-6 shadow-lg">
              <p className="font-bold text-lg mb-1">🎉 Success!</p>
              <p className="text-sm">
                Property added successfully. Redirecting to dashboard...
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

              {/* Specifications Section */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Bed className="text-blue-600" />
                  Specifications
                </h2>

                <div className="grid grid-cols-3 gap-6">
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
                    placeholder="Describe your property in detail - location benefits, unique features, nearby amenities..."
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
                    placeholder="Swimming Pool, Gym, Parking, 24/7 Security, Power Backup"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <ImageIcon className="text-blue-600" />
                  Media Upload
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  {/* Images Upload */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Property Images 
                    </label>
                    <button
                      type="button"
                      onClick={() => document.getElementById("images").click()}
                      className="w-full px-6 py-4 bg-gradient-to-r from-sky-400 to-sky-400 text-white rounded-xl font-semibold text-base hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <ImageIcon size={20} />
                      Upload Images
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
                            className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Property Video (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => document.getElementById("video").click()}
                      className={`w-full px-6 py-4 ${
                        videoFiles.length > 0
                          ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          : "bg-gradient-to-r from-red-400 to-red-400 hover:from-red-400 hover:to-red-700"
                      } text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5`}
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
                              <span className="text-sm text-gray-700 font-medium">Video {idx + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setVideoFiles((prev) => prev.filter((_, i) => i !== idx));
                                setVideoPreviews((prev) => prev.filter((_, i) => i !== idx));
                              }}
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

                {/* Featured Location Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Sparkles className="text-yellow-600" />
                    Featured Location (optional)
                  </h2>

                  <div className="flex items-center gap-4 mb-4">
                    <input
                      id="featuredToggle"
                      type="checkbox"
                      checked={isFeaturedLocation}
                      onChange={(e) => {
                        setIsFeaturedLocation(e.target.checked);
                        if (e.target.checked) {
                          api.get('/properties/locations/featured')
                            .then(res => {
                              const manual = res.data?.data?.manual || [];
                              setExistingFeaturedLocations(manual);
                            })
                            .catch(() => setExistingFeaturedLocations([]));
                        } else {
                          setSelectedFeaturedLocation("");
                          setNewFeaturedTitle("");
                          setFeaturedLocationFile(null);
                          setFeaturedLocationPreview(null);
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featuredToggle" className="text-base font-medium">Add to Featured Location</label>
                  </div>

                  {isFeaturedLocation && (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Existing</label>
                        <select
                          value={selectedFeaturedLocation}
                          onChange={(e) => {
                            setSelectedFeaturedLocation(e.target.value);
                            setNewFeaturedTitle("");
                            setFeaturedLocationFile(null);
                            setFeaturedLocationPreview(null);
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                        >
                          <option value="">-- Choose existing --</option>
                          {existingFeaturedLocations.map((loc) => (
                            <option key={loc.title} value={loc.title}>{loc.title}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Choose to reuse an existing featured location image</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Or New Location Title</label>
                        <input
                          type="text"
                          value={newFeaturedTitle}
                          onChange={(e) => {
                            setNewFeaturedTitle(e.target.value);
                            if (e.target.value) setSelectedFeaturedLocation("");
                          }}
                          placeholder="e.g., Mumbai Central"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">If new title, upload an image (required)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location Image</label>
                        <button
                          type="button"
                          onClick={() => document.getElementById('featuredLocationImage').click()}
                          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold"
                        >
                          Upload Location Image
                        </button>
                        <input id="featuredLocationImage" type="file" accept="image/*" onChange={handleFeaturedLocationFile} className="hidden" />
                        {featuredLocationPreview && (
                          <div className="mt-3 w-36 h-24 rounded-lg overflow-hidden shadow-md">
                            <img src={featuredLocationPreview} alt="loc" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Curated Property Section (mirrors featured location UI) */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Sparkles className="text-yellow-600" />
                    Curated Property (optional)
                  </h2>

                  <div className="flex items-center gap-4 mb-4">
                    <input
                      id="curatedToggle"
                      type="checkbox"
                      checked={isCuratedProperty}
                      onChange={(e) => {
                        setIsCuratedProperty(e.target.checked);
                        if (e.target.checked) {
                          api.get('/properties/curated/titles')
                            .then(res => {
                              const manual = res.data?.data || [];
                              setExistingCuratedProperties(manual);
                            })
                            .catch(() => setExistingCuratedProperties([]));
                        } else {
                          setSelectedCuratedProperty("");
                          setNewCuratedTitle("");
                          setCuratedPropertyFile(null);
                          setCuratedPropertyPreview(null);
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <label htmlFor="curatedToggle" className="text-base font-medium">Add as Curated Property</label>
                  </div>

                  {isCuratedProperty && (
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Existing (optional)</label>
                        <select
                          value={selectedCuratedProperty}
                          onChange={(e) => {
                            setSelectedCuratedProperty(e.target.value);
                            setNewCuratedTitle("");
                            setCuratedPropertyFile(null);
                            setCuratedPropertyPreview(null);
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                        >
                          <option value="">-- Choose existing --</option>
                          {existingCuratedProperties.map((loc) => (
                            <option key={loc.title} value={loc.title}>{loc.title}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">Choose to reuse an existing curated image</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Or New Curated Title</label>
                        <input
                          type="text"
                          value={newCuratedTitle}
                          onChange={(e) => {
                            setNewCuratedTitle(e.target.value);
                            if (e.target.value) setSelectedCuratedProperty("");
                          }}
                          placeholder="e.g., Editor's Pick - South Gurgaon"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">If new title, upload an image (required)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Curated Image</label>
                        <button
                          type="button"
                          onClick={() => document.getElementById('curatedPropertyImage').click()}
                          className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold"
                        >
                          Upload Curated Image
                        </button>
                        <input id="curatedPropertyImage" type="file" accept="image/*" onChange={handleCuratedPropertyFile} className="hidden" />
                        {curatedPropertyPreview && (
                          <div className="mt-3 w-36 h-24 rounded-lg overflow-hidden shadow-md">
                            <img src={curatedPropertyPreview} alt="curated" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
                      Adding Property...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Add Property
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

export default AddProperty;
