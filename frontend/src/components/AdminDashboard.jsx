import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, BookOpen, Calendar, TrendingUp, Award,
  UserCheck, Clock, Target
} from 'lucide-react';
import axiosWrapper from "../utils/AxiosWrapper";
import { toast } from "react-hot-toast";

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-xl transform hover:scale-105 transition-transform`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
        <Icon size={28} />
      </div>
      {change && (
        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
          change > 0 ? 'bg-green-400 bg-opacity-30' : 'bg-red-400 bg-opacity-30'
        }`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      )}
    </div>
    <h3 className="text-2xl font-bold mb-1">{value}</h3>
    <p className="text-sm opacity-90">{title}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalBranches: 0,
    totalSubjects: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, facultyRes, branchesRes, subjectsRes] = await Promise.all([
        axiosWrapper.post('/student/search', {}, { headers: { Authorization: `Bearer ${userToken}` }}),
        axiosWrapper.get('/faculty', { headers: { Authorization: `Bearer ${userToken}` }}),
        axiosWrapper.get('/branch', { headers: { Authorization: `Bearer ${userToken}` }}),
        axiosWrapper.get('/subject', { headers: { Authorization: `Bearer ${userToken}` }})
      ]);

      setStats({
        totalStudents: studentsRes.data.data?.length || 0,
        totalFaculty: facultyRes.data.data?.length || 0,
        totalBranches: branchesRes.data.data?.length || 0,
        totalSubjects: subjectsRes.data.data?.length || 0,
        attendanceRate: 85
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
      setLoading(false);
    }
  };

  const attendanceData = [
    { name: 'Mon', present: 120, absent: 10 },
    { name: 'Tue', present: 125, absent: 5 },
    { name: 'Wed', present: 118, absent: 12 },
    { name: 'Thu', present: 130, absent: 2 },
    { name: 'Fri', present: 115, absent: 15 },
  ];

  const branchData = [
    { name: 'CSE', value: 45, color: '#3b82f6' },
    { name: 'ECE', value: 30, color: '#8b5cf6' },
    { name: 'ME', value: 15, color: '#10b981' },
    { name: 'CE', value: 5, color: '#f59e0b' },
    { name: 'EE', value: 5, color: '#ef4444' },
  ];

  const performanceData = [
    { month: 'Jan', score: 75 },
    { month: 'Feb', score: 78 },
    { month: 'Mar', score: 82 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 83 },
    { month: 'Jun', score: 88 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          change={5.2}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          title="Total Faculty"
          value={stats.totalFaculty}
          change={2.1}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={BookOpen}
          title="Total Courses"
          value={stats.totalSubjects}
          change={0}
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={UserCheck}
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          change={3.5}
          color="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-indigo-500" />
            Weekly Attendance Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-purple-500" />
            Students by Branch
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={branchData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {branchData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="text-green-500" />
          Overall Performance Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200">
          <Clock className="text-blue-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-blue-900">{stats.totalBranches}</h4>
          <p className="text-blue-700 font-medium">Active Branches</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200">
          <Target className="text-purple-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-purple-900">95%</h4>
          <p className="text-purple-700 font-medium">Pass Percentage</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
          <Award className="text-green-500 mb-3" size={32} />
          <h4 className="text-2xl font-bold text-green-900">12</h4>
          <p className="text-green-700 font-medium">Active Exams</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

