import React from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { BookOpen, Award, Target, CheckCircle, Clock, AlertCircle, Star, ArrowUpRight } from "lucide-react";

const GREEN = "#06D6A0";
const GREEN_D = "#05A87E";
const CARD = "#111827";
const BORDER = "#1F2937";
const TXT = "#F3F4F6";
const TXT2 = "#9CA3AF";
const TXT3 = "#6B7280";
const tp = { contentStyle: { background: "#1F2937", border: "1px solid #374151", borderRadius: 8, color: TXT } };

// Simple circular progress ring
const Ring = ({ value, max = 100, size = 56, stroke = 4, color = GREEN }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" />
    </svg>
  );
};

const StudentDashboard = ({ profileData }) => {
  const marksData = [
    { s: "DSA", marks: 85 }, { s: "DBMS", marks: 78 },
    { s: "OS", marks: 82 }, { s: "CN", marks: 88 }, { s: "SE", marks: 80 },
  ];
  const cgpaData = [
    { sem: "S1", cgpa: 7.5 }, { sem: "S2", cgpa: 7.8 },
    { sem: "S3", cgpa: 8.2 }, { sem: "S4", cgpa: 8.5 },
  ];
  const radarData = [
    { s: "DSA", v: 85 }, { s: "DBMS", v: 78 }, { s: "OS", v: 82 },
    { s: "CN", v: 88 }, { s: "SE", v: 80 },
  ];

  const classes = [
    { time: "09:00 AM", subject: "Data Structures", room: "301", type: "Lecture" },
    { time: "11:00 AM", subject: "DBMS Lab", room: "Lab 102", type: "Lab" },
    { time: "02:00 PM", subject: "Operating Systems", room: "205", type: "Lecture" },
  ];

  const tasks = [
    { task: "DSA Assignment", due: "Tomorrow", priority: "high" },
    { task: "DBMS Project Report", due: "3 days", priority: "medium" },
    { task: "OS Lab Submission", due: "5 days", priority: "low" },
  ];

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Profile Banner + Ring Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-3 rounded-lg p-5 relative overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-[0.07]" style={{ background: GREEN }} />
          <p className="text-base font-bold" style={{ color: TXT }}>
            Hi, {profileData?.firstName || "Student"} 👋
          </p>
          <p className="text-xs mt-1" style={{ color: TXT3 }}>
            Here's your academic snapshot for the current semester
          </p>
          <div className="flex gap-5 mt-4 items-end">
            <div className="relative">
              <Ring value={8.5} max={10} size={52} color={GREEN} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold rotate-90" style={{ color: GREEN }}>8.5</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: TXT }}>CGPA</p>
              <div className="flex items-center gap-1">
                <ArrowUpRight size={11} style={{ color: "#22C55E" }} />
                <span className="text-[10px]" style={{ color: "#22C55E" }}>+0.3 from last sem</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        {[
          { icon: CheckCircle, label: "Attendance", val: "87%", sub: "Above avg", color: GREEN },
          { icon: BookOpen, label: "Courses", val: "6", sub: "20 credits", color: "#3B82F6" },
          { icon: Star, label: "Class Rank", val: "3rd", sub: "Top 5%", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <s.icon size={16} style={{ color: s.color }} />
            <p className="text-2xl font-bold mt-2" style={{ color: TXT }}>{s.val}</p>
            <p className="text-[11px]" style={{ color: TXT3 }}>{s.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Charts: Marks + Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>Subject Marks</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={marksData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="s" stroke={TXT3} fontSize={11} tickLine={false} />
              <YAxis stroke={TXT3} fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip {...tp} />
              <Bar dataKey="marks" fill={GREEN} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-2" style={{ color: TXT }}>Skill Map</p>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={BORDER} />
              <PolarAngleAxis dataKey="s" stroke={TXT3} fontSize={10} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={BORDER} fontSize={9} />
              <Radar dataKey="v" stroke={GREEN} fill={GREEN} fillOpacity={0.15} strokeWidth={2} />
              <Tooltip {...tp} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── CGPA + Schedule + Tasks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* CGPA Line */}
        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-4" style={{ color: TXT }}>CGPA Progress</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={cgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
              <XAxis dataKey="sem" stroke={TXT3} fontSize={11} tickLine={false} />
              <YAxis domain={[6, 10]} stroke={TXT3} fontSize={11} tickLine={false} />
              <Tooltip {...tp} />
              <Line type="monotone" dataKey="cgpa" stroke={GREEN} strokeWidth={3}
                dot={{ fill: GREEN, r: 4, strokeWidth: 2, stroke: CARD }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Schedule */}
        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-3" style={{ color: TXT }}>Today's Classes</p>
          <div className="space-y-2">
            {classes.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "#0B0F19" }}>
                <div className="w-1 h-8 rounded-full" style={{ background: GREEN }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: TXT }}>{c.subject}</p>
                  <p className="text-[10px]" style={{ color: TXT3 }}>{c.time} · Room {c.room}</p>
                </div>
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: `${GREEN}15`, color: GREEN }}>{c.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="rounded-lg p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-sm font-semibold mb-3" style={{ color: TXT }}>Pending Tasks</p>
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
          {/* Bottom stats */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div>
              <p className="text-xs font-bold" style={{ color: TXT }}>15/18</p>
              <p className="text-[10px]" style={{ color: TXT3 }}>Assignments Done</p>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: TXT }}>24 hrs</p>
              <p className="text-[10px]" style={{ color: TXT3 }}>Study This Week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
