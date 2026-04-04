import React from "react";
const Heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full">
      <p className="font-semibold text-lg tracking-tight pl-3" style={{ color: "#F3F4F6", borderLeft: "3px solid #7C3AED" }}>
        {props.title}
      </p>
    </div>
  );
};
export default Heading;
