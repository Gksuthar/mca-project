import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import StudentDashboard from "../../components/StudentDashboard";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import Attendance from "./Attendance";
import Notice from "../Notice";

const StudentHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activePage, setActivePage] = useState("dashboard");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axiosWrapper.get(`/student/my-details`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching user details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get("page") || "dashboard";
    setActivePage(page);
  }, [location.search]);

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/student?page=${page}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return <StudentDashboard profileData={profileData} />;
      case "profile":
        return profileData ? <Profile profileData={profileData} /> : null;
      case "timetable":
        return <Timetable />;
      case "materials":
        return <Material />;
      case "attendance":
        return <Attendance />;
      case "marks":
        return <ViewMarks />;
      case "notices":
        return <Notice />;
      case "exams":
        return <Exam />;
      default:
        return <StudentDashboard profileData={profileData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="student" activePage={activePage} onPageChange={handlePageChange} />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <TopBar profileData={profileData} onProfileClick={() => handlePageChange('profile')} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default StudentHome;
