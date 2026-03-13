import React, { useEffect, useState } from "react";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, BookOpen, Calendar, Clock, FileText,
  CheckCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import axiosWrapper from "../utils/AxiosWrapper";

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow`}>
    <div className="flex items-center justify-between mb-3">
      <div className="p-3 bg-white bg-opacity-20 rounded-xl">
        <Icon size={26} />
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-1">{value}</h3>
    <p className="text-sm opacity-90 font-medium">{title}</p>
    {subtitle && <p className="text-xs opacity-75 mt-1">{subtitle}</p>}
  </div>
);

const FacultyDashboard = ({ profileData }) => {
  const [dashboardStats, setDashboardStats] = useState({
    totalClasses: 24,
    todayClasses: 3,
    studentsCount: 0,
    pendingTasks: 5
  });

  const classesData = [
    { day: 'Mon', classes: 4, hours: 4 },
    { day: 'Tue', classes: 3, hours: 3 },
    { day: 'Wed', classes: 5, hours: 5 },
    { day: 'Thu', classes: 3, hours: 3 },
    { day: 'Fri', classes: 4, hours: 4 },
  ];

  const attendanceTrend = [
    { week: 'Week 1', rate: 82 },
    { week: 'Week 2', rate: 85 },
    { week: 'Week 3', rate: 88 },
    { week: 'Week 4', rate: 86 },
    { week: 'Week 5', rate: 90 },
  ];

  const subjectPerformance = [
    { subject: 'DSA', avg: 85, students: 45 },
    { subject: 'DBMS', avg: 78, students: 48 },
    { subject: 'OS', avg: 82, students: 42 },
    { subject: 'CN', avg: 80, students: 50 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {profileData?.firstName}!</h2>
        <p className="text-indigo-100">Here's what's happening with your classes today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Classes This Week"
          value={dashboardStats.totalClasses}
          subtitle="4 more than last week"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Clock}
          title="Today's Classes"
          value={dashboardStats.todayClasses}
          subtitle="Next at 10:00 AM"
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value="142"
          subtitle="Across 3 subjects"
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={FileText}
          title="Pending Tasks"
          value={dashboardStats.pendingTasks}
          subtitle="2 urgent"
          color="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-indigo-500" />
            Weekly Class Schedule
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={classesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="classes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="hours" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRate)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="text-purple-500" />
          Subject Performance Overview
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" />
            <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="avg" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Average Score" />
            <Bar yAxisId="right" dataKey="students" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Students" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Upcoming Classes
          </h3>
          <div className="space-y-3">
            {[
              { time: '10:00 AM - 11:00 AM', subject: 'Data Structures', room: 'Room 301', students: 45 },
              { time: '02:00 PM - 03:00 PM', subject: 'DBMS', room: 'Room 205', students: 48 },
              { time: '04:00 PM - 05:00 PM', subject: 'Operating Systems', room: 'Lab 102', students: 42 }
            ].map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
                <div>
                  <h4 className="font-semibold text-gray-800">{cls.subject}</h4>
                  <p className="text-sm text-gray-600">{cls.time} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-indigo-600">{cls.students}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            Pending Tasks
          </h3>
          <div className="space-y-3">
            {[
              { task: 'Grade DSA Mid-Term Papers', priority: 'high', due: 'Today' },
              { task: 'Upload Study Material for OS', priority: 'medium', due: 'Tomorrow' },
              { task: 'Prepare DBMS Quiz Questions', priority: 'low', due: '3 days' },
              { task: 'Review Student Assignments', priority: 'medium', due: '2 days' }
            ].map((task, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-gray-800">{task.task}</h4>
                    <p className="text-xs text-gray-500">Due: {task.due}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

