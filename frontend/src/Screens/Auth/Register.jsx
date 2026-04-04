import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, Users, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";

const USER_ROLES = {
  STUDENT: "student",
  FACULTY: "faculty",
  ADMIN: "admin",
};

const USER_ROLE_INFO = {
  student: {
    label: "Student",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-300",
  },
  faculty: {
    label: "Faculty",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-300",
  },
  admin: {
    label: "Admin",
    icon: Shield,
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    borderColor: "border-indigo-300",
  },
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpPhase, setShowOtpPhase] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.STUDENT,
  });

  // Check if already logged in
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const userType = localStorage.getItem("userType")?.toLowerCase();
      navigate(`/${userType}`);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (formData.name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email");
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosWrapper.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      if (response.data.data.requireOtp) {
        toast.success("OTP sent to your email!");
        setShowOtpPhase(true);
        setLoading(false);
        return;
      }

      const { token, user } = response.data.data;

      // Store authentication data
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);

      dispatch(setUserToken(token));

      toast.success("Registration successful!");

      // Redirect based on role
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 500);
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosWrapper.post("/auth/verify-otp", {
        email: formData.email.trim(),
        otp: otp,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);

      dispatch(setUserToken(token));
      toast.success("Verification successful!");

      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 500);
    } catch (error) {
      console.error("OTP Verification error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {showOtpPhase ? "Verify Email" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {showOtpPhase ? "Enter the OTP sent to your email" : "Join our college management system"}
            </p>
          </div>

          {showOtpPhase ? (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center text-sm text-gray-600 mb-4">
                We've sent a 6-digit OTP to <strong className="break-all">{formData.email}</strong>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="otp">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center tracking-widest text-xl border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(USER_ROLES).map(([key, role]) => {
                  const info = USER_ROLE_INFO[role];
                  const Icon = info.icon;
                  const isSelected = formData.role === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() =>
                        !loading && setFormData((prev) => ({ ...prev, role }))
                      }
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `bg-gradient-to-br ${info.color} text-white border-transparent shadow-lg`
                          : `${info.bgLight} ${info.borderColor} text-gray-700 hover:shadow-md`
                      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={loading}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-semibold">{info.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password (min 6 characters)"
                  className="w-full pl-12 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full pl-12 pr-12 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign In
              </Link>
            </div>
          </form>
          )}
        </div>
      </div>

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
      `}</style>
    </div>
  );
};

export default Register;
