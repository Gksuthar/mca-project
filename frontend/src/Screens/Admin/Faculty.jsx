import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { IoMdAdd, IoMdClose, IoMdEye, IoMdEyeOff } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import { baseMediaURL } from "../../baseUrl";

const Faculty = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    bloodGroup: "",
    branchId: "",
  });

  const [branches, setBranches] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [searchParams, setSearchParams] = useState({ name: "", email: "", branchId: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const getBranchHandler = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching branches");
      }
    } finally {
      setDataLoading(false);
    }
  }, [userToken]);

  const getFacultyHandler = useCallback(async (page = 1) => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/faculty?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        const facultyList = response.data.data?.faculty || response.data.data || [];
        setFaculty(Array.isArray(facultyList) ? facultyList : []);
        setCurrentPage(response.data.data?.currentPage || 1);
        setTotalPages(response.data.data?.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching faculty");
    } finally {
      setDataLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    getFacultyHandler();
    getBranchHandler();
  }, [getFacultyHandler, getBranchHandler]);

  const addFacultyHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Faculty" : "Adding Faculty");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      };

      const formData = new FormData();
      for (const key in data) {
        if (key === "emergencyContact") {
          for (const subKey in data.emergencyContact) {
            formData.append(
              `emergencyContact[${subKey}]`,
              data.emergencyContact[subKey]
            );
          }
        } else {
          formData.append(key, data[key]);
        }
      }

      if (file) {
        formData.append("file", file);
      }

      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/faculty/${selectedFacultyId}`,
          formData,
          {
            headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/faculty/register`, formData, {
          headers,
        });
      }

      toast.dismiss();
      if (response.data.success) {
        if (!isEditing) {
          toast.success(
            `Faculty created successfully! Default password: faculty123`
          );
        } else {
          toast.success(response.data.message);
        }
        resetForm();
        getFacultyHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const deleteFacultyHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedFacultyId(id);
  };

  const editFacultyHandler = (faculty) => {
    setData({
      firstName: faculty.firstName || "",
      lastName: faculty.lastName || "",
      email: faculty.email || "",
      phone: faculty.phone || "",
      profile: faculty.profile || "",
      address: faculty.address || "",
      city: faculty.city || "",
      state: faculty.state || "",
      pincode: faculty.pincode || "",
      country: faculty.country || "",
      gender: faculty.gender || "",
      dob: faculty.dob?.split("T")[0] || "",
      designation: faculty.designation || "",
      joiningDate: faculty.joiningDate?.split("T")[0] || "",
      salary: faculty.salary || "",
      status: faculty.status || "active",
      emergencyContact: {
        name: faculty.emergencyContact?.name || "",
        relationship: faculty.emergencyContact?.relationship || "",
        phone: faculty.emergencyContact?.phone || "",
      },
      bloodGroup: faculty.bloodGroup || "",
      branchId: faculty.branchId?._id || faculty.branchId || "",
    });
    setSelectedFacultyId(faculty._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Faculty");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axiosWrapper.delete(
        `/faculty/${selectedFacultyId}`,
        {
          headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Faculty has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getFacultyHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const handleEmergencyContactChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      profile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gender: "",
      dob: "",
      designation: "",
      joiningDate: "",
      salary: "",
      status: "active",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      bloodGroup: "",
      branchId: "",
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFacultyId(null);
  };

  const handleInputChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const searchFaculty = async (e, page = 1) => {
    if (e) e.preventDefault();
    setDataLoading(true);
    setHasSearched(true);
    try {
      const response = await axiosWrapper.post(
        `/faculty/filter?page=${page}&limit=10`,
        searchParams,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (response.data.success) {
        const facultyList = response.data.data?.faculty || response.data.data || [];
        setFaculty(Array.isArray(facultyList) ? facultyList : []);
        setCurrentPage(response.data.data?.currentPage || 1);
        setTotalPages(response.data.data?.totalPages || 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching faculty");
    } finally {
      setDataLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (hasSearched) {
        searchFaculty(null, newPage);
      } else {
        getFacultyHandler(newPage);
      }
    }
  };

  const resetSearch = () => {
    setSearchParams({ name: "", email: "", branchId: "" });
    setHasSearched(false);
    getFacultyHandler(1);
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full mb-8">
        <Heading title="Faculty Management" />
        <CustomButton
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-900">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
             <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoMdClose className="text-2xl" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">
              {isEditing ? "Edit Faculty" : "Add New Faculty"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFacultyHandler();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                   <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full px-4 py-2 border rounded-md" accept="image/*" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={data.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={data.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={data.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    <select value={data.branchId} onChange={(e) => handleInputChange("branchId", e.target.value)} className="w-full px-4 py-2 border rounded-md" required>
                      <option value="">Select Branch</option>
                      {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={data.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                       <input type={showPassword ? "text" : "password"} value={data.password} onChange={(e) => handleInputChange("password", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {showPassword ? <IoMdEyeOff /> : <IoMdEye />}
                       </button>
                    </div>
                  </div>
                )}
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select value={data.gender} onChange={(e) => handleInputChange("gender", e.target.value)} className="w-full px-4 py-2 border rounded-md" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" value={data.dob} onChange={(e) => handleInputChange("dob", e.target.value)} max={new Date().toLocaleDateString('en-CA')} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                   <input type="text" value={data.designation} onChange={(e) => handleInputChange("designation", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                   <input type="number" value={data.salary} onChange={(e) => handleInputChange("salary", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={data.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={data.city} onChange={(e) => handleInputChange("city", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={data.state} onChange={(e) => handleInputChange("state", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" value={data.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input type="text" value={data.country} onChange={(e) => handleInputChange("country", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold my-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Name" value={data.emergencyContact.name} onChange={(e) => handleEmergencyContactChange("name", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                    <input type="text" placeholder="Relationship" value={data.emergencyContact.relationship} onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                    <input type="tel" placeholder="Phone" value={data.emergencyContact.phone} onChange={(e) => handleEmergencyContactChange("phone", e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                  <CustomButton type="button" variant="secondary" onClick={resetForm}>Cancel</CustomButton>
                  <CustomButton type="submit" variant="primary">{isEditing ? "Update Faculty" : "Add Faculty"}</CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {dataLoading && <Loading />}

      {!dataLoading && !showAddForm && (
        <div className="w-full mt-5">
          <div className="bg-[#111827] p-6 rounded-lg border border-[#1F2937] mb-8">
            <h3 className="text-white text-lg font-medium mb-4">Filter Faculty</h3>
            <form onSubmit={searchFaculty} className="flex flex-wrap gap-4">
              <input type="text" placeholder="Search by Name" className="flex-1 min-w-[200px] bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2 text-white outline-none" value={searchParams.name} onChange={e => setSearchParams({...searchParams, name: e.target.value})} />
              <select className="flex-1 min-w-[200px] bg-[#1F2937] border border-[#374151] rounded-lg px-4 py-2 text-white outline-none" value={searchParams.branchId} onChange={e => setSearchParams({...searchParams, branchId: e.target.value})}>
                 <option value="">All Branches</option>
                 {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
              <CustomButton type="submit" variant="primary">Search</CustomButton>
              {hasSearched && <button type="button" onClick={resetSearch} className="text-gray-400 hover:text-white transition-colors">Clear</button>}
            </form>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#1F2937]">
            <table className="text-sm min-w-full bg-[#111827]">
              <thead>
                <tr className="bg-[#1F2937] text-[#F3F4F6]">
                  <th className="py-4 px-6 text-left font-semibold">Profile</th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Email</th>
                  <th className="py-4 px-6 text-left font-semibold">Branch</th>
                  <th className="py-4 px-6 text-left font-semibold">Designation</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2937]">
                {faculty && faculty.length > 0 ? (
                  faculty.map((item, index) => (
                    <tr key={index} className="hover:bg-[#1F2937]/50 text-[#9CA3AF]">
                      <td className="py-3 px-6">
                         <img 
                          src={`${baseMediaURL()}/${item.profile}`} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover border border-[#374151]"
                          onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + item.firstName + "+" + item.lastName}
                        />
                      </td>
                      <td className="py-4 px-6 font-medium text-[#F3F4F6]">{`${item.firstName} ${item.lastName}`}</td>
                      <td className="py-4 px-6">{item.email}</td>
                      <td className="py-4 px-6">{item.branchId?.name || "N/A"}</td>
                      <td className="py-4 px-6">{item.designation}</td>
                      <td className="py-4 px-6 text-center">
                         <div className="flex justify-center gap-3">
                           <button onClick={() => setViewData(item)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><MdRemoveRedEye size={18} /></button>
                           <button onClick={() => editFacultyHandler(item)} className="p-2 bg-purple-500/10 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition-all"><MdEdit size={18} /></button>
                           <button onClick={() => deleteFacultyHandler(item._id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><MdOutlineDelete size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-10 text-gray-500">No faculty found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
             <div className="flex justify-center items-center mt-6 gap-3">
               <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 rounded-lg bg-[#1F2937] text-[#F3F4F6] border border-[#374151] disabled:opacity-50">Previous</button>
               <span className="text-[#9CA3AF]">Page <span className="text-[#F3F4F6] font-medium">{currentPage}</span> of {totalPages}</span>
               <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg bg-[#1F2937] text-[#F3F4F6] border border-[#374151] disabled:opacity-50">Next</button>
             </div>
          )}
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this faculty?"
      />

      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-gray-900">
           <div className="bg-white rounded-lg p-8 w-[90%] max-w-2xl relative">
            <button
              onClick={() => setViewData(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoMdClose className="text-2xl" />
            </button>
            <h2 className="text-2xl font-semibold mb-6">Faculty Details</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={`${import.meta.env.VITE_MEDIA_URL}/${viewData.profile}`} 
                  alt="Profile" 
                  className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                  onError={(e) => e.target.src = "https://ui-avatars.com/api/?name=" + viewData.firstName + "+" + viewData.lastName}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Name:</strong> {viewData.firstName} {viewData.lastName}</p>
                  <p><strong>Email:</strong> {viewData.email}</p>
                  <p><strong>Phone:</strong> {viewData.phone}</p>
                  <p><strong>Employee ID:</strong> {viewData.employeeId}</p>
                  <p><strong>Branch:</strong> {viewData.branchId?.name}</p>
                  <p><strong>Designation:</strong> {viewData.designation}</p>
                  <p><strong>DOB:</strong> {viewData.dob ? viewData.dob.split("T")[0] : "N/A"}</p>
                  <p><strong>Gender:</strong> {viewData.gender}</p>
                  <p><strong>Joining Date:</strong> {viewData.joiningDate ? viewData.joiningDate.split("T")[0] : "N/A"}</p>
                  <p><strong>Salary:</strong> {viewData.salary}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Location:</h3>
                  <p>{viewData.address}</p>
                </div>

                {viewData.emergencyContact && (
                   <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Emergency Contact:</h3>
                    <p><strong>Name:</strong> {viewData.emergencyContact.name}</p>
                    <p><strong>Relationship:</strong> {viewData.emergencyContact.relationship}</p>
                    <p><strong>Phone:</strong> {viewData.emergencyContact.phone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;

