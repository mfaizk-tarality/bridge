import React from "react";

const NoDataFound = ({ text }) => {
  return (
    <div className="w-full h-full flex items-center justify-center mt-20 flex-col gap-10">
      <img src="/assets/common/404.svg" alt="" className="h-40" />
      <p className="text-xl">{text || "No Data Found"}</p>
    </div>
  );
};

export default NoDataFound;
