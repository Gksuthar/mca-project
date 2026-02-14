import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiCalendar, FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import NoData from "../../components/NoData";

const Attendance = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [viewMode, setViewMode] = useState("stats");
  const [attendanceList, setAttendanceList] = useState([]);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching branches");
    }
  };

  const fetchAttendanceStats = async () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error("Please select branch and semester");
      return;
    }

    try {
      toast.loading("Loading attendance stats...");
      const params = {
        branchId: selectedBranch,
        semester: selectedSemester
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosWrapper.get(`/attendance/stats`, {
        params,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();

      if (response.data.success) {
        setAttendanceStats(response.data.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error fetching stats");
    }
  };

  const fetchAttendanceList = async () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error("Please select branch and semester");
      return;
    }

    try {
      toast.loading("Loading attendance...");
      const params = {
        branchId: selectedBranch,
        semester: selectedSemester
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axiosWrapper.get(`/attendance`, {
        params,
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();

      if (response.data.success) {
        setAttendanceList(response.data.data);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error fetching attendance");
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const exportToCSV = () => {
    if (viewMode === "stats" && attendanceStats.length > 0) {
      const headers = ["Roll No", "Name", "Total Days", "Present", "Absent", "Percentage"];
      const rows = attendanceStats.map(stat => [
        stat.student.enrollmentNo,
        `${stat.student.firstName} ${stat.student.middleName || ""} ${stat.student.lastName}`,
        stat.totalDays,
        stat.presentDays,
        stat.absentDays,
        `${stat.percentage}%`
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendance_stats_${Date.now()}.csv`;
      a.click();
      toast.success("Exported successfully");
    }
  };

  return (
    <div className="px-6">
      <Heading title="Attendance Reports" />

      <div className="flex gap-4 mb-6 mt-6">
        <CustomButton 
          onClick={() => setViewMode("stats")}
          variant={viewMode === "stats" ? "primary" : "secondary"}
        >
          Statistics
        </CustomButton>
        <CustomButton 
          onClick={() => setViewMode("list")}
          variant={viewMode === "list" ? "primary" : "secondary"}
        >
          Detailed List
        </CustomButton>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
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
        
        <div className="mt-4 flex gap-4">
          {viewMode === "stats" ? (
            <CustomButton onClick={fetchAttendanceStats}>
              <FiCalendar className="mr-2" /> Load Stats
            </CustomButton>
          ) : (
            <CustomButton onClick={fetchAttendanceList}>
              <FiCalendar className="mr-2" /> Load List
            </CustomButton>
          )}
          
          {viewMode === "stats" && attendanceStats.length > 0 && (
            <CustomButton onClick={exportToCSV} variant="secondary">
              <FiDownload className="mr-2" /> Export CSV
            </CustomButton>
          )}
        </div>
      </div>

      {viewMode === "stats" && attendanceStats.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Student-wise Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-center">Total Days</th>
                  <th className="px-4 py-3 text-center">Present</th>
                  <th className="px-4 py-3 text-center">Absent</th>
                  <th className="px-4 py-3 text-center">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {attendanceStats.map(stat => (
                  <tr key={stat.student._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{stat.student.enrollmentNo}</td>
                    <td className="px-4 py-3">
                      {stat.student.firstName} {stat.student.middleName || ""} {stat.student.lastName}
                    </td>
                    <td className="px-4 py-3 text-center">{stat.totalDays}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {stat.presentDays}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {stat.absentDays}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-lg font-bold ${getPercentageColor(stat.percentage)}`}>
                        {stat.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "list" && attendanceList.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Attendance Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">Marked By</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map(record => (
                  <tr key={record._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {new Date(record.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">{record.studentId?.enrollmentNo}</td>
                    <td className="px-4 py-3">
                      {record.studentId?.firstName} {record.studentId?.middleName || ""} {record.studentId?.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        record.status === "present" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{record.time || "-"}</td>
                    <td className="px-4 py-3">
                      {record.markedBy ? `${record.markedBy.firstName} ${record.markedBy.lastName}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {((viewMode === "stats" && attendanceStats.length === 0) || 
        (viewMode === "list" && attendanceList.length === 0)) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <NoData title="No attendance data found" />
        </div>
      )}
    </div>
  );
};

export default Attendance;
