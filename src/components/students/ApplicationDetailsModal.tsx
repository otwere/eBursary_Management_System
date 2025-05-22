
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/utils/format";
import { 
  Clock, Calendar, School, DollarSign, FileText, 
  User, Book, AlertCircle, CheckCircle, Download,
  Mail, ArrowUpRight, BookOpen, CreditCard, GraduationCap
} from "lucide-react";
import { Application } from "@/types/auth";

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  if (!application) return null;

  const getStatusIcon = () => {
    switch (application.status) {
      case "submitted":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "under-review":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColors = () => {
    switch (application.status) {
      case "submitted":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "under-review":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "allocated":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "disbursed":
        return "bg-teal-50 text-teal-800 border-teal-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getProgressValue = () => {
    switch (application.status) {
      case "submitted":
        return 20;
      case "under-review":
        return 40;
      case "approved":
        return 60;
      case "allocated":
        return 80;
      case "disbursed":
        return 100;
      case "rejected":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-50">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            Application Details
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <span className="text-gray-500">Reference ID :</span>
            <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-xs font-mono">
              {application.id}
            </code>
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Status Card */}
          <div className={`p-4 rounded-lg ${getStatusColors()} border flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium">Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1).replace("-", " ")}</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {formatDate(new Date(application.applicationDate))}
            </Badge>
          </div>

          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Application Progress</span>
              <span>{getProgressValue()}%</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>

          {/* Application Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-indigo-50">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                  </div>
                  Academic Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Institution:</span>
                    <span className="text-sm font-medium">{application.institutionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Program:</span>
                    <span className="text-sm font-medium">{application.courseOfStudy || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Year of Study:</span>
                    <span className="text-sm font-medium">{application.yearOfStudy || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <div className="p-1.5 rounded-full bg-green-50">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  Financial Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Requested Amount:</span>
                    <span className="text-sm font-medium">{formatCurrency(application.requestedAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Approved Amount:</span>
                    <span className="text-sm font-medium">{application.approvedAmount ? formatCurrency(application.approvedAmount) : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Disbursed:</span>
                    <span className="text-sm font-medium">{application.disbursedAmount ? formatCurrency(application.disbursedAmount) : "-"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-blue-50">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                Application Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 rounded-full bg-green-100 border border-green-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(new Date(application.applicationDate))}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full ${application.status !== "submitted" ? "bg-green-100 border border-green-500" : "bg-gray-100 border border-gray-300"} flex items-center justify-center`}>
                      {application.status !== "submitted" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Review by ARO</p>
                    <p className="text-xs text-gray-500">{application.reviewDate ? formatDate(new Date(application.reviewDate)) : "Pending"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-6 w-6 rounded-full ${application.status === "approved" || application.status === "allocated" || application.status === "disbursed" ? "bg-green-100 border border-green-500" : "bg-gray-100 border border-gray-300"} flex items-center justify-center`}>
                      {application.status === "approved" || application.status === "allocated" || application.status === "disbursed" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Approval by FAO</p>
                    <p className="text-xs text-gray-500">{application.approvalDate ? formatDate(new Date(application.approvalDate)) : "Pending"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                    {application.status === "disbursed" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Funds Disbursed</p>
                    <p className="text-xs text-gray-500">{application.disbursementDate ? formatDate(new Date(application.disbursementDate)) : "Pending"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Documents Section */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-orange-50">
                  <FileText className="h-4 w-4 text-orange-600" />
                </div>
                Documents & Notes
              </h3>
              <div className="space-y-2">
                {application.documents && application.documents.length > 0 ? (
                  <div className="space-y-2">
                    {application.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 transition-colors">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm flex-grow">{doc.name}</span>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No documents available</p>
                )}

                {application.reviewComments && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Review Comments:</h4>
                    <p className="text-sm text-gray-700 p-3 bg-amber-50 border border-amber-100 rounded-md">{application.reviewComments}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4 flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Open Full Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;
