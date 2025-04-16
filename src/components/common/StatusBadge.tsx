import React from "react";
import { cn } from "@/lib/utils";
import { Application } from "@/types/auth";
import { APPLICATION_STATUS_COLORS, STATUS_LABELS } from "@/data/mockData";
import { CheckCircle, Clock, AlertCircle, RotateCw, FileCheck, Ban, Edit, FileText, DollarSign } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status: Application["status"];
  className?: string;
  showIcon?: boolean;
  showTooltip?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className, 
  showIcon = true,
  showTooltip = true 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "draft":
        return <Clock className="h-3 w-3 mr-1" />;
      case "submitted":
        return <FileCheck className="h-3 w-3 mr-1" />;
      case "under-review":
        return <RotateCw className="h-3 w-3 mr-1" />;
      case "corrections-needed":
        return <Edit className="h-3 w-3 mr-1" />;
      case "approved":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "allocated":
        return <DollarSign className="h-3 w-3 mr-1" />;
      case "disbursed":
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case "rejected":
        return <Ban className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case "draft":
        return "Your application has been saved as a draft and is not yet submitted.";
      case "submitted":
        return "Your application has been submitted and is waiting for review.";
      case "under-review":
        return "Your application is currently being reviewed by the ARO team.";
      case "corrections-needed":
        return "Your application requires additional information or corrections.";
      case "approved":
        return "Your application has been approved and is awaiting fund allocation.";
      case "allocated":
        return "Funds have been allocated for your application and are awaiting disbursement.";
      case "disbursed":
        return "Funds have been successfully disbursed to your institution.";
      case "rejected":
        return "Unfortunately, your application has been rejected.";
      default:
        return "";
    }
  };

  const badge = (
    <span 
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap inline-flex items-center",
        APPLICATION_STATUS_COLORS[status],
        className
      )}
    >
      {showIcon && getStatusIcon()}
      {STATUS_LABELS[status]}
    </span>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p>{getStatusDescription()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
};

// Default export
export default StatusBadge;

// Named export
export { StatusBadge };
