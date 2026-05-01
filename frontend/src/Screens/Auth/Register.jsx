import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ArrowRight, GraduationCap } from "lucide-react";
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
          role: formData.role.toLowerCase(),
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

  const inp = { background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative w-full max-w-[500px] animate-fade-in">
        <div className="rounded-xl p-8" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-lg mx-auto mb-4 flex items-center justify-center" style={{ background: "#7C3AED" }}>
              <GraduationCap size={28} color="#fff" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#F3F4F6" }}>Create Account</h1>
            <p className="text-sm mt-2" style={{ color: "#6B7280" }}>Join us and start your journey</p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { name: "name", icon: User, ph: "Full name", type: "text" },
              { name: "email", icon: Mail, ph: "Email address", type: "email" },
              { name: "phone", icon: Phone, ph: "Phone number", type: "tel" },
            ].map((f) => (
              <div key={f.name} className="relative">
                <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input
                  name={f.name}
                  type={f.type}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.ph}
                  required
                  className="w-full py-3 pl-10 pr-4 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500"
                  style={inp}
                />
              </div>
            ))}

            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-3 pl-10 pr-4 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500"
                style={inp}
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {["password", "confirmPassword"].map((n) => (
              <div key={n} className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input
                  name={n}
                  type="password"
                  value={formData[n]}
                  onChange={handleChange}
                  placeholder={n === "password" ? "Password (min 6 characters)" : "Confirm password"}
                  required
                  className="w-full py-3 pl-10 pr-4 rounded-lg text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500"
                  style={inp}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#7C3AED" }}
            >
              {loading ? "Creating Account..." : <>Sign Up <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: "#6B7280" }}>
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: "#7C3AED" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
