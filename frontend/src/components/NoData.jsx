import React from "react";
const NoData = ({ title }) => (
  <div className="flex flex-col items-center justify-center my-10 py-10 rounded-lg text-center" style={{ background: "#0B0F19", border: "1px dashed #1F2937" }}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
    <p className="mt-3 text-sm font-medium" style={{ color: "#9CA3AF" }}>{title || "No data found"}</p>
    <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Try adjusting filters or adding new records.</p>
  </div>
);
export default NoData;
