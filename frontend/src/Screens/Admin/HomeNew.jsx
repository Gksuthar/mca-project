import React, { useCallback, useEffect, useState } from "react";
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

const pageTitles = {
  dashboard: "Dashboard",
  profile: "Profile",
  students: "Student Management",
  faculty: "Faculty Management",
  branches: "Branch Management",
  subjects: "Subject Management",
  attendance: "Attendance",
  notices: "Notices",
  exams: "Examinations",
  admins: "Admin Management",
};

const AdminHome = () => {
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
      const response = await axiosWrapper.get(`/admin/my-details`, {
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
      setProfileData((prev) => prev || { firstName: "Admin", email: "" });
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
    navigate(`/admin?page=${page}`);
  };

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-60"><div className="animate-spin rounded-full h-8 w-8" style={{ border: "2px solid #1F2937", borderTop: "2px solid #7C3AED" }} /></div>;
    switch (activePage) {
      case "dashboard": return <AdminDashboard />;
      case "profile": return profileData ? <Profile profileData={profileData} /> : null;
      case "students": return <Student />;
      case "faculty": return <Faculty />;
      case "branches": return <Branch />;
      case "subjects": return <Subjects />;
      case "attendance": return <Attendance />;
      case "notices": return <Notice />;
      case "exams": return <Exam />;
      case "admins": return <Admin />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="app-page-shell">
      <Sidebar userType="admin" activePage={activePage} onPageChange={handlePageChange} />
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

export default AdminHome;
