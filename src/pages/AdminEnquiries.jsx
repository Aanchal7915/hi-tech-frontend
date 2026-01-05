import React, { useContext, useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Home as HomeIcon,
  Trash2,
  Check,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { EnquiryContext } from "../context/EnquiryContext";
import AdminSidebar from "../components/AdminSidebar";
import Loader from "../components/Loader";

const AdminEnquiries = ({ setCurrentPage }) => {
  const {
    enquiries,
    stats,
    loading,
    fetchEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    addEnquiryNote,
  } = useContext(EnquiryContext);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [openNotesFor, setOpenNotesFor] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [addingNoteFor, setAddingNoteFor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to access enquiries");
      setCurrentPage("login");
      return;
    }
    
    if (filter === "all") {
      fetchEnquiries();
    } else {
      fetchEnquiries(filter);
    }
  }, [filter]);

  const handleStatusUpdate = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updateEnquiryStatus(id, newStatus);
      alert(`Enquiry marked as ${newStatus}!`);
    } catch (error) {
      alert("Failed to update status: " + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      setActionLoading(id);
      try {
        await deleteEnquiry(id);
        alert("Enquiry deleted successfully!");
      } catch (error) {
        alert("Failed to delete: " + (error.response?.data?.message || error.message));
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.phone.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-red-50">
      <AdminSidebar
        currentPage="admin-enquiries"
        setCurrentPage={setCurrentPage}
      />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 pl-[50px]">
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">
            Enquiry Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and respond to customer enquiries
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Total Enquiries
                </p>
                <p className="text-3xl font-black text-gray-900">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Pending</p>
                <p className="text-3xl font-black text-gray-900">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Handled</p>
                <p className="text-3xl font-black text-gray-900">{stats.handled}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <Check className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Filter Tabs */}
            <div className="flex gap-2">
              {[
                { label: "All", value: "all", color: "blue" },
                { label: "Pending", value: "pending", color: "orange" },
                { label: "Handled", value: "handled", color: "green" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filter === tab.value
                      ? `bg-${tab.color}-600 text-blue shadow-lg`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                  {tab.value === "all" && ` (${stats.total})`}
                  {tab.value === "pending" && ` (${stats.pending})`}
                  {tab.value === "handled" && ` (${stats.handled})`}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all w-full"
              />
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12">
              <Loader />
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No enquiries found
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No enquiries available yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Admin Notes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredEnquiries.map((enquiry) => (
                    <React.Fragment key={enquiry._id}>
                    <tr
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="font-bold text-gray-900">{enquiry.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            {enquiry.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            {enquiry.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">
                          {enquiry.message}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {enquiry.propertyId ? (
                          <div className="flex items-center gap-2">
                            <HomeIcon className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="font-semibold text-sm text-gray-900">
                                {enquiry.propertyId.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {enquiry.propertyId.city}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            General Enquiry
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            enquiry.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {enquiry.status === "pending" ? (
                            <Clock className="w-3 h-3 mr-1" />
                          ) : (
                            <Check className="w-3 h-3 mr-1" />
                          )}
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(enquiry.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* Notes toggle button */}
                          <button
                            onClick={() => setOpenNotesFor(openNotesFor === enquiry._id ? null : enquiry._id)}
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all duration-200"
                            title="View / Add notes"
                          >
                            Notes
                          </button>
                          {enquiry.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(enquiry._id, "handled")
                              }
                              disabled={actionLoading === enquiry._id}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Mark as Handled"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {enquiry.status === "handled" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(enquiry._id, "pending")
                              }
                              disabled={actionLoading === enquiry._id}
                              className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                              title="Mark as Pending"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(enquiry._id)}
                            disabled={actionLoading === enquiry._id}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable notes row */}
                    {openNotesFor === enquiry._id && (
                      <tr key={enquiry._id + "-notes"} className="bg-gray-50">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-2">Admin Notes</h4>
                              {(!enquiry.adminNotes || enquiry.adminNotes.length === 0) ? (
                                <p className="text-sm text-gray-500">No notes yet.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {enquiry.adminNotes.map((note, i) => (
                                    <li key={i} className="bg-white border rounded-lg p-3">
                                      <div className="flex items-start justify-between gap-4">
                                        <div>
                                          <p className="text-sm text-gray-800">{note.text}</p>
                                          <p className="text-xs text-gray-500 mt-2">By {note.admin?.name || 'Admin'} · {new Date(note.createdAt).toLocaleString()}</p>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <textarea
                                value={newNoteText}
                                onChange={(e) => setNewNoteText(e.target.value)}
                                placeholder="Add a private admin note..."
                                className="flex-1 border rounded-lg p-3 resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows={3}
                              />
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={async () => {
                                    if (!newNoteText.trim()) return alert('Please enter a note');
                                    setAddingNoteFor(enquiry._id);
                                    try {
                                      await addEnquiryNote(enquiry._id, newNoteText.trim());
                                      setNewNoteText('');
                                      // refetch list to update reliably
                                      fetchEnquiries(filter === 'all' ? '' : filter);
                                    } catch (error) {
                                      alert('Failed to add note: ' + (error.response?.data?.message || error.message));
                                    } finally {
                                      setAddingNoteFor(null);
                                    }
                                  }}
                                  disabled={addingNoteFor === enquiry._id}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
                                >
                                  {addingNoteFor === enquiry._id ? 'Adding...' : 'Add Note'}
                                </button>
                                <button
                                  onClick={() => { setOpenNotesFor(null); setNewNoteText(''); }}
                                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Count */}
          {filteredEnquiries.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
              Showing {filteredEnquiries.length} of {enquiries.length} enquiries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;