import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Users, BookOpen, UserCheck, Building2, TrendingUp, Activity } from "lucide-react";
import axiosWrapper from "../utils/AxiosWrapper";

const PURPLE = "#7C3AED";
const PURPLE_L = "#8B5CF6";
const CARD = "#111827";
const BORDER = "#1F2937";
const TXT = "#F3F4F6";
const TXT2 = "#9CA3AF";
const TXT3 = "#6B7280";
const tp = {
  contentStyle: { background: "#1F2937", border: `1px solid #374151`, borderRadius: 8, color: TXT },
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalStudents: 0, totalFaculty: 0, totalBranches: 0, totalSubjects: 0 });
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, f, b, sub] = await Promise.all([
        axiosWrapper.post("/student/search", {}, { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.post("/faculty/filter", {}, { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/branch", { headers: { Authorization: `Bearer ${userToken}` } }),
        axiosWrapper.get("/subject", { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);
      const studentList = s.data.data?.students || s.data.data || [];
      const facultyList = f.data.data?.faculty || f.data.data || [];
      const branchList = b.data.data || [];
      const subjectList = sub.data.data || [];

      setStats({
        totalStudents: Array.isArray(studentList) ? studentList.length : 0,
        totalFaculty: Array.isArray(facultyList) ? facultyList.length : 0,
        totalBranches: Array.isArray(branchList) ? branchList.length : 0,
        totalSubjects: Array.isArray(subjectList) ? subjectList.length : 0,
      });
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const attendanceData = [
    { d: "Mon", present: 120, absent: 10 }, { d: "Tue", present: 125, absent: 5 },
    { d: "Wed", present: 118, absent: 12 }, { d: "Thu", present: 130, absent: 2 },
    { d: "Fri", present: 115, absent: 15 },
  ];
  const branchData = [
    { name: "CSE", value: 45, color: "#7C3AED" }, { name: "ECE", value: 30, color: "#A78BFA" },
    { name: "ME", value: 15, color: "#C4B5FD" }, { name: "CE", value: 5, color: "#DDD6FE" },
    { name: "EE", value: 5, color: "#EDE9FE" },
  ];
  const perfData = [
    { m: "Jan", v: 75 }, { m: "Feb", v: 78 }, { m: "Mar", v: 82 },
    { m: "Apr", v: 85 }, { m: "May", v: 83 }, { m: "Jun", v: 88 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-8 w-8" style={{ border: `2px solid ${BORDER}`, borderTop: `2px solid ${PURPLE}` }} />
      </div>
    );
  }

  const metrics = [
    { icon: Users, label: "Students", val: stats.totalStudents, delta: "+12", bg: "#7C3AED" },
    { icon: Users, label: "Faculty", val: stats.totalFaculty, delta: "+3", bg: "#8B5CF6" },
    { icon: BookOpen, label: "Subjects", val: stats.totalSubjects, delta: "0", bg: "#A78BFA" },
    { icon: Building2, label: "Branches", val: stats.totalBranches, delta: "0", bg: "#6D28D9" },
    { icon: UserCheck, label: "Attendance", val: "85%", delta: "+3.5%", bg: "#5B21B6" },
    { icon: Activity, label: "Pass Rate", val: "95%", delta: "+1.2%", bg: "#4C1D95" },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Metric strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between mb-3">
              <m.icon size={16} style={{ color: m.bg }} />
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${m.bg}15`, color: m.bg }}>{m.delta}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: TXT }}>{m.val}</p>
            <p className="text-[11px] mt-0.5" style={{ color: TXT3 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Bar */}
        <div className="lg:col-span-2 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: TXT }}>Weekly Attendance</p>
            <span className="text-[10px] px-2 py-1 rounded-md" style={{ background: `${PURPLE}15`, color: PURPLE }}>This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="d" stroke={TXT3} fontSize={11} tickLine={false} />
              <YAxis stroke={TXT3} fontSize={11} tickLine={false} />
              <Tooltip {...tp} />
              <Bar dataKey="present" fill={PURPLE} radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Pie */}
        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>Branch Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={branchData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke={CARD} strokeWidth={3}>
                {branchData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip {...tp} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {branchData.map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                <span className="text-[10px]" style={{ color: TXT3 }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Performance Area ── */}
      <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: TXT }}>Performance Trend</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={14} style={{ color: "#22C55E" }} />
            <span className="text-xs font-medium" style={{ color: "#22C55E" }}>+4.2%</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={perfData}>
            <defs>
              <linearGradient id="purpleG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PURPLE} stopOpacity={0.25} />
                <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="m" stroke={TXT3} fontSize={11} tickLine={false} />
            <YAxis stroke={TXT3} fontSize={11} tickLine={false} />
            <Tooltip {...tp} />
            <Area type="monotone" dataKey="v" stroke={PURPLE} strokeWidth={2} fillOpacity={1} fill="url(#purpleG)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
