
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge"; 
import { Eye, ArrowRight, Clock, Calendar, School, FileText, MoreHorizontal, Download, X } from "lucide-react";
import { Application } from "@/types/auth";
import { formatDate, formatCurrency } from "@/utils/format";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ApplicationCardProps {
  application: Application;
  viewPath?: string;
  onViewDetails?: () => void;
  onAction?: (action: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  viewPath,
  onViewDetails,
  onAction
}) => {
  const navigate = useNavigate();
  
  // Calculate days since application
  const daysSinceApplication = () => {
    const today = new Date();
    const appDate = new Date(application.applicationDate);
    const differenceInTime = today.getTime() - appDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };
  
  const handleViewClick = () => {
    if (onViewDetails) {
      onViewDetails();
    }
  };
  
  const handleActionClick = (action: string) => {
    if (onAction) {
      onAction(action);
    }
  };
  
  const handleNavigate = () => {
    if (viewPath) {
      navigate(viewPath);
    } else if (onAction) {
      onAction("view");
    }
  };

  // Determine status color for the card indicator
  const getStatusColor = () => {
    switch(application.status) {
      case "approved":
      case "disbursed": 
        return "bg-green-500";
      case "rejected": 
        return "bg-red-500";
      case "under-review": 
        return "bg-blue-500";
      case "corrections-needed":
        return "bg-orange-500";
      default: 
        return "bg-amber-400";
    }
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 bg-white">
      <div className={`h-1.5 w-full ${getStatusColor()}`} />
      <CardContent className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-primary-50 mr-3">
              <School className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {application.institutionName}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {application.courseOfStudy || "No course specified"}
              </p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <span className="text-gray-500 block text-xs">Submitted</span>
              <span className="font-medium">{formatDate(new Date(application.applicationDate))}</span>
            </div>
          </div>
          <div className="flex items-center text-sm">           
            <div>
              <span className="text-gray-500 block text-xs">Amount</span>
              <span className="font-semibold text-primary-700">{formatCurrency(application.requestedAmount)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Reference :</span>
            <span className="font-medium text-gray-700">{application.id}</span>
          </div>
          
          {application.disbursedAmount && (
            <div className="flex justify-between">
              <span className="text-gray-500">Received:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(application.disbursedAmount)}
              </span>
            </div>
          )}
          {application.fundCategory && (
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="text-gray-700">{application.fundCategory}</span>
            </div>
          )}
          {application.lastUpdated && (
            <div className="flex justify-between">
              <span className="text-gray-500">Last Updated:</span>
              <span className="text-gray-700">{formatDate(new Date(application.lastUpdated))}</span>
            </div>
          )}
        </div>
        
        {application.reviewComments && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md text-sm">
            <p className="text-gray-700 font-medium text-xs mb-1">Review comments:</p>
            <p className="text-gray-700">{application.reviewComments}</p>
          </div>
        )}
        
        {(application.status === "submitted" || application.status === "under-review") && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            <span>{daysSinceApplication()} days since submission</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 border-t p-4 bg-gray-50">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleViewClick}
        >
          <Eye className="mr-1 h-3.5 w-3.5" />
          View Details
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleActionClick("download")}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleActionClick("print")}>
              <FileText className="mr-2 h-4 w-4" />
              Print Details
            </DropdownMenuItem>
            {application.status === "draft" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleActionClick("delete")} className="text-red-600">
                  <X className="mr-2 h-4 w-4" />
                  Delete Draft
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={handleNavigate}
        >
          Open
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
