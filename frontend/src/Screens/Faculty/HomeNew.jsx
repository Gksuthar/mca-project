import React, { useCallback, useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import FacultyDashboard from "../../components/FacultyDashboard";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import AttendanceEnhanced from "./AttendanceEnhanced";
import Notice from "../Notice";
import Exam from "../Exam";

const pageTitles = {
  dashboard: "Dashboard",
  profile: "Profile",
  timetable: "Timetable",
  materials: "Study Materials",
  attendance: "Attendance",
  students: "Student Finder",
  marks: "Marks Entry",
  notices: "Notices",
  exams: "Examinations",
};

const FacultyHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState("dashboard");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get("/faculty/my-details", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/");
        return;
      }
      setProfileData((prev) => prev || { firstName: "Faculty", email: "" });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, navigate, userToken]);

  useEffect(() => { fetchUserDetails(); }, [fetchUserDetails]);
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("page") || "dashboard";
    setActivePage(p);
  }, [location.search]);

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/faculty?page=${page}`);
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-60"><div className="animate-spin rounded-full h-8 w-8" style={{ border: "2px solid #1F2937", borderTop: "2px solid #E85D04" }} /></div>;
    switch (activePage) {
      case "dashboard": return <FacultyDashboard profileData={profileData} />;
      case "profile": return profileData ? <Profile profileData={profileData} /> : null;
      case "timetable": return <Timetable />;
      case "materials": return <Material />;
      case "attendance": return <AttendanceEnhanced />;
      case "students": return <StudentFinder />;
      case "marks": return <Marks />;
      case "notices": return <Notice />;
      case "exams": return <Exam />;
      default: return <FacultyDashboard profileData={profileData} />;
    }
  };

  return (
    <div className="app-page-shell">
      <Sidebar userType="faculty" activePage={activePage} onPageChange={handlePageChange} />
      <div className="app-main-panel">
        <TopBar title={pageTitles[activePage] || "Dashboard"} profileData={profileData} onProfileClick={() => handlePageChange("profile")} />
        <main className="app-main-content">
          <div className="app-main-container">
            {activePage === "dashboard" ? renderContent() : (
              <div className="rounded-lg p-5" style={{ background: "#111827", border: "1px solid #1F2937" }}>
                {renderContent()}
              </div>
            )}
          </div>
        </main>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1F2937", color: "#F3F4F6", border: "1px solid #374151", fontSize: 13 } }} />
    </div>
  );
};

export default FacultyHome;
