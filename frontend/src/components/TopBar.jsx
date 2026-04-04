import React from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import { baseMediaURL } from "../baseUrl";

const TopBar = ({ title, profileData, onProfileClick }) => {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(11, 15, 25, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1F2937",
        minHeight: 56,
      }}
    >
      {/* Left: Title */}
      <div>
        <h1 className="text-base font-semibold" style={{ color: "#F3F4F6" }}>
          {title || "Dashboard"}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "#4B5563" }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 rounded-lg text-xs outline-none w-48"
            style={{
              background: "#111827",
              border: "1px solid #1F2937",
              color: "#D1D5DB",
            }}
          />
        </div>

        {/* Notification */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ background: "#111827", border: "1px solid #1F2937" }}
        >
          <Bell size={15} style={{ color: "#6B7280" }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "#EF4444" }}
          />
        </button>

        {/* Profile */}
        <button
          onClick={() => onProfileClick?.()}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "#111827", border: "1px solid #1F2937" }}
        >
          {profileData?.profile ? (
            <img
              src={`${baseMediaURL()}/${profileData.profile}`}
              alt="Profile"
              className="w-7 h-7 rounded-md object-cover"
              style={{ border: "1px solid #1F2937" }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ background: "#1F2937" }}
            >
              <User size={13} style={{ color: "#9CA3AF" }} />
            </div>
          )}
          {profileData && (
            <span className="text-xs font-medium hidden md:inline" style={{ color: "#D1D5DB" }}>
              {profileData.firstName}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default TopBar;
