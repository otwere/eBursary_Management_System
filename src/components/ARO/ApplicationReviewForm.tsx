
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Application } from "@/types/auth";
import { formatDate, formatCurrency } from "@/utils/format";
import { AlertTriangle, CheckCircle, FileText, RotateCw, X, ArrowUpDown, Lock, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { getApplicationPermissions } from "@/utils/rbac";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface ApplicationReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onSubmit: (data: any) => void;
}

const ApplicationReviewForm: React.FC<ApplicationReviewFormProps> = ({
  isOpen,
  onClose,
  application,
  onSubmit
}) => {
  const [status, setStatus] = useState<string>(application.status === "submitted" ? "under-review" : application.status);
  const [comments, setComments] = useState<string>(application.reviewComments || "");
  const [approvedAmount, setApprovedAmount] = useState<number>(application.approvedAmount || application.requestedAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitToFAO, setSubmitToFAO] = useState<boolean>(true);
  
  const { authState } = useAuth();
  const userRole = authState.user?.role || "student";
  const permissions = getApplicationPermissions(userRole);
  
  const canEditAmount = permissions.canAllocate;
  const canApprove = permissions.canApprove;
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Create the review data object
    const reviewData = {
      applicationId: application.id,
      status,
      comments,
      approvedAmount: status === "approved" ? approvedAmount : undefined,
      submitToFAO: status === "approved" && submitToFAO
    };
    
    // Submit the review
    setTimeout(() => {
      onSubmit(reviewData);
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-50">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            Review Application
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">ID:</span>
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs font-mono">
                {application.id}
              </code>
            </div>
            <StatusBadge status={application.status} />
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-medium">{application.studentName || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="font-medium">{application.institutionName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course/Program</p>
              <p className="font-medium">{application.courseOfStudy || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Requested Amount</p>
              <p className="font-medium">{formatCurrency(application.requestedAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium">{formatDate(new Date(application.applicationDate))}</p>
            </div>
          </div>
          
          {application.reviewComments && (
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <AlertTitle>Previous Review Comments</AlertTitle>
              <AlertDescription>{application.reviewComments}</AlertDescription>
            </Alert>
          )}
          
          {!canApprove && (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <Lock className="h-4 w-4 text-blue-700" />
              <AlertTitle>Permission Note</AlertTitle>
              <AlertDescription>Only Application Review Officers can approve or reject applications.</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-base">Status Decision</Label>
            <RadioGroup 
              id="status" 
              value={status} 
              onValueChange={setStatus}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                <RadioGroupItem id="under-review" value="under-review" />
                <Label htmlFor="under-review" className="flex items-center cursor-pointer">
                  <RotateCw className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Mark as Under Review</span>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 border p-3 rounded-md ${canApprove ? "hover:bg-gray-50" : "opacity-60"}`}>
                <RadioGroupItem id="approved" value="approved" disabled={!canApprove} />
                <Label htmlFor="approved" className="flex items-center cursor-pointer">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Approve Application</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                <RadioGroupItem id="corrections-needed" value="corrections-needed" />
                <Label htmlFor="corrections-needed" className="flex items-center cursor-pointer">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  <span>Request Corrections</span>
                </Label>
              </div>
              
              <div className={`flex items-center space-x-2 border p-3 rounded-md ${canApprove ? "hover:bg-gray-50" : "opacity-60"}`}>
                <RadioGroupItem id="rejected" value="rejected" disabled={!canApprove} />
                <Label htmlFor="rejected" className="flex items-center cursor-pointer">
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  <span>Reject Application</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {status === "approved" && (
            <>
              <div className={`space-y-2 p-4 border rounded-md ${canEditAmount ? "bg-green-50" : "bg-gray-50"}`}>
                <div className="flex justify-between items-center">
                  <Label htmlFor="approvedAmount" className="text-base">Approved Amount</Label>
                  {!canEditAmount && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      <Lock className="h-3 w-3" />
                      <span>Only FAO can edit</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="approvedAmount"
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(Number(e.target.value))}
                    className="max-w-[200px]"
                    disabled={!canEditAmount}
                  />
                  <span className="text-sm text-gray-500">
                    Requested: {formatCurrency(application.requestedAmount)}
                  </span>
                  {approvedAmount !== application.requestedAmount && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                      <ArrowUpDown className="h-3 w-3 mr-1" />
                      {approvedAmount > application.requestedAmount 
                        ? `+${formatCurrency(approvedAmount - application.requestedAmount)}`
                        : `-${formatCurrency(application.requestedAmount - approvedAmount)}`}
                    </span>
                  )}
                </div>
                
                {canApprove && (
                  <div className="mt-4 flex items-center space-x-2 pt-2 border-t">
                    <Switch
                      id="submit-to-fao"
                      checked={submitToFAO}
                      onCheckedChange={setSubmitToFAO}
                    />
                    <Label htmlFor="submit-to-fao" className="flex items-center cursor-pointer">
                      <Send className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Automatically submit to FAO for allocation</span>
                    </Label>
                  </div>
                )}
              </div>
              
              {submitToFAO && canApprove && (
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <Send className="h-4 w-4 text-blue-700" />
                  <AlertTitle>Automatic Submission</AlertTitle>
                  <AlertDescription>
                    This application will be automatically submitted to the Financial Allocations Officer (FAO) for fund allocation when approved.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="comments" className="text-base">Review Comments</Label>
            <Textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={status === "corrections-needed" 
                ? "Specify what corrections the student needs to make..."
                : status === "rejected"
                ? "Provide the reason for rejection..."
                : "Enter your review comments or feedback for the student..."}
              className="min-h-24"
            />
            {status === "corrections-needed" && (
              <p className="text-sm text-amber-600">
                Please provide specific details about what needs to be corrected. 
                The student will receive these instructions.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (status === "corrections-needed" && !comments.trim())}
            className={status === "approved" 
              ? "bg-green-600 hover:bg-green-700" 
              : status === "rejected"
              ? "bg-red-600 hover:bg-red-700"
              : status === "corrections-needed"
              ? "bg-amber-600 hover:bg-amber-700"
              : ""}
          >
            {isSubmitting ? "Submitting..." : (
              status === "approved" 
                ? "Approve Application" 
                : status === "rejected"
                ? "Reject Application"
                : status === "corrections-needed"
                ? "Request Corrections"
                : "Submit Review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationReviewForm;
