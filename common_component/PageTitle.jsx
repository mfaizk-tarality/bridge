import React from "react";

const PageTitle = ({ title, subtitle }) => {
  return (
    <div>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {subtitle && <p className="text-description">{subtitle}</p>}
    </div>
  );
};

export default PageTitle;
