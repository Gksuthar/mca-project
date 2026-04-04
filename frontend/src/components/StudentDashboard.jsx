import React from "react";
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  BookOpen, Calendar, Award, TrendingUp, Target,
  CheckCircle, Clock, AlertCircle, Star
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-slate-900" />
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-1 text-slate-900">{value}</h3>
    <p className="text-sm text-slate-600 font-medium">{title}</p>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);

const StudentDashboard = ({ profileData }) => {
  const marksData = [
    { subject: 'DSA', marks: 85, total: 100 },
    { subject: 'DBMS', marks: 78, total: 100 },
    { subject: 'OS', marks: 82, total: 100 },
    { subject: 'CN', marks: 88, total: 100 },
    { subject: 'SE', marks: 80, total: 100 },
  ];

  const attendanceData = [
    { month: 'Jan', rate: 85 },
    { month: 'Feb', rate: 88 },
    { month: 'Mar', rate: 82 },
    { month: 'Apr', rate: 90 },
    { month: 'May', rate: 87 },
  ];

  const performanceRadar = [
    { subject: 'DSA', score: 85, fullMark: 100 },
    { subject: 'DBMS', score: 78, fullMark: 100 },
    { subject: 'OS', score: 82, fullMark: 100 },
    { subject: 'CN', score: 88, fullMark: 100 },
    { subject: 'SE', score: 80, fullMark: 100 },
  ];

  const cgpaData = [
    { sem: 'Sem 1', cgpa: 7.5 },
    { sem: 'Sem 2', cgpa: 7.8 },
    { sem: 'Sem 3', cgpa: 8.2 },
    { sem: 'Sem 4', cgpa: 8.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-1 text-slate-900">Welcome back, {profileData?.firstName}!</h2>
        <p className="text-slate-500">Track your progress with a clear academic overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Award}
          title="Current CGPA"
          value="8.5"
          subtitle="↑ 0.3 from last sem"
          color="bg-blue-100"
        />
        <StatCard
          icon={CheckCircle}
          title="Attendance"
          value="87%"
          subtitle="3% above average"
          color="bg-emerald-100"
        />
        <StatCard
          icon={BookOpen}
          title="Enrolled Courses"
          value="6"
          subtitle="20 credits total"
          color="bg-violet-100"
        />
        <StatCard
          icon={Target}
          title="Assignments"
          value="2"
          subtitle="Due this week"
          color="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-indigo-500" />
            Subject-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="marks" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-green-500" />
            Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-500" />
            Skills Assessment
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={performanceRadar}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name="Your Score" 
                dataKey="score" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-blue-500" />
            CGPA Progress
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={cgpaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="sem" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="cgpa" 
                stroke="#3b82f6" 
                strokeWidth={4}
                dot={{ fill: '#3b82f6', r: 8 }}
                activeDot={{ r: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="text-purple-500" />
            Upcoming Classes Today
          </h3>
          <div className="space-y-3">
            {[
              { time: '09:00 AM', subject: 'Data Structures', room: 'Room 301', type: 'Lecture' },
              { time: '11:00 AM', subject: 'DBMS Lab', room: 'Lab 102', type: 'Practical' },
              { time: '02:00 PM', subject: 'Operating Systems', room: 'Room 205', type: 'Lecture' }
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-semibold text-gray-800">{cls.subject}</h4>
                  <p className="text-sm text-gray-600">{cls.time} • {cls.room}</p>
                </div>
                <span className="px-3 py-1 bg-indigo-200 text-indigo-800 text-xs font-semibold rounded-full">
                  {cls.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            Pending Tasks
          </h3>
          <div className="space-y-3">
            {[
              { task: 'DSA Assignment', due: 'Due Tomorrow', priority: 'high' },
              { task: 'DBMS Project Report', due: 'Due in 3 days', priority: 'medium' },
              { task: 'OS Lab Submission', due: 'Due in 5 days', priority: 'low' },
              { task: 'CN Quiz Preparation', due: 'Due in 1 week', priority: 'medium' }
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-800">{task.task}</h4>
                    <p className="text-xs text-gray-500">{task.due}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <BookOpen className="text-blue-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-blue-900">24</h4>
          <p className="text-slate-600 font-medium">Study Hours This Week</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <CheckCircle className="text-green-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-green-900">15/18</h4>
          <p className="text-slate-600 font-medium">Assignments Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <Star className="text-purple-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-purple-900">3rd</h4>
          <p className="text-slate-600 font-medium">Class Rank</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

