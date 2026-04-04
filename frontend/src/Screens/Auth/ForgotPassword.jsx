import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";
import axiosWrapper from "../../utils/AxiosWrapper";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (userToken) {
      const userType = localStorage.getItem("userType")?.toLowerCase();
      navigate(`/${userType}`);
    }
  }, [userToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosWrapper.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setEmailSent(true);
      toast.success("Reset link sent to your email!");
      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send reset link"
      );
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
          {!emailSent ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                  <Mail className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <ArrowRight size={20} />}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                  <Mail className="text-green-600" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-indigo-600 font-semibold break-all">{email}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The reset link will expire in 10 minutes. If you don't see the email, check your spam folder.
                </p>
              </div>

              <button
                onClick={() => setEmailSent(false)}
                className="w-full text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-all"
              >
                Try Another Email
              </button>

              <div className="text-center text-sm text-gray-600 mt-4">
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                  Back to Login
                </Link>
              </div>
            </>
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

export default ForgotPassword;
