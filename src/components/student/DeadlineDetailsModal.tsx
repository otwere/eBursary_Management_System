
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/utils/format";
import { Clock, Calendar, School, FileText, AlertCircle, CheckCircle, Info, Users, GraduationCap } from "lucide-react";
import { ApplicationDeadline } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DeadlineDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deadline: ApplicationDeadline | null;
}

const DeadlineDetailsModal: React.FC<DeadlineDetailsModalProps> = ({
  isOpen,
  onClose,
  deadline
}) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  if (!deadline) return null;

  // Calculate time remaining
  const closingDate = new Date(deadline.closingDate);
  const currentDate = new Date();
  const timeRemaining = closingDate.getTime() - currentDate.getTime();
  const isExpired = timeRemaining <= 0;
  
  // Calculate days, hours, minutes remaining
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  // Check if student's institution type matches the deadline's institution type
  const canApply = authState.user?.institutionType === deadline.institutionType && !isExpired && deadline.isActive;

  // Format dates for display
  const formattedDeadline = formatDate(closingDate);
  const formattedOpeningDate = formatDate(new Date(closingDate.getTime() - 30 * 24 * 60 * 60 * 1000)); // Assuming 30 days before closing
  
  // Get eligibility message
  const getEligibilityMessage = () => {
    if (isExpired) return "This application period has closed";
    if (!deadline.isActive) return "This application period is not active";
    if (authState.user?.institutionType !== deadline.institutionType) {
      return `You are registered as a ${authState.user?.institutionType} student, but this is for ${deadline.institutionType} students`;
    }
    return "You are eligible to apply for this bursary";
  };

  // Get eligibility status color
  const getEligibilityColor = () => {
    if (canApply) return "text-green-600 bg-green-50 border-green-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-blue-100 -mx-2 h-16 border-l-4 border-green-500 rounded">
          <DialogTitle className="text-xl flex items-center gap-2">
            <School className="h-5 w-5 text-primary mx-2 " />
            {deadline.institutionType} Application Details
          </DialogTitle>
          <DialogDescription className="mx-3">
            Academic Year : {deadline.academicYear}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded ${
            isExpired ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'
          } flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
            <div className="flex items-center gap-2">
              {isExpired ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Clock className="h-5 w-5 text-blue-500" />
              )}
              <span className="font-medium">
                {isExpired ? "Application Closed" : "Application Open"}
              </span>
            </div>
            <Badge variant="outline" className={
              isExpired ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
            }>
              Closing Date: {formattedDeadline}
            </Badge>
          </div>

          {/* Countdown Timer */}
          {!isExpired && (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Time Remaining
                </h3>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded bg-blue-50">
                    <div className="text-2xl font-bold text-blue-700">{daysRemaining}</div>
                    <div className="text-xs text-blue-600">Days</div>
                  </div>
                  <div className="p-3 rounded bg-blue-50">
                    <div className="text-2xl font-bold text-blue-700">{hoursRemaining}</div>
                    <div className="text-xs text-blue-600">Hours</div>
                  </div>
                  <div className="p-3 rounded bg-blue-50">
                    <div className="text-2xl font-bold text-blue-700">{minutesRemaining}</div>
                    <div className="text-xs text-blue-600">Minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Application Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-500">Description :</span>
                  <span className="text-sm font-medium">{deadline.description}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-500">Application Opens :</span>
                  <span className="text-sm font-medium">{formattedOpeningDate}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-500">Application Closes :</span>
                  <span className="text-sm font-medium">{formattedDeadline}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-500">Academic Year :</span>
                  <span className="text-sm font-medium">{deadline.academicYear}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm text-gray-500">Institution Type:</span>
                  <span className="text-sm font-medium">{deadline.institutionType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Information */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Eligibility Information
              </h3>
              
              <div className={`p-3 rounded border ${getEligibilityColor()}`}>
                <div className="flex items-center gap-2">
                  {canApply ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">{getEligibilityMessage()}</span>
                </div>
              </div>
              
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Must be a registered {deadline.institutionType} student</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Must submit application before the deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">All required documents must be submitted with Application</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => navigate("/student/applications/new")}
            disabled={!canApply}
          >
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeadlineDetailsModal;
