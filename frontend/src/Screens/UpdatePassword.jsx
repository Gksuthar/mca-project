import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import { GraduationCap, Lock, ArrowRight } from "lucide-react";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { resetId, type } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (!resetId) { toast.error("Invalid or expired reset link."); navigate("/"); } }, [resetId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    if (!type) { toast.error("Invalid Reset Password Link."); return; }
    setIsLoading(true); toast.loading("Resetting...");
    try {
      const res = await axiosWrapper.post(`/${type}/update-password/${resetId}`, { password: newPassword, resetId });
      toast.dismiss();
      if (res.data.success) { toast.success("Password reset successfully."); navigate("/"); } else { toast.error(res.data.message || "Error."); }
    } catch (err) { toast.dismiss(); toast.error(err.response?.data?.message || "Error."); }
    finally { setIsLoading(false); }
  };

  const inp = { background: "#0B0F19", border: "1px solid #1F2937", color: "#E5E7EB" };
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F19" }}>
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative w-full max-w-[400px] animate-fade-in">
        <div className="rounded-xl p-7" style={{ background: "#111827", border: "1px solid #1F2937" }}>
          <div className="text-center mb-6">
            <div className="w-11 h-11 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: "#7C3AED" }}><GraduationCap size={22} color="#fff" /></div>
            <h1 className="text-xl font-bold" style={{ color: "#F3F4F6" }}>Update Password</h1>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Enter your new password</p>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>New Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="New password"
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none" style={inp} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: "#9CA3AF" }}>Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#4B5563" }} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm"
                  className="w-full py-2.5 pl-9 pr-3 rounded-lg text-sm outline-none" style={inp} />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50" style={{ background: "#7C3AED" }}>
              {isLoading ? "Resetting..." : "Reset Password"} {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { background: "#1F2937", color: "#F3F4F6", border: "1px solid #374151", fontSize: 13 } }} />
    </div>
  );
};
export default UpdatePassword;
