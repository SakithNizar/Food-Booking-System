import React from "react";
import CateringReportPDF from "../components/CateringReportPDF"; // The PDF component we built

const CateringReportPage = () => {
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden">
      <CateringReportPDF />
    </div>
  );
};

export default CateringReportPage;
