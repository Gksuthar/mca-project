import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import { GraduationCap, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { setUserToken } from "../../redux/actions";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("userToken");
    if (t) navigate(`/${localStorage.getItem("userType")}`);
  }, [navigate]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
        <div className="relative w-full max-w-[400px]">
          <div className="rounded-xl p-7 text-center" style={{ background: "#111827", border: "1px solid #1F2937" }}>
            <h1 className="text-xl font-bold mb-4" style={{ color: "#F3F4F6" }}>Invalid Reset Link</h1>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>The reset link is missing or invalid.</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "#7C3AED" }}
            >
              <ArrowLeft size={16} />
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosWrapper.post(
        "/auth/reset-password",
        {
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token: jwtToken, user } = response.data.data;
      
      localStorage.setItem("userToken", jwtToken);
      localStorage.setItem("userType", user.role.charAt(0).toUpperCase() + user.role.slice(1));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      
      dispatch(setUserToken(jwtToken));
      
      toast.success("Password reset successfully!");
      navigate(`/${user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="rounded-xl p-7" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: "#7C3AED" }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "#F3F4F6" }}>Reset Password</h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Enter your new password</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {[
              { name: "password", icon: Lock, ph: "New password (min 6 characters)" },
              { name: "confirmPassword", icon: Lock, ph: "Confirm password" }
            ].map((f) => (
              <div key={f.name} className="relative">
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>
                  {f.name === "password" ? "New Password" : "Confirm Password"}
                </label>
                <div className="relative">
                  <f.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                  <input
                    type="password"
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleChange}
                    required
                    placeholder={f.ph}
                    className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500"
                    style={{ background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" }}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#7C3AED" }}
            >
              {loading ? "Resetting..." : <>Reset Password <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "#7C3AED" }}>
              <ArrowLeft size={13} />Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
