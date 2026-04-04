import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Users, BookOpen, Calendar, FileText,
  Bell, BarChart3, Settings, LogOut, Menu, X,
  UserCheck, GraduationCap, Building2, ChevronRight, Shield
} from "lucide-react";

const THEME = {
  admin: {
    sidebarBg: "#101828",
    sidebarBorder: "#1D2939",
    headerBg: "#0C111D",
    activeBg: "#1D2939",
    activeText: "#FFFFFF",
    activeIndicator: "#7C3AED",
    inactiveText: "#98A2B3",
    hoverBg: "#1D293920",
    logoBg: "linear-gradient(135deg, #7C3AED, #5B21B6)",
    label: "ADMIN",
    sublabel: "System Control",
  },
  faculty: {
    sidebarBg: "#1A1A2E",
    sidebarBorder: "#25254B",
    headerBg: "#141428",
    activeBg: "#25254B",
    activeText: "#FFFFFF",
    activeIndicator: "#E85D04",
    inactiveText: "#8888AA",
    hoverBg: "#25254B30",
    logoBg: "linear-gradient(135deg, #E85D04, #CC4D03)",
    label: "FACULTY",
    sublabel: "Teaching Hub",
  },
  student: {
    sidebarBg: "#0D1F22",
    sidebarBorder: "#1A3A3F",
    headerBg: "#091519",
    activeBg: "#1A3A3F",
    activeText: "#FFFFFF",
    activeIndicator: "#06D6A0",
    inactiveText: "#6B8A8E",
    hoverBg: "#1A3A3F30",
    logoBg: "linear-gradient(135deg, #06D6A0, #05A87E)",
    label: "STUDENT",
    sublabel: "Learning Portal",
  },
};

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
  ],
};

const Sidebar = ({ userType, activePage, onPageChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const t = THEME[userType] || THEME.admin;
  const items = menuItems[userType] || [];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const w = collapsed ? 76 : 260;

  return (
    <div
      className="fixed left-0 top-0 z-50 flex flex-col transition-all duration-300"
      style={{
        width: w,
        height: "100vh",
        background: t.sidebarBg,
        borderRight: `1px solid ${t.sidebarBorder}`,
      }}
    >
      {/* ─── Header ─── */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{
          background: t.headerBg,
          borderBottom: `1px solid ${t.sidebarBorder}`,
          minHeight: 72,
        }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: t.logoBg }}
        >
          <GraduationCap size={20} color="#fff" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold tracking-[0.12em]" style={{ color: t.activeIndicator }}>
              {t.label}
            </p>
            <p className="text-xs" style={{ color: t.inactiveText }}>
              {t.sublabel}
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-md transition-colors"
          style={{ color: t.inactiveText }}
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {!collapsed && (
          <p
            className="text-[10px] font-semibold tracking-[0.14em] px-3 mb-3 mt-1"
            style={{ color: t.inactiveText, opacity: 0.5 }}
          >
            MENU
          </p>
        )}
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all duration-150 ${
                    collapsed ? "justify-center px-0 py-3" : "px-3 py-3"
                  }`}
                  style={{
                    background: active ? t.activeBg : "transparent",
                    color: active ? t.activeText : t.inactiveText,
                    borderLeft: active
                      ? `3px solid ${t.activeIndicator}`
                      : "3px solid transparent",
                  }}
                  title={collapsed ? item.label : undefined}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = t.hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Logout ─── */}
      <div className="px-2.5 pb-4 pt-2" style={{ borderTop: `1px solid ${t.sidebarBorder}` }}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-lg py-2.5 transition-colors ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
          style={{ color: "#EF4444" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-[13px] font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
