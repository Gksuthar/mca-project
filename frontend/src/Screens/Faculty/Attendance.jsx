import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { FiCamera, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import NoData from "../../components/NoData";

const Attendance = () => {
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [viewMode, setViewMode] = useState("mark");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  const getStudents = async () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error("Please select branch and semester");
      return;
    }

    try {
      toast.loading("Loading students...");
      const response = await axiosWrapper.post(`/student/filter`, {
        branchId: selectedBranch,
        semester: Number(selectedSemester)
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();
      
      if (response.data.success && response.data.data.length > 0) {
        setStudents(response.data.data);
        const initialAttendance = {};
        response.data.data.forEach(student => {
          initialAttendance[student._id] = "absent";
        });
        setAttendanceData(initialAttendance);
        await fetchExistingAttendance();
      } else {
        setStudents([]);
        toast.error("No students found");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error fetching students");
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const response = await axiosWrapper.get(`/attendance`, {
        params: {
          branchId: selectedBranch,
          semester: selectedSemester,
          startDate: selectedDate,
          endDate: selectedDate
        },
        headers: { Authorization: `Bearer ${userToken}` }
      });

      if (response.data.success && response.data.data.length > 0) {
        const existing = {};
        response.data.data.forEach(record => {
          existing[record.studentId._id] = record.status;
        });
        setAttendanceData(prev => ({ ...prev, ...existing }));
      }
    } catch (error) {
      console.error("Error fetching existing attendance", error);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const openCamera = async (student) => {
    setCurrentStudent(student);
    setShowCamera(true);
    
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        toast.error("Camera access denied");
        setShowCamera(false);
      }
    }, 100);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const saveWithPhoto = () => {
    if (currentStudent && capturedImage) {
      handleAttendanceChange(currentStudent._id, "present");
      closeCamera();
      toast.success(`Marked ${currentStudent.firstName} as present`);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
    setCapturedImage(null);
    setCurrentStudent(null);
  };

  const submitAttendance = async () => {
    if (students.length === 0) {
      toast.error("No students to mark attendance");
      return;
    }

    try {
      const attendancePayload = students.map(student => ({
        studentId: student._id,
        status: attendanceData[student._id] || "absent"
      }));

      toast.loading("Submitting attendance...");
      const response = await axiosWrapper.post(`/attendance/bulk`, {
        attendanceData: attendancePayload,
        date: selectedDate,
        branchId: selectedBranch,
        semester: Number(selectedSemester)
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();

      if (response.data.success) {
        toast.success("Attendance submitted successfully");
        setStudents([]);
        setAttendanceData({});
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error submitting attendance");
    }
  };

  const viewAttendance = async () => {
    if (!selectedBranch || !selectedSemester) {
      toast.error("Please select branch and semester");
      return;
    }

    try {
      toast.loading("Loading attendance...");
      const response = await axiosWrapper.get(`/attendance`, {
        params: {
          branchId: selectedBranch,
          semester: selectedSemester,
          startDate: selectedDate,
          endDate: selectedDate
        },
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

  return (
    <div className="px-6">
      <Heading title="Attendance Management" />
      
      <div className="flex gap-4 mb-6 mt-6">
        <CustomButton 
          onClick={() => setViewMode("mark")}
          variant={viewMode === "mark" ? "primary" : "secondary"}
        >
          Mark Attendance
        </CustomButton>
        <CustomButton 
          onClick={() => setViewMode("view")}
          variant={viewMode === "view" ? "primary" : "secondary"}
        >
          View Attendance
        </CustomButton>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4">
          {viewMode === "mark" ? (
            <CustomButton onClick={getStudents}>Load Students</CustomButton>
          ) : (
            <CustomButton onClick={viewAttendance}>Load Attendance</CustomButton>
          )}
        </div>
      </div>

      {viewMode === "mark" && students.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Mark Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Roll No</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Face</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{student.enrollmentNo}</td>
                    <td className="px-4 py-3">
                      {student.firstName} {student.middleName} {student.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAttendanceChange(student._id, "present")}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            attendanceData[student._id] === "present"
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          <FiCheckCircle /> Present
                        </button>
                        <button
                          onClick={() => handleAttendanceChange(student._id, "absent")}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            attendanceData[student._id] === "absent"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          <FiXCircle /> Absent
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CustomButton
                        onClick={() => openCamera(student)}
                        className="flex items-center gap-2"
                      >
                        <FiCamera /> Capture
                      </CustomButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <CustomButton onClick={submitAttendance} variant="primary">
              Submit Attendance
            </CustomButton>
          </div>
        </div>
      )}

      {viewMode === "view" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Attendance Records</h3>
          {attendanceList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Roll No</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map(record => (
                    <tr key={record._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{record.studentId?.enrollmentNo}</td>
                      <td className="px-4 py-3">
                        {record.studentId?.firstName} {record.studentId?.middleName} {record.studentId?.lastName}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData title="No attendance records found" />
          )}
        </div>
      )}

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Capture Face - {currentStudent?.firstName} {currentStudent?.lastName}
              </h3>
              <button onClick={closeCamera} className="text-2xl">
                <IoMdClose />
              </button>
            </div>
            
            {!capturedImage ? (
              <div>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  className="w-full rounded-lg mb-4"
                />
                <CustomButton onClick={capturePhoto} className="w-full">
                  <FiCamera className="mr-2" /> Capture Photo
                </CustomButton>
              </div>
            ) : (
              <div>
                <img 
                  src={capturedImage} 
                  alt="Captured" 
                  className="w-full rounded-lg mb-4"
                />
                <div className="flex gap-4">
                  <CustomButton 
                    onClick={() => setCapturedImage(null)} 
                    variant="secondary"
                    className="flex-1"
                  >
                    Retake
                  </CustomButton>
                  <CustomButton 
                    onClick={saveWithPhoto} 
                    variant="primary"
                    className="flex-1"
                  >
                    Save & Mark Present
                  </CustomButton>
                </div>
              </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
