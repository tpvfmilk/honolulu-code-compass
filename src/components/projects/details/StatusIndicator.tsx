
import React from "react";

interface StatusIndicatorProps {
  status: "draft" | "in-progress" | "completed" | "needs-revision";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusColors = {
    "draft": "bg-gray-200 text-gray-800",
    "in-progress": "bg-blue-100 text-blue-800",
    "completed": "bg-green-100 text-green-800",
    "needs-revision": "bg-amber-100 text-amber-800",
  };
  
  const statusText = {
    "draft": "Draft",
    "in-progress": "In Progress",
    "completed": "Completed",
    "needs-revision": "Needs Revision",
  };

  return (
    <span className={`text-xs py-1 px-2 rounded-full ${statusColors[status]}`}>
      {statusText[status]}
    </span>
  );
};

export const getStatusConfig = () => {
  return {
    statusColors: {
      "draft": "bg-gray-200 text-gray-800",
      "in-progress": "bg-blue-100 text-blue-800",
      "completed": "bg-green-100 text-green-800",
      "needs-revision": "bg-amber-100 text-amber-800",
    },
    
    statusText: {
      "draft": "Draft",
      "in-progress": "In Progress",
      "completed": "Completed",
      "needs-revision": "Needs Revision",
    }
  };
};
