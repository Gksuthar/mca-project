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
      console.error(error);
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

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get("page") || "dashboard";
    setActivePage(page);
  }, [location.search]);

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/faculty?page=${page}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return <FacultyDashboard profileData={profileData} />;
      case "profile":
        return profileData ? <Profile profileData={profileData} /> : null;
      case "timetable":
        return <Timetable />;
      case "materials":
        return <Material />;
      case "attendance":
        return <AttendanceEnhanced />;
      case "students":
        return <StudentFinder />;
      case "marks":
        return <Marks />;
      case "notices":
        return <Notice />;
      case "exams":
        return <Exam />;
      default:
        return <FacultyDashboard profileData={profileData} />;
    }
  };

  const isDashboardPage = activePage === "dashboard";

  return (
    <div className="app-page-shell">
      <Sidebar userType="faculty" activePage={activePage} onPageChange={handlePageChange} />
      
      <div className="app-main-panel">
        <TopBar profileData={profileData} onProfileClick={() => handlePageChange('profile')} />
        
        <main className="app-main-content">
          <div className="app-main-container">
            {isDashboardPage ? (
              renderContent()
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {renderContent()}
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default FacultyHome;

