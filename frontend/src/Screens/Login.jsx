import React, { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail, Shield, Users } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import axiosWrapper from "../utils/AxiosWrapper";

const ROLES = {
  Student: { icon: GraduationCap, accent: "#06D6A0", desc: "Access courses, attendance & grades" },
  Faculty: { icon: Users, accent: "#E85D04", desc: "Manage classes, marks & materials" },
  Admin: { icon: Shield, accent: "#7C3AED", desc: "System control & user management" },
};

const normalizeType = (v) => {
  if (!v) return "Student";
  const w = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  return ROLES[w] ? w : "Student";
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState(() => normalizeType(searchParams.get("type")));
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const r = ROLES[selected];

  useEffect(() => {
    const t = localStorage.getItem("userToken");
    if (t) navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
  }, [navigate]);

  useEffect(() => { setSelected(normalizeType(searchParams.get("type"))); }, [searchParams]);

  const selectRole = (role) => { setSelected(role); setSearchParams({ type: role.toLowerCase() }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Please fill in all fields"); return; }
    try {
      setSubmitting(true);
      const res = await axiosWrapper.post(`/${selected.toLowerCase()}/login`, form, { headers: { "Content-Type": "application/json" } });
      const { token } = res.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (err) {
      if (err?.response?.status === 404) toast.error("User not found. Check role and email.");
      else toast.error(err.response?.data?.message || "Login failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      {/* Subtle bg pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />

      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="rounded-xl p-7" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: r.accent }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <h1 className="text-xl font-bold" style={{ color: "#F3F4F6" }}>Sign In</h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Choose your role to continue</p>
          </div>

          {/* Role Selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {Object.entries(ROLES).map(([name, info]) => {
              const Icon = info.icon;
              const active = selected === name;
              return (
                <button key={name} onClick={() => selectRole(name)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-lg transition-all text-center"
                  style={{
                    background: active ? `${info.accent}12` : "#0B0F19",
                    border: `1.5px solid ${active ? info.accent : "#1F2937"}`,
                  }}
                >
                  <Icon size={16} style={{ color: active ? info.accent : "#6B7280" }} />
                  <span className="text-[11px] font-semibold" style={{ color: active ? info.accent : "#6B7280" }}>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input type="email" required placeholder={`${selected} email address`}
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none"
                  style={{ background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" }}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input type={showPw ? "text" : "password"} required placeholder="Enter password"
                  className="w-full py-2.5 pl-9 pr-10 rounded-lg text-sm outline-none"
                  style={{ background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" }}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5" style={{ color: "#4B5563" }}
                  onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded" style={{ accentColor: r.accent }} />
                <span className="text-xs" style={{ color: "#6B7280" }}>Remember me</span>
              </label>
              <Link to="/forget-password" className="text-xs font-medium" style={{ color: r.accent }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: r.accent }}>
              {submitting ? "Signing in..." : "Sign In"}
              {!submitting && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="text-center mt-5 text-xs" style={{ color: "#6B7280" }}>
            New here? <Link to="/signup" className="font-semibold" style={{ color: r.accent }}>Create account</Link>
          </p>
        </div>
      </div>

      <Toaster position="top-center" toastOptions={{ style: { background: "#1F2937", color: "#F3F4F6", border: "1px solid #374151", fontSize: 13 } }} />
    </div>
  );
};

export default Login;
