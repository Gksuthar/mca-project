import React from "react";
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar, Award, UserCheck, FileText } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StatCard = ({ icon: Icon, title, value, change, color, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`w-14 h-14 ${color} bg-opacity-20 rounded-xl flex items-center justify-center`}>
        <Icon size={28} className={color.replace('bg-', 'text-')} />
      </div>
      {change && (
        <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

const AdminDashboard = ({ stats }) => {
  const attendanceData = [
    { name: 'Mon', present: 850, absent: 150 },
    { name: 'Tue', present: 920, absent: 80 },
    { name: 'Wed', present: 880, absent: 120 },
    { name: 'Thu', present: 950, absent: 50 },
    { name: 'Fri', present: 890, absent: 110 },
  ];

  const branchData = [
    { name: 'CSE', students: 350, fill: '#6366f1' },
    { name: 'ECE', students: 280, fill: '#8b5cf6' },
    { name: 'ME', students: 220, fill: '#ec4899' },
    { name: 'CE', students: 190, fill: '#f59e0b' },
    { name: 'EE', students: 160, fill: '#10b981' },
  ];

  const performanceData = [
    { month: 'Jan', avg: 75 },
    { month: 'Feb', avg: 78 },
    { month: 'Mar', avg: 82 },
    { month: 'Apr', avg: 80 },
    { month: 'May', avg: 85 },
    { month: 'Jun', avg: 88 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Students" 
          value={stats?.students || "1,250"} 
          change={12}
          color="bg-blue-500"
          bgColor="bg-white"
        />
        <StatCard 
          icon={GraduationCap} 
          title="Faculty Members" 
          value={stats?.faculty || "85"} 
          change={5}
          color="bg-purple-500"
          bgColor="bg-white"
        />
        <StatCard 
          icon={BookOpen} 
          title="Total Courses" 
          value={stats?.courses || "42"} 
          change={8}
          color="bg-pink-500"
          bgColor="bg-white"
        />
        <StatCard 
          icon={UserCheck} 
          title="Attendance Rate" 
          value={stats?.attendance || "92%"} 
          change={3}
          color="bg-green-500"
          bgColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} />
            Weekly Attendance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <GraduationCap className="text-purple-500" size={20} />
            Students by Branch
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={branchData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="students"
              >
                {branchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-green-500" size={20} />
          Average Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={3} dot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <FileText size={32} className="mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-1">156</h3>
          <p className="text-blue-100">Exams Scheduled</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <Award size={32} className="mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-1">89%</h3>
          <p className="text-purple-100">Pass Percentage</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <BookOpen size={32} className="mb-3 opacity-80" />
          <h3 className="text-2xl font-bold mb-1">234</h3>
          <p className="text-pink-100">Study Materials</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

