import React from "react";
const heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full">
      <p className="font-semibold text-2xl md:text-3xl border-l-4 border-slate-900 pl-3 text-slate-900 tracking-tight">
        {props.title}
      </p>
    </div>
  );
};

export default heading;

