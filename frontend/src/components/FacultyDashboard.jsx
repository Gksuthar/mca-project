import React from "react";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, BookOpen, Calendar, Clock, FileText,
  CheckCircle, AlertTriangle, ChevronRight,
} from "lucide-react";

const ORANGE = "#E85D04";
const ORANGE_L = "#F97316";
const CARD = "#111827";
const BORDER = "#1F2937";
const TXT = "#F3F4F6";
const TXT2 = "#9CA3AF";
const TXT3 = "#6B7280";
const tp = {
  contentStyle: { background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: TXT },
};

const FacultyDashboard = ({ profileData }) => {
  const classesData = [
    { day: "Mon", val: 4 }, { day: "Tue", val: 3 }, { day: "Wed", val: 5 },
    { day: "Thu", val: 3 }, { day: "Fri", val: 4 },
  ];
  const attendanceTrend = [
    { w: "W1", rate: 82 }, { w: "W2", rate: 85 }, { w: "W3", rate: 88 },
    { w: "W4", rate: 86 }, { w: "W5", rate: 90 },
  ];

  const upcoming = [
    { time: "10:00 AM", subject: "Data Structures", room: "301", students: 45 },
    { time: "02:00 PM", subject: "DBMS", room: "205", students: 48 },
    { time: "04:00 PM", subject: "Operating Systems", room: "Lab 102", students: 42 },
  ];

  const tasks = [
    { task: "Grade DSA Mid-Term Papers", priority: "high", due: "Today" },
    { task: "Upload Study Material for OS", priority: "medium", due: "Tomorrow" },
    { task: "Prepare DBMS Quiz Questions", priority: "low", due: "3 days" },
    { task: "Review Student Assignments", priority: "medium", due: "2 days" },
  ];

  const subjects = [
    { name: "Data Structures", avg: 85, students: 45, trend: "+3" },
    { name: "DBMS", avg: 78, students: 48, trend: "-1" },
    { name: "Operating Systems", avg: 82, students: 42, trend: "+5" },
    { name: "Computer Networks", avg: 80, students: 50, trend: "+2" },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Welcome + Quick stats row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 rounded-lg p-5 relative overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -mr-8 -mt-8" style={{ background: ORANGE }} />
          <p className="text-lg font-bold relative" style={{ color: TXT }}>
            Welcome, {profileData?.firstName || "Faculty"}
          </p>
          <p className="text-xs mt-1 relative" style={{ color: TXT3 }}>You have 3 classes and 5 tasks pending today</p>
          <div className="flex gap-6 mt-4 relative">
            <div>
              <p className="text-2xl font-bold" style={{ color: ORANGE }}>24</p>
              <p className="text-[10px]" style={{ color: TXT3 }}>Weekly Classes</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: TXT }}>142</p>
              <p className="text-[10px]" style={{ color: TXT3 }}>Total Students</p>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: TXT }}>88%</p>
              <p className="text-[10px]" style={{ color: TXT3 }}>Avg Attendance</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} style={{ color: ORANGE }} />
            <p className="text-xs font-semibold" style={{ color: TXT2 }}>Today's Schedule</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: TXT }}>3</p>
          <p className="text-[10px] mt-0.5" style={{ color: TXT3 }}>Classes remaining</p>
          <div className="mt-3 flex items-center gap-1">
            <Clock size={11} style={{ color: ORANGE }} />
            <span className="text-[10px]" style={{ color: ORANGE }}>Next: 10:00 AM — DSA</span>
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
            <p className="text-xs font-semibold" style={{ color: TXT2 }}>Pending Tasks</p>
          </div>
          <p className="text-3xl font-bold" style={{ color: TXT }}>5</p>
          <p className="text-[10px] mt-0.5" style={{ color: TXT3 }}>2 urgent, 3 normal</p>
          <div className="mt-3 flex gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#EF4444" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#F59E0B" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>Weekly Classes</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classesData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="day" stroke={TXT3} fontSize={11} tickLine={false} />
              <YAxis stroke={TXT3} fontSize={11} tickLine={false} />
              <Tooltip {...tp} />
              <Bar dataKey="val" fill={ORANGE} radius={[4, 4, 0, 0]} name="Classes" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>Attendance Trend</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="orangeG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ORANGE} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="w" stroke={TXT3} fontSize={11} tickLine={false} />
              <YAxis stroke={TXT3} fontSize={11} tickLine={false} domain={[70, 100]} />
              <Tooltip {...tp} />
              <Area type="monotone" dataKey="rate" stroke={ORANGE} strokeWidth={2} fill="url(#orangeG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Subjects Table + Schedule/Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Subjects */}
        <div className="lg:col-span-3 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>Subject Performance</p>
          <div className="space-y-2">
            {subjects.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: "#0B0F19" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: TXT }}>{s.name}</p>
                  <p className="text-[10px]" style={{ color: TXT3 }}>{s.students} students</p>
                </div>
                <div className="w-24">
                  <div className="h-1.5 rounded-full" style={{ background: BORDER }}>
                    <div className="h-1.5 rounded-full" style={{ background: ORANGE, width: `${s.avg}%` }} />
                  </div>
                </div>
                <p className="text-xs font-bold w-8 text-right" style={{ color: TXT }}>{s.avg}</p>
                <span className="text-[10px] font-semibold" style={{ color: s.trend.startsWith("+") ? "#22C55E" : "#EF4444" }}>{s.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule + Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: TXT }}>Today's Classes</p>
            <div className="space-y-2">
              {upcoming.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "#0B0F19" }}>
                  <div className="w-1 h-8 rounded-full" style={{ background: ORANGE }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: TXT }}>{c.subject}</p>
                    <p className="text-[10px]" style={{ color: TXT3 }}>{c.time} · Room {c.room}</p>
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: ORANGE }}>{c.students}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <p className="text-sm font-semibold mb-3" style={{ color: TXT }}>Tasks</p>
            <div className="space-y-2">
              {tasks.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "#0B0F19" }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                    background: t.priority === "high" ? "#EF4444" : t.priority === "medium" ? "#F59E0B" : "#22C55E",
                  }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: TXT }}>{t.task}</p>
                    <p className="text-[10px]" style={{ color: TXT3 }}>Due: {t.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
