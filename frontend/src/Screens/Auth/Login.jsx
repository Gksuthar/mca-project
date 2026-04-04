import React, { useState, useEffect } from "react";
import { LogIn, Mail, Lock, User, GraduationCap, Users, Shield, BookOpen, Award } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../../redux/actions";
import { useDispatch } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const USER_TYPE_INFO = {
  Student: { 
    icon: GraduationCap, 
    color: 'from-blue-500 to-blue-600', 
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-300',
    description: 'Access your courses and grades'
  },
  Faculty: { 
    icon: Users, 
    color: 'from-purple-500 to-purple-600', 
    bgLight: 'bg-purple-50',
    borderColor: 'border-purple-300',
    description: 'Manage classes and students'
  },
  Admin: { 
    icon: Shield, 
    color: 'from-indigo-500 to-indigo-600', 
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    description: 'Control and monitor system'
  },
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => {
  const typeInfo = USER_TYPE_INFO[selected];
  const Icon = typeInfo.icon;

  return (
    <form
      className="w-full space-y-6 animate-fadeIn"
      onSubmit={onSubmit}
    >
      <div className={`flex items-center gap-3 p-4 ${typeInfo.bgLight} rounded-xl border-2 ${typeInfo.borderColor}`}>
        <Icon className={`text-${selected.toLowerCase()}-600`} size={24} />
        <div>
          <h3 className="font-semibold text-gray-800">{selected} Login</h3>
          <p className="text-xs text-gray-600">{typeInfo.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 text-sm font-semibold" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            id="email"
            required
            placeholder={`Enter your ${selected.toLowerCase()} email`}
            className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-gray-700 text-sm font-semibold" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            id="password"
            required
            placeholder="Enter your password"
            className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          to="/forgot-password"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className={`w-full bg-gradient-to-r ${typeInfo.color} text-white font-semibold py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 flex justify-center items-center gap-2 transform hover:scale-105`}
      >
        <LogIn size={20} />
        Sign In
      </button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign Up</Link>
      </div>
    </form>
  );
};

const UserTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {Object.values(USER_TYPES).map((type) => {
        const info = USER_TYPE_INFO[type];
        const Icon = info.icon;
        const isSelected = selected === type;
        
        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 ${
              isSelected
                ? `bg-gradient-to-br ${info.color} text-white border-transparent shadow-xl transform scale-105`
                : `${info.bgLight} ${info.borderColor} text-gray-700 hover:shadow-lg hover:scale-102`
            }`}
          >
            <Icon size={32} />
            <span className="font-semibold">{type}</span>
          </button>
        );
      })}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, user } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      dispatch(setUserToken(token));
      navigate(`/${user.role}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block text-center lg:text-left space-y-6">
          <div className="inline-block p-4 bg-white bg-opacity-50 backdrop-blur-lg rounded-3xl">
            <GraduationCap size={64} className="text-indigo-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            College Management
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              System
            </span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Empowering education through seamless management and smart technology
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <div className="p-4 bg-white bg-opacity-70 rounded-2xl backdrop-blur">
              <Users size={32} className="text-purple-600 mb-2" />
              <p className="text-sm font-semibold text-gray-700">500+ Students</p>
            </div>
            <div className="p-4 bg-white bg-opacity-70 rounded-2xl backdrop-blur">
              <BookOpen size={32} className="text-indigo-600 mb-2" />
              <p className="text-sm font-semibold text-gray-700">50+ Courses</p>
            </div>
            <div className="p-4 bg-white bg-opacity-70 rounded-2xl backdrop-blur">
              <Award size={32} className="text-pink-600 mb-2" />
              <p className="text-sm font-semibold text-gray-700">95% Success</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 backdrop-blur-lg bg-opacity-95">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Select your role and sign in to continue
            </p>
          </div>

          <UserTypeSelector
            selected={selected}
            onSelect={handleUserTypeSelect}
          />

          <LoginForm
            selected={selected}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
      </div>

      <Toaster position="top-center" />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
