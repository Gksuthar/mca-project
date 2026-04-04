import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import axiosWrapper from "../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const USER_TYPE_INFO = {
  Student: {
    icon: GraduationCap,
    gradient: "from-blue-600 to-cyan-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
    card: "border-blue-200 hover:border-blue-300",
    selectedCard: "ring-blue-500 border-blue-500 bg-blue-50",
    description: "Access your courses, attendance, and grades",
  },
  Faculty: {
    icon: Users,
    gradient: "from-violet-600 to-purple-500",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
    card: "border-violet-200 hover:border-violet-300",
    selectedCard: "ring-violet-500 border-violet-500 bg-violet-50",
    description: "Manage classes, attendance, and marks",
  },
  Admin: {
    icon: Shield,
    gradient: "from-indigo-600 to-blue-600",
    chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
    card: "border-indigo-200 hover:border-indigo-300",
    selectedCard: "ring-indigo-500 border-indigo-500 bg-indigo-50",
    description: "Control users, academics, and operations",
  },
};

const normalizeUserType = (value) => {
  if (!value) return USER_TYPES.STUDENT;
  const wanted = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  return USER_TYPE_INFO[wanted] ? wanted : USER_TYPES.STUDENT;
};

const LoginForm = ({
  selected,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  showPassword,
  setShowPassword,
}) => {
  const typeInfo = USER_TYPE_INFO[selected];
  const Icon = typeInfo.icon;

  return (
    <form className="w-full space-y-5" onSubmit={onSubmit}>
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${typeInfo.chip}`}
      >
        <Icon size={20} />
        <div>
          <h3 className="text-sm font-semibold">{selected} Login</h3>
          <p className="text-xs opacity-80">{typeInfo.description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
          Email Address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="email"
            id="email"
            required
            placeholder={`Enter your ${selected.toLowerCase()} email`}
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            placeholder="Enter your password"
            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-gray-100"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
          <span className="text-sm text-gray-600">Remember me</span>
        </label>
        <Link
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          to="/forget-password"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${typeInfo.gradient} py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
        {!isSubmitting && <ArrowRight size={18} />}
      </button>

      <p className="text-center text-xs text-gray-500">
        New here?{" "}
        <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to="/signup">
          Create account
        </Link>
      </p>
    </form>
  );
};

const UserTypeSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {Object.values(USER_TYPES).map((type) => {
        const info = USER_TYPE_INFO[type];
        const Icon = info.icon;
        const isSelected = selected === type;
        
        return (
          <button
            key={type}
            type="button"
            onClick={() => onSelect(type)}
            className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all duration-200 ${
              isSelected
                ? `ring-2 ${info.selectedCard}`
                : `bg-white text-gray-700 ${info.card}`
            }`}
          >
            <Icon size={22} />
            <span className="text-sm font-semibold">{type}</span>
          </button>
        );
      })}
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(() => normalizeUserType(type));
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserTypeSelect = (role) => {
    const userType = role.toLowerCase();
    setSelected(role);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      console.error("Login failed:", error);
      if (error?.response?.status === 404) {
        toast.error(
          "User not found for selected role. Please check role and email."
        );
      } else {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    setSelected(normalizeUserType(type));
  }, [type]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/25 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl sm:p-7 lg:p-9">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-700 text-white sm:h-14 sm:w-14">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome back</h2>
            <p className="mt-1 text-sm text-slate-500">Select your role and sign in</p>
          </div>

          <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />

          <LoginForm
            selected={selected}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </section>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default Login;

