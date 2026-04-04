import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", role: "Student", password: "", confirmPassword: "" });
  const handleChange = (e) => { const { name, value } = e.target; setFormData((p) => ({ ...p, [name]: value })); };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) { toast.error("Please fill all fields"); return; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return; }
    toast.success("Signup request noted. Please contact admin."); setTimeout(() => navigate("/"), 1200);
  };
  const inp = { background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="rounded-xl p-7" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: "#7C3AED" }}><GraduationCap size={22} color="#fff" /></div>
            <h1 className="text-xl font-bold" style={{ color: "#F3F4F6" }}>Create Account</h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Sign up to get started</p>
          </div>
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {[
              { name: "fullName", icon: User, ph: "Full name", type: "text" },
              { name: "email", icon: Mail, ph: "Email address", type: "email" },
              { name: "phone", icon: Phone, ph: "Phone number", type: "tel" },
            ].map((f) => (
              <div key={f.name} className="relative">
                <f.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} placeholder={f.ph}
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none" style={inp} />
              </div>
            ))}
            <select name="role" value={formData.role} onChange={handleChange} className="w-full py-2.5 px-3 rounded-lg text-sm outline-none" style={inp}>
              <option>Student</option><option>Faculty</option><option>Admin</option>
            </select>
            {["password", "confirmPassword"].map((n) => (
              <div key={n} className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input name={n} type="password" value={formData[n]} onChange={handleChange}
                  placeholder={n === "password" ? "Password" : "Confirm password"}
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none" style={inp} />
              </div>
            ))}
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "#7C3AED" }}>
              Sign Up <ArrowRight size={15} />
            </button>
          </form>
          <p className="text-center mt-4 text-xs" style={{ color: "#6B7280" }}>
            Already have an account? <Link to="/" className="font-semibold" style={{ color: "#7C3AED" }}>Sign in</Link>
          </p>
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1F2937", color: "#F3F4F6", border: "1px solid #374151", fontSize: 13 } }} />
    </div>
  );
};
export default Signup;
