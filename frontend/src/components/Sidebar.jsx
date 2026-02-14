import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Home, Users, BookOpen, Calendar, FileText, 
  Bell, BarChart3, Settings, LogOut, Menu, X,
  UserCheck, GraduationCap, Building2
} from "lucide-react";

const Sidebar = ({ userType }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "Students", path: "/admin?page=student" },
      { icon: GraduationCap, label: "Faculty", path: "/admin?page=faculty" },
      { icon: Building2, label: "Branches", path: "/admin?page=branch" },
      { icon: BookOpen, label: "Subjects", path: "/admin?page=subjects" },
      { icon: UserCheck, label: "Attendance", path: "/admin?page=attendance" },
      { icon: FileText, label: "Exams", path: "/admin?page=exam" },
      { icon: Bell, label: "Notices", path: "/admin?page=notice" },
      { icon: Settings, label: "Admin", path: "/admin?page=admin" },
    ],
    faculty: [
      { icon: Home, label: "Dashboard", path: "/faculty" },
      { icon: Calendar, label: "Timetable", path: "/faculty?page=timetable" },
      { icon: UserCheck, label: "Attendance", path: "/faculty?page=attendance" },
      { icon: BarChart3, label: "Marks", path: "/faculty?page=marks" },
      { icon: Users, label: "Students", path: "/faculty?page=student info" },
      { icon: BookOpen, label: "Material", path: "/faculty?page=material" },
      { icon: FileText, label: "Exams", path: "/faculty?page=exam" },
      { icon: Bell, label: "Notices", path: "/faculty?page=notice" },
    ],
    student: [
      { icon: Home, label: "Dashboard", path: "/student" },
      { icon: Calendar, label: "Timetable", path: "/student?page=timetable" },
      { icon: UserCheck, label: "Attendance", path: "/student?page=attendance" },
      { icon: BarChart3, label: "Marks", path: "/student?page=marks" },
      { icon: BookOpen, label: "Material", path: "/student?page=material" },
      { icon: FileText, label: "Exams", path: "/student?page=exam" },
      { icon: Bell, label: "Notices", path: "/student?page=notice" },
    ]
  };

  const items = menuItems[userType] || [];

  const isActive = (path) => {
    if (path.includes('?page=')) {
      const page = path.split('?page=')[1];
      return location.search.includes(page);
    }
    return location.pathname === path && !location.search;
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 text-white transition-all duration-300 flex flex-col fixed left-0 top-0 z-50 shadow-2xl`}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg">EduTrack</h1>
              <p className="text-xs text-white/60">Management System</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {items.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg scale-105' 
                    : 'hover:bg-white/10 text-white/80 hover:text-white'
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

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white transition-all"
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
