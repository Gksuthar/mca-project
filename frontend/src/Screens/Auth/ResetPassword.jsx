import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUserToken } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const userType = localStorage.getItem("userType")?.toLowerCase();
      navigate(`/${userType}`);
      return;
    }

    // Validate reset token and email
    if (!token || !email) {
      toast.error("Invalid or expired reset link");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [token, email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (!formData.confirmPassword) {
      toast.error("Please confirm your password");
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
      const response = await axiosWrapper.post("/auth/reset-password", {
        email,
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      const { user, token: newToken } = response.data.data;

      // Store authentication data
      localStorage.setItem("userToken", newToken);
      localStorage.setItem("userType", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);

      dispatch(setUserToken(newToken));

      setResetSuccess(true);
      toast.success("Password reset successfully!");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-95 text-center">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              <Lock className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Password Reset Successful
            </h2>
            <p className="text-gray-600 mb-6">
              Your password has been reset. You will be redirected to your dashboard shortly.
            </p>
            <div className="animate-spin inline-block h-8 w-8 border-4 border-indigo-600 border-r-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">Enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
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
                  placeholder="Confirm new password"
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
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {/* Back to Login Link */}
            <div className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Back to Login
              </Link>
            </div>
          </form>
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

export default ResetPassword;
