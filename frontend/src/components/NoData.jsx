import React from "react";

const NoData = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-16 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <img src="/assets/empty.svg" alt="No data" className="w-44 h-44 opacity-90" />
      <p className="mt-4 text-slate-700 font-medium">{title || "No data found"}</p>
      <p className="text-sm text-slate-500 mt-1">Try adjusting filters or adding new records.</p>
    </div>
  );
};

export default NoData;

