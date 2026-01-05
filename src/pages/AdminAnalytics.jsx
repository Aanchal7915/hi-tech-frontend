import { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Eye, MousePointer, MapPin, DollarSign, Home, Calendar, BarChart3 } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../utils/api";

const AdminAnalytics = ({ currentPage, setCurrentPage }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [topProperties, setTopProperties] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [priceAnalytics, setPriceAnalytics] = useState([]);
  const [bhkAnalytics, setBhkAnalytics] = useState([]);
  const [engagementData, setEngagementData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const [
        summaryRes,
        propertiesRes,
        locationsRes,
        pricesRes,
        bhkRes,
        engagementRes
      ] = await Promise.all([
        api.get("/analytics/summary"),
        api.get("/analytics/top-properties?limit=5"),
        api.get("/analytics/top-locations?limit=5"),
        api.get("/analytics/top-prices"),
        api.get("/analytics/top-bhk"),
        api.get("/analytics/engagement?days=30")
      ]);

      setSummary(summaryRes.data.data);
      setTopProperties(propertiesRes.data.data);
      setTopLocations(locationsRes.data.data);
      setPriceAnalytics(pricesRes.data.data);
      setBhkAnalytics(bhkRes.data.data);
      setEngagementData(engagementRes.data.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <div className="flex-1 p-8 ml-0">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-sky-600" />
            <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Track user engagement and property performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Views",
              value: summary.totalViews?.toLocaleString() || "0",
              icon: <Eye size={24} />,
              color: "from-blue-500 to-blue-600",
              bgColor: "bg-blue-50"
            },
            {
              title: "Total Clicks",
              value: summary.totalClicks?.toLocaleString() || "0",
              icon: <MousePointer size={24} />,
              color: "from-green-500 to-green-600",
              bgColor: "bg-green-50"
            },
            {
              title: "Most Popular City",
              value: summary.topCity || "N/A",
              icon: <MapPin size={24} />,
              color: "from-purple-500 to-purple-600",
              bgColor: "bg-purple-50"
            },
            {
              title: "Engagement Rate",
              value: `${summary.engagementRate || 0}%`,
              icon: <TrendingUp size={24} />,
              color: "from-orange-500 to-orange-600",
              bgColor: "bg-orange-50"
            }
          ].map((card, idx) => (
            <div key={idx} className={`${card.bgColor} rounded-2xl p-6 border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {card.value}
              </div>
              <div className="text-sm font-semibold text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                {card.title}
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Properties Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <TrendingUp size={24} className="text-sky-600" />
              Most Viewed Properties
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProperties}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} style={{ fontSize: '12px' }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Locations Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <MapPin size={24} className="text-purple-600" />
              Top Locations
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topLocations}
                  dataKey="totalEvents"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry._id}
                >
                  {topLocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Price Range Analytics */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <DollarSign size={24} className="text-green-600" />
              Price Range Interest
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" angle={-15} textAnchor="end" height={80} style={{ fontSize: '12px' }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BHK Analytics */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <Home size={24} className="text-orange-600" />
              BHK Preferences
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bhkAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bhk" label={{ value: 'BHK', position: 'insideBottom', offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Engagement Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <Calendar size={24} className="text-sky-600" />
            Engagement Over Time (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Properties Table */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Top Performing Properties
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Property
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    City
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Price
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    BHK
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Views
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Last Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProperties.map((property, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-sky-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {property.image && (
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-semibold text-gray-900 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {property.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {property.city}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                      ₹{(property.price / 10000000).toFixed(2)}Cr
                    </td>
                    <td className="py-3 px-4 text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {property.bhk} BHK
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-sm font-bold">
                        <Eye size={14} />
                        {property.count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {new Date(property.lastActivity).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;