import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, MapPin, Shield, Camera, Save, X, Key, Briefcase, Calendar, Heart } from "lucide-react";
import axiosWrapper from "../../utils/AxiosWrapper";
import { baseMediaURL } from "../../baseUrl";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";

const Profile = ({ profileData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        state: profileData.state || "",
        pincode: profileData.pincode || "",
        country: profileData.country || "",
        gender: profileData.gender || "",
        dob: profileData.dob ? profileData.dob.split("T")[0] : "",
        bloodGroup: profileData.bloodGroup || "",
        emergencyContact: {
          name: profileData.emergencyContact?.name || "",
          relationship: profileData.emergencyContact?.relationship || "",
          phone: profileData.emergencyContact?.phone || "",
        },
      });
    }
  }, [profileData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "emergencyContact") {
          Object.keys(formData.emergencyContact).forEach((subKey) => {
            data.append(`emergencyContact[${subKey}]`, formData.emergencyContact[subKey]);
          });
        } else {
          data.append(key, formData[key]);
        }
      });

      if (file) {
        data.append("file", file);
      }

      const response = await axiosWrapper.patch(`/admin/${profileData._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!profileData) return null;

  const cardStyle = {
    background: "rgba(17, 24, 39, 0.7)",
    border: "1px solid #1F2937",
    backdropFilter: "blur(12px)",
  };

  const inputStyle = "w-full bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2.5 text-white outline-none focus:border-purple-500 transition-all";

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in pb-20">
      {/* Header Profile Section */}
      <div className="relative mb-8 rounded-[2rem] overflow-hidden" style={{ minHeight: "240px" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-indigo-900/40" />
        <div className="absolute inset-0 bg-white/[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        
        <div className="relative pt-12 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 h-full">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-[#111827] shadow-2xl relative">
              <img
                src={previewUrl || `${baseMediaURL()}/${profileData.profile}`}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random&size=200`;
                }}
              />
              {isEditing && (
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white mb-2" size={32} />
                  <span className="text-white text-xs font-medium">Change Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left mb-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-4xl font-black text-white tracking-tight">
                {profileData.firstName} {profileData.lastName}
              </h1>
              {profileData.isSuperAdmin && (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                  Super Admin
                </span>
              )}
            </div>
            <p className="text-purple-300 font-medium flex items-center justify-center md:justify-start gap-2 text-lg">
              <Briefcase size={18} />
              {profileData.designation || "Administrative Officer"}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {profileData.email}</span>
              <span className="flex items-center gap-1.5"><Phone size={14} /> {profileData.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {profileData.city}, {profileData.country}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <CustomButton variant="primary" className="!px-6 !py-3 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20" onClick={() => setIsEditing(true)}>
                Edit Profile
              </CustomButton>
            ) : (
              <button 
                onClick={() => { setIsEditing(false); setPreviewUrl(null); }}
                className="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Security */}
        <div className="space-y-6">
          <div className="rounded-3xl p-6" style={cardStyle}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-purple-500" />
              Account Security
            </h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              Maintain your account security by updating your password regularly. Ensure you use a strong password that is not used elsewhere.
            </p>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-purple-400 hover:bg-purple-500/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Key size={18} />
                </div>
                <span className="font-bold text-sm">Change Password</span>
              </div>
              <Save size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="rounded-3xl p-6" style={cardStyle}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-500" />
              Administrative Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Employee ID</span>
                <span className="text-white font-mono text-sm">#{profileData.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Joined Date</span>
                <span className="text-white text-sm">{formatDate(profileData.joiningDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Monthly Salary</span>
                <span className="text-green-400 font-bold">₹{profileData.salary?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Account Status</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                  {profileData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2">
          {!isEditing ? (
            <div className="space-y-8">
              {/* Personal Section */}
              <div className="rounded-3xl p-8" style={cardStyle}>
                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-purple-500 rounded-full" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InfoItem label="First Name" value={profileData.firstName} icon={<User size={16} />} />
                  <InfoItem label="Last Name" value={profileData.lastName} icon={<User size={16} />} />
                  <InfoItem label="Email Address" value={profileData.email} icon={<Mail size={16} />} />
                  <InfoItem label="Phone Number" value={profileData.phone} icon={<Phone size={16} />} />
                  <InfoItem label="Date of Birth" value={formatDate(profileData.dob)} icon={<Calendar size={16} />} />
                  <InfoItem label="Gender" value={profileData.gender} className="capitalize" icon={<User size={16} />} />
                  <InfoItem label="Blood Group" value={profileData.bloodGroup} icon={<Heart size={16} />} />
                </div>
              </div>

              {/* Address Section */}
              <div className="rounded-3xl p-8" style={cardStyle}>
                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-500 rounded-full" />
                  Residential Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <InfoItem label="Full Address" value={profileData.address} icon={<MapPin size={16} />} />
                  </div>
                  <InfoItem label="City" value={profileData.city} />
                  <InfoItem label="State" value={profileData.state} />
                  <InfoItem label="Pincode" value={profileData.pincode} />
                  <InfoItem label="Country" value={profileData.country} />
                </div>
              </div>

              {/* Emergency Section */}
              <div className="rounded-3xl p-8 border border-red-500/10 bg-red-500/[0.02]" style={{ backdropFilter: "blur(12px)" }}>
                <h3 className="text-white text-xl font-bold mb-8 flex items-center gap-3">
                  <div className="w-2 h-8 bg-red-500 rounded-full" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InfoItem label="Guardian Name" value={profileData.emergencyContact?.name} />
                  <InfoItem label="Relationship" value={profileData.emergencyContact?.relationship} />
                  <InfoItem label="Contact Number" value={profileData.emergencyContact?.phone} />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up">
              <div className="rounded-3xl p-8" style={cardStyle}>
                <h3 className="text-white text-xl font-bold mb-8">Edit Profile Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">First Name</label>
                    <input type="text" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className={inputStyle} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Last Name</label>
                    <input type="text" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className={inputStyle} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className={inputStyle} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Gender</label>
                    <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)} className={inputStyle} required>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">DOB</label>
                    <input type="date" value={formData.dob} onChange={(e) => handleInputChange("dob", e.target.value)} className={inputStyle} max={new Date().toLocaleDateString('en-CA')} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Blood Group</label>
                    <select value={formData.bloodGroup} onChange={(e) => handleInputChange("bloodGroup", e.target.value)} className={inputStyle} required>
                       {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-gray-400 font-bold text-sm mb-4 border-b border-[#1F2937] pb-2">Address Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Street Address</label>
                        <input type="text" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">City</label>
                        <input type="text" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">State</label>
                        <input type="text" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Pincode</label>
                        <input type="text" value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Country</label>
                        <input type="text" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} className={inputStyle} required />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-red-400 font-bold text-sm mb-4 border-b border-[#1F2937] pb-2">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <input type="text" placeholder="Name" value={formData.emergencyContact.name} onChange={(e) => handleEmergencyChange("name", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <input type="text" placeholder="Relationship" value={formData.emergencyContact.relationship} onChange={(e) => handleEmergencyChange("relationship", e.target.value)} className={inputStyle} required />
                      </div>
                      <div>
                        <input type="tel" placeholder="Phone" value={formData.emergencyContact.phone} onChange={(e) => handleEmergencyChange("phone", e.target.value)} className={inputStyle} required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-2xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                    Apply Changes
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <UpdatePasswordLoggedIn onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

const InfoItem = ({ label, value, icon, className = "" }) => (
  <div className="group">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
      {icon && <span className="text-gray-600 transition-colors group-hover:text-purple-500">{icon}</span>}
      {label}
    </label>
    <p className={`text-white font-medium text-lg ${className}`}>{value || "---"}</p>
  </div>
);

export default Profile;
