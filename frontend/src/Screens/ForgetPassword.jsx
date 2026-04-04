import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import { GraduationCap, Mail, ArrowRight, ArrowLeft } from "lucide-react";

const TYPES = ["Student", "Faculty", "Admin"];

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("userToken");
    if (t) navigate(`/${localStorage.getItem("userType")}`);
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    toast.loading("Sending reset mail...");
    try {
      const resp = await axiosWrapper.post(`/${selected.toLowerCase()}/forget-password`, { email }, { headers: { "Content-Type": "application/json" } });
      toast.dismiss();
      resp.data.success ? toast.success(resp.data.message) : toast.error(resp.data.message);
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error sending reset mail");
    } finally { setEmail(""); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="rounded-xl p-7" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: "#7C3AED" }}><GraduationCap size={22} color="#fff" /></div>
            <h1 className="text-xl font-bold" style={{ color: "#F3F4F6" }}>Forgot Password</h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Select role and enter your email</p>
          </div>
          <div className="flex gap-2 mb-5">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setSelected(t)}
                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                style={{ background: selected === t ? "#7C3AED" : "#0B0F19", color: selected === t ? "#fff" : "#6B7280", border: `1px solid ${selected === t ? "#7C3AED" : "#1F2937"}` }}>
                {t}
              </button>
            ))}
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>{selected} Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter email"
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none" style={{ background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" }} />
              </div>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "#7C3AED" }}>
              Send Reset Link <ArrowRight size={15} />
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "#7C3AED" }}><ArrowLeft size={13} />Back to Login</Link>
          </div>
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1F2937", color: "#F3F4F6", border: "1px solid #374151", fontSize: 13 } }} />
    </div>
  );
};
export default ForgetPassword;
