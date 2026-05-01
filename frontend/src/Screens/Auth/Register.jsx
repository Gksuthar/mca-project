import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import { setUserToken } from "../../redux/actions";
import { useDispatch } from "react-redux";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosWrapper.post(
        "/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: "student", // Force role to student as requested
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
      
      toast.success("Registration successful!");
      navigate(`/${user.role}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      const userType = localStorage.getItem("userType");
      navigate(`/${userType.toLowerCase()}`);
    }
  }, [navigate]);

  const inp = { background: "rgba(11, 15, 25, 0.8)", border: "1px solid #1F2937", color: "#E5E7EB", backdropFilter: "blur(10px)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: "#0B0F19" }}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url('/images/college_background_dark.png')`,
          opacity: 0.4 
        }}
      />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#0B0F19]/60 to-[#0B0F19]" />
      
      <div className="fixed inset-0 z-2 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      
      <div className="relative z-10 w-full max-w-[500px] animate-fade-in">
        <div className="rounded-[2rem] p-8 lg:p-10" style={{ background: "rgba(17, 24, 39, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", backdropFilter: "blur(20px)", shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}>
              <GraduationCap size={28} color="#fff" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#F3F4F6" }}>Student Portal</h1>
            <p className="text-sm mt-2 font-medium" style={{ color: "#9CA3AF" }}>Create your account to get started</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "name", icon: User, ph: "Full Name", type: "text" },
              { name: "email", icon: Mail, ph: "Email Address", type: "email" },
              { name: "phone", icon: Phone, ph: "Phone Number", type: "tel" },
            ].map((f) => (
              <div key={f.name} className="relative group">
                <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-purple-400" style={{ color: "#4B5563" }} />
                <input
                  name={f.name}
                  type={f.type}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.ph}
                  required
                  className="w-full py-4 pl-11 pr-4 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                  style={inp}
                />
              </div>
            ))}

            {/* Hidden role input or just omitted from UI but forced in handleSubmit */}

            {["password", "confirmPassword"].map((n) => (
              <div key={n} className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-purple-400" style={{ color: "#4B5563" }} />
                <input
                  name={n}
                  type={n === "password" ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
                  value={formData[n]}
                  onChange={handleChange}
                  placeholder={n === "password" ? "Password" : "Confirm Password"}
                  required
                  className="w-full py-4 pl-11 pr-12 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/50"
                  style={inp}
                />
                <button
                  type="button"
                  onClick={() => n === "password" ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {n === "password" ? (showPassword ? <EyeOff size={18} /> : <Eye size={18} />) : (showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />)}
                </button>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 shadow-xl"
              style={{ background: "linear-gradient(to right, #7C3AED, #4F46E5)" }}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>Join the Academy <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium" style={{ color: "#9CA3AF" }}>
            Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors ml-1">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
