import React from 'react';
import '../../styles/admin/ReportControls.css';

const ReportControls = ({ reportType, setReportType, dateRange, setDateRange }) => {
  const handleGenerateReport = () => {
    alert(`Report generated for ${reportType} from ${dateRange.startDate} to ${dateRange.endDate}`);
  };

  return (
    <div className="report-controls">
      <div className="report-type-selector">
        <h3>Report Type</h3>
        <div className="report-options">
          <label>
            <input
              type="radio"
              name="reportType"
              value="daily"
              checked={reportType === 'daily'}
              onChange={() => setReportType('daily')}
            />
            Daily
          </label>
          <label>
            <input
              type="radio"
              name="reportType"
              value="weekly"
              checked={reportType === 'weekly'}
              onChange={() => setReportType('weekly')}
            />
            Weekly
          </label>
          <label>
            <input
              type="radio"
              name="reportType"
              value="monthly"
              checked={reportType === 'monthly'}
              onChange={() => setReportType('monthly')}
            />
            Monthly
          </label>
          <label>
            <input
              type="radio"
              name="reportType"
              value="custom"
              checked={reportType === 'custom'}
              onChange={() => setReportType('custom')}
            />
            Custom
          </label>
        </div>
      </div>
      
      <div className="date-range-selector">
        <h3>Date Range</h3>
        <div className="date-inputs">
          <div className="date-input">
            <label>Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
            />
          </div>
          <div className="date-input">
            <label>End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      <button className="generate-report-btn" onClick={handleGenerateReport}>
        Generate Report
      </button>
    </div>
  );
};

export default ReportControls;
