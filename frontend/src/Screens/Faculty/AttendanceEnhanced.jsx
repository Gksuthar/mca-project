import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import * as faceapi from "face-api.js";
import { Camera, Users, List, Image, CheckCircle, XCircle, Upload, Scan } from "lucide-react";
import CustomButton from "../../components/CustomButton";
import axiosWrapper from "../../utils/AxiosWrapper";
import { baseMediaURL } from "../../baseUrl";

const AttendanceEnhanced = () => {
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [attendanceMode, setAttendanceMode] = useState("list");
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognizedStudents, setRecognizedStudents] = useState([]);
  const [detectionResult, setDetectionResult] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const labeledDescriptorsRef = useRef([]);
  const labelMapRef = useRef({});
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranches();
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setIsModelLoading(true);
      const MODEL_URL = `${process.env.PUBLIC_URL || ""}/models`;

      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setModelsLoaded(true);
    } catch (error) {
      console.error("Model loading failed", error);
      toast.error("Could not load face models. Add model files in /public/models.");
      setModelsLoaded(false);
    } finally {
      setIsModelLoading(false);
    }
  };

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
      const response = await axiosWrapper.post(`/student/search`, {
        branchId: selectedBranch,
        semester: Number(selectedSemester)
      }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.dismiss();
      
      if (response.data.success && response.data.data.length > 0) {
        setStudents(response.data.data);
        labeledDescriptorsRef.current = [];
        labelMapRef.current = {};
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

  const openGroupCamera = async () => {
    setShowCamera(true);
    
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 } 
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

  const captureGroupPhoto = () => {
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

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });

  const detectFaces = async (image) => {
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();

    console.log(detections);
    return detections;
  };

  const getDescriptor = async (image) => {
    const result = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return result?.descriptor;
  };

  const buildLabeledDescriptors = async () => {
    if (labeledDescriptorsRef.current.length > 0) {
      return labeledDescriptorsRef.current;
    }

    const descriptors = [];
    const labels = {};

    for (const student of students) {
      if (!student.profile) {
        continue;
      }

      try {
        const image = await loadImage(`${baseMediaURL()}/${student.profile}`);
        const descriptor = await getDescriptor(image);

        if (descriptor) {
          descriptors.push(
            new faceapi.LabeledFaceDescriptors(student._id, [descriptor])
          );
          labels[student._id] = `${student.firstName} ${student.lastName}`;
        }
      } catch (error) {
        console.error("Error generating descriptor for student", student._id, error);
      }
    }

    labeledDescriptorsRef.current = descriptors;
    labelMapRef.current = labels;
    return descriptors;
  };

  const findPerson = (groupFaces, targetDescriptors) => {
    const faceMatcher = new faceapi.FaceMatcher(targetDescriptors);

    const matches = [];
    groupFaces.forEach((fd) => {
      const match = faceMatcher.findBestMatch(fd.descriptor);
      console.log(match.toString());
      matches.push(match);
    });

    return matches;
  };

  const processGroupPhoto = async () => {
    if (!capturedImage) {
      toast.error("Please capture a group photo first");
      return;
    }

    if (!modelsLoaded) {
      toast.error("Face models are not loaded yet");
      return;
    }

    setIsProcessing(true);
    setDetectionResult(null);

    try {
      const knownDescriptors = await buildLabeledDescriptors();

      if (!knownDescriptors.length) {
        toast.error("No student face descriptors found. Ensure profile photos are clear.");
        return;
      }

      const groupImage = await loadImage(capturedImage);
      const groupFaces = await detectFaces(groupImage);

      if (!groupFaces.length) {
        setRecognizedStudents([]);
        setDetectionResult({
          facesDetected: 0,
          matchedCount: 0,
          unknownCount: 0,
          matches: [],
        });
        toast.error("No faces detected in captured image");
        return;
      }

      const matches = findPerson(groupFaces, knownDescriptors);
      const matchedIds = matches
        .map((m) => m.label)
        .filter((label) => label !== "unknown");

      const uniqueIds = [...new Set(matchedIds)];
      const detected = students.filter((student) => uniqueIds.includes(student._id));
      const unknownCount = matches.filter((m) => m.label === "unknown").length;

      setRecognizedStudents(detected);
      setDetectionResult({
        facesDetected: groupFaces.length,
        matchedCount: detected.length,
        unknownCount,
        matches: detected,
      });

      const newAttendance = { ...attendanceData };
      detected.forEach((student) => {
        newAttendance[student._id] = "present";
      });
      setAttendanceData(newAttendance);

      toast.success(
        `Detected ${groupFaces.length} face(s). Matched ${detected.length} student(s).`
      );
    } catch (error) {
      console.error("Face recognition error", error);
      toast.error("Face recognition failed. Try with clearer images.");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
    setCapturedImage(null);
    setRecognizedStudents([]);
    setDetectionResult(null);
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">Smart Attendance System</h2>
        <p className="text-indigo-100">Choose your preferred method to mark attendance</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAttendanceMode("list")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
              attendanceMode === "list"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <List size={24} />
            List Mode
          </button>
          <button
            onClick={() => setAttendanceMode("group")}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
              attendanceMode === "group"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Camera size={24} />
            Group Photo Mode
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <CustomButton onClick={getStudents} className="bg-gradient-to-r from-indigo-500 to-purple-500">
            <Users className="mr-2" size={20} /> Load Students
          </CustomButton>
        </div>

        <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          {isModelLoading && "Loading face recognition models..."}
          {!isModelLoading && modelsLoaded && "Face recognition models loaded successfully."}
          {!isModelLoading && !modelsLoaded && "Face recognition models unavailable. Add model files to /public/models."}
        </div>
      </div>

      {students.length > 0 && (
        <>
          {attendanceMode === "list" ? (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <List className="text-indigo-500" />
                Mark Attendance by List
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Roll No</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 font-medium">{student.enrollmentNo}</td>
                        <td className="px-4 py-4">
                          {student.firstName} {student.middleName} {student.lastName}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleAttendanceChange(student._id, "present")}
                              className={`px-6 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                                attendanceData[student._id] === "present"
                                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <CheckCircle size={18} /> Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(student._id, "absent")}
                              className={`px-6 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all ${
                                attendanceData[student._id] === "absent"
                                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <XCircle size={18} /> Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Camera className="text-purple-500" />
                Mark Attendance by Group Photo
              </h3>
              
              {!showCamera ? (
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <Image size={48} className="text-purple-500" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Take a Group Photo</h4>
                  <p className="text-gray-600 mb-6">Capture all students in one photo and let AI detect them automatically</p>
                  <CustomButton
                    onClick={openGroupCamera}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500"
                  >
                    <Camera className="mr-2" size={20} /> Open Camera
                  </CustomButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {!capturedImage ? (
                    <>
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        className="w-full rounded-xl shadow-lg"
                      />
                      <CustomButton
                        onClick={captureGroupPhoto}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      >
                        <Camera className="mr-2" size={20} /> Capture Photo
                      </CustomButton>
                    </>
                  ) : (
                    <>
                      <img 
                        src={capturedImage} 
                        alt="Group" 
                        className="w-full rounded-xl shadow-lg"
                      />
                      {detectionResult && (
                        <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-4">
                          <h4 className="mb-3 flex items-center gap-2 font-semibold text-indigo-800">
                            <CheckCircle className="text-indigo-600" />
                            Detection Summary
                          </h4>

                          <div className="mb-3 grid grid-cols-1 gap-2 text-sm text-indigo-900 md:grid-cols-3">
                            <p>
                              Faces detected: <span className="font-semibold">{detectionResult.facesDetected}</span>
                            </p>
                            <p>
                              Students matched: <span className="font-semibold">{detectionResult.matchedCount}</span>
                            </p>
                            <p>
                              Unknown faces: <span className="font-semibold">{detectionResult.unknownCount}</span>
                            </p>
                          </div>

                          {detectionResult.matches.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {detectionResult.matches.map((student) => (
                                <span
                                  key={student._id}
                                  className="rounded-lg bg-green-200 px-3 py-1 text-sm font-medium text-green-800"
                                >
                                  {student.firstName} {student.lastName} ({student.enrollmentNo})
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-red-600">
                              No student matched. Make sure student profile photos are clear and front-facing.
                            </p>
                          )}
                        </div>
                      )}
                      <div className="flex gap-4">
                        <CustomButton
                          onClick={() => {
                            setCapturedImage(null);
                            setRecognizedStudents([]);
                            setDetectionResult(null);
                          }}
                          variant="secondary"
                          className="flex-1"
                        >
                          Retake
                        </CustomButton>
                        {!recognizedStudents.length ? (
                          <CustomButton
                            onClick={processGroupPhoto}
                            variant="primary"
                            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500"
                            disabled={isProcessing || !modelsLoaded}
                          >
                            {isProcessing ? (
                              <>
                                <Scan className="mr-2 animate-spin" size={20} />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Scan className="mr-2" size={20} />
                                Detect Students
                              </>
                            )}
                          </CustomButton>
                        ) : (
                          <CustomButton
                            onClick={closeCamera}
                            variant="primary"
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
                          >
                            <CheckCircle className="mr-2" size={20} />
                            Confirm & Continue
                          </CustomButton>
                        )}
                      </div>
                    </>
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <CustomButton
              onClick={submitAttendance}
              className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 text-lg"
            >
              <Upload className="mr-2" size={20} />
              Submit Attendance
            </CustomButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceEnhanced;

