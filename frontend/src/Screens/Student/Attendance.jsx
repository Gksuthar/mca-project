import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import NoData from "../../components/NoData";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [profileData, setProfileData] = useState(null);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        setSelectedSemester(response.data.data.semester.toString());
      }
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  const fetchAttendance = async () => {
    if (!selectedSemester) {
      toast.error("Please select a semester");
      return;
    }

    try {
      toast.loading("Loading attendance...");
      const params = { semester: selectedSemester };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosWrapper.get(`/attendance/student`, {
        params,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();

      if (response.data.success) {
        setAttendanceData(response.data.data.attendance);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error fetching attendance");
    }
  };

  const getStatusColor = (status) => {
    return status === "present" 
      ? "bg-green-100 text-green-700 border-green-300" 
      : "bg-red-100 text-red-700 border-red-300";
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="px-6">
      <Heading title="My Attendance" />

      <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <CustomButton onClick={fetchAttendance}>
            <FiCalendar className="mr-2" /> Load Attendance
          </CustomButton>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium mb-2 opacity-90">Total Days</h3>
            <p className="text-3xl font-bold">{stats.totalDays}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium mb-2 opacity-90">Present</h3>
            <p className="text-3xl font-bold">{stats.presentDays}</p>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium mb-2 opacity-90">Absent</h3>
            <p className="text-3xl font-bold">{stats.absentDays}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium mb-2 opacity-90">Percentage</h3>
            <p className="text-3xl font-bold">{stats.percentage}%</p>
          </div>
        </div>
      )}

      {attendanceData.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Attendance Records</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceData.map(record => (
              <div 
                key={record._id}
                className={`border-2 rounded-lg p-4 ${getStatusColor(record.status)}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {new Date(record.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="text-xs">{record.time || "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold capitalize">{record.status}</span>
                  {record.status === "present" ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                      ✓
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white text-xl">
                      ✗
                    </div>
                  )}
                </div>
                {record.markedBy && (
                  <div className="mt-2 text-xs opacity-75">
                    Marked by: {record.markedBy.firstName} {record.markedBy.lastName}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <NoData title="No attendance records found" />
        </div>
      )}
    </div>
  );
};

export default Attendance;
