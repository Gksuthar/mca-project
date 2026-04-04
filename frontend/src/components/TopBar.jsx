import React from "react";
import { Bell, Search, User } from "lucide-react";
import { baseMediaURL } from "../baseUrl";

const TopBar = ({ title, profileData, onProfileClick }) => {

  return (
    <div className="bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {title || "Dashboard"}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 w-64"
          />
        </div>

        <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200">
          <Bell size={19} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button 
          onClick={() => onProfileClick && onProfileClick()}
          className="flex items-center gap-3 px-2 md:px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
        >
          {profileData?.profile ? (
            <img
              src={`${baseMediaURL()}/${profileData.profile}`}
              alt="Profile"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
          ) : (
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          )}
          {profileData && (
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-slate-800">
                {profileData.firstName} {profileData.lastName}
              </p>
              <p className="text-xs text-slate-500">{profileData.email}</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;

