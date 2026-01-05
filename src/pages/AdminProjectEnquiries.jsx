import React, { useEffect, useState } from "react";
import {
    Mail,
    Phone,
    Calendar,
    Trash2,
    Check,
    Clock,
    Search,
    Layout,
    MessageSquare
} from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import Loader from "../components/Loader";
import api from "../utils/api";

const AdminProjectEnquiries = ({ setCurrentPage }) => {
    const [enquiries, setEnquiries] = useState([]);
    const [stats, setStats] = useState({ total: 0, contacted: 0, converted: 0, interested: 0, notResponded: 0 });
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const fetchEnquiries = async (status = "") => {
        setLoading(true);
        try {
            const query = status && status !== "all" ? `?status=${status}` : "";
            const response = await api.get(`/project-enquiries/all${query}`);
            if (response.data.success) {
                setEnquiries(response.data.data);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Error fetching project enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setCurrentPage("admin-login");
            return;
        }
        fetchEnquiries(filter);
    }, [filter]);

    const handleStatusUpdate = async (id, newStatus) => {
        setActionLoading(id);
        try {
            await api.put(`/project-enquiries/${id}`, { status: newStatus });
            fetchEnquiries(filter);
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this enquiry?")) {
            setActionLoading(id);
            try {
                await api.delete(`/project-enquiries/${id}`);
                fetchEnquiries(filter);
            } catch (error) {
                alert("Failed to delete enquiry");
            } finally {
                setActionLoading(null);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'converted': return 'bg-green-100 text-green-700 border-green-200';
            case 'contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'interested': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'not responded': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredEnquiries = enquiries.filter((enq) => {
        return (
            enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.phone.includes(searchTerm) ||
            (enq.project && enq.project.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex-col md:flex-row">
            <AdminSidebar
                currentPage="admin-project-enquiries"
                setCurrentPage={setCurrentPage}
            />

            <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-x-hidden">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">
                        Landing Page Leads
                    </h1>
                    <p className="text-gray-600 text-sm md:text-lg">
                        Manage enquiries from Shapoorji Pallonji Dualis Landing Page
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-500">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Total</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Contacted</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{stats.contacted}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Interested</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{stats.interested}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Converted</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{stats.converted}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-400">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">No Response</p>
                        <p className="text-xl md:text-2xl font-black text-gray-900">{stats.notResponded}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border border-gray-100 mb-8">
                    <div className="flex flex-col xl:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {[
                                { id: 'all', label: 'All', count: stats.total },
                                { id: 'not responded', label: 'No Response', count: stats.notResponded },
                                { id: 'contacted', label: 'Contacted', count: stats.contacted },
                                { id: 'interested', label: 'Interested', count: stats.interested },
                                { id: 'converted', label: 'Converted', count: stats.converted }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setFilter(s.id)}
                                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold text-[10px] md:text-sm transition-all ${filter === s.id
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {s.label} ({s.count})
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12"><Loader /></div>
                    ) : filteredEnquiries.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">No leads found</div>
                    ) : (
                        <>
                            {/* Desktop View Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Contact Info</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Special Enquiry</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredEnquiries.map((enq) => (
                                            <tr key={enq._id} className="hover:bg-blue-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">{enq.name}</div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1"><Mail size={14} /> {enq.email}</div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14} /> {enq.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">{enq.specialEnquiry || "-"}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-blue-600 font-mono tracking-tight">{enq.project}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border ${getStatusColor(enq.status)}`}>
                                                        {enq.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} /> {new Date(enq.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-3">
                                                        <select
                                                            value={enq.status}
                                                            onChange={(e) => handleStatusUpdate(enq._id, e.target.value)}
                                                            className="text-xs font-bold py-1.5 px-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 outline-none bg-white cursor-pointer"
                                                            disabled={actionLoading === enq._id}
                                                        >
                                                            <option value="not responded">No Response</option>
                                                            <option value="contacted">Contacted</option>
                                                            <option value="interested">Interested</option>
                                                            <option value="converted">Converted</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDelete(enq._id)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Delete Enquiry"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden divide-y divide-gray-100">
                                {filteredEnquiries.map((enq) => (
                                    <div key={enq._id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-1">{enq.name}</h3>
                                                <a href={`tel:${enq.phone}`} className="text-sm font-semibold text-blue-600 flex items-center gap-2 mb-1">
                                                    <Phone size={14} /> {enq.phone}
                                                </a>
                                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                                    <Calendar size={12} /> {new Date(enq.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(enq._id)}
                                                className="p-2 text-red-500 bg-red-50 rounded-lg"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Inquiry Details</p>
                                            <p className="text-sm text-gray-700">{enq.specialEnquiry || "No message"}</p>
                                            <div className="mt-3 pt-2 border-t border-gray-200">
                                                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest">Target Project</p>
                                                <p className="text-xs font-mono font-bold text-blue-600">{enq.project}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                            <div className="flex-1">
                                                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-widest px-1">Update Status</p>
                                                <select
                                                    value={enq.status}
                                                    onChange={(e) => handleStatusUpdate(enq._id, e.target.value)}
                                                    className="w-full text-xs font-bold py-2 px-3 rounded-lg border-2 border-gray-200 outline-none bg-white"
                                                    disabled={actionLoading === enq._id}
                                                >
                                                    <option value="not responded">No Response</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="interested">Interested</option>
                                                    <option value="converted">Converted</option>
                                                </select>
                                            </div>
                                            <div className="sm:text-right pt-2 sm:pt-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border ${getStatusColor(enq.status)}`}>
                                                    {enq.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProjectEnquiries;
