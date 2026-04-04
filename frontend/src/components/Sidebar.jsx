import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, Users, BookOpen, Calendar, FileText, 
  Bell, BarChart3, Settings, LogOut, Menu, X,
  UserCheck, GraduationCap, Building2
} from "lucide-react";

const Sidebar = ({ userType, activePage, onPageChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", id: "dashboard" },
      { icon: Users, label: "Students", id: "students" },
      { icon: GraduationCap, label: "Faculty", id: "faculty" },
      { icon: Building2, label: "Branches", id: "branches" },
      { icon: BookOpen, label: "Subjects", id: "subjects" },
      { icon: UserCheck, label: "Attendance", id: "attendance" },
      { icon: FileText, label: "Exams", id: "exams" },
      { icon: Bell, label: "Notices", id: "notices" },
      { icon: Settings, label: "Admins", id: "admins" },
    ],
    faculty: [
      { icon: Home, label: "Dashboard", id: "dashboard" },
      { icon: Calendar, label: "Timetable", id: "timetable" },
      { icon: UserCheck, label: "Attendance", id: "attendance" },
      { icon: BarChart3, label: "Marks", id: "marks" },
      { icon: Users, label: "Students", id: "students" },
      { icon: BookOpen, label: "Materials", id: "materials" },
      { icon: FileText, label: "Exams", id: "exams" },
      { icon: Bell, label: "Notices", id: "notices" },
    ],
    student: [
      { icon: Home, label: "Dashboard", id: "dashboard" },
      { icon: Calendar, label: "Timetable", id: "timetable" },
      { icon: UserCheck, label: "Attendance", id: "attendance" },
      { icon: BarChart3, label: "Marks", id: "marks" },
      { icon: BookOpen, label: "Materials", id: "materials" },
      { icon: FileText, label: "Exams", id: "exams" },
      { icon: Bell, label: "Notices", id: "notices" },
    ]
  };

  const items = menuItems[userType] || [];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-800`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">EduTrack</h1>
              <p className="text-xs text-slate-400">Management System</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={index}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-slate-100 text-slate-900 shadow-sm' 
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 hover:text-red-100 transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

