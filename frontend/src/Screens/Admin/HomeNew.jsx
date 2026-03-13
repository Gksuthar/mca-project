import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import AdminDashboard from "../../components/AdminDashboard";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import Attendance from "./Attendance";
import Notice from "../Notice";
import Profile from "./Profile";
import Exam from "../Exam";

const AdminHome = () => {
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
      const response = await axiosWrapper.get(`/admin/my-details`, {
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
    navigate(`/admin?page=${page}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    switch (activePage) {
      case "dashboard":
        return <AdminDashboard />;
      case "profile":
        return profileData ? <Profile profileData={profileData} /> : null;
      case "students":
        return <Student />;
      case "faculty":
        return <Faculty />;
      case "branches":
        return <Branch />;
      case "subjects":
        return <Subjects />;
      case "attendance":
        return <Attendance />;
      case "notices":
        return <Notice />;
      case "exams":
        return <Exam />;
      case "admins":
        return <Admin />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="admin" activePage={activePage} onPageChange={handlePageChange} />
      
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

export default AdminHome;

