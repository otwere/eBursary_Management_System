
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getApplicationById } from "@/data/mockData";
import { StatusBadge } from "@/components/common/StatusBadge"; // Updated import
import StepsIndicator from "@/components/common/StepsIndicator";
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  FileText, 
  User, 
  School,
  GraduationCap,
  BookOpen,
  Building,
  Users,
  Briefcase,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Download
} from "lucide-react";
import { format } from "date-fns";

const DocumentList = ({ documents }: { documents: any[] }) => (
  <div className="space-y-3">
    {documents.map((doc, index) => (
      <div key={index} className="flex items-center justify-between border rounded p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-primary-500 mr-3" />
          <div>
            <p className="font-medium">{doc.documentType}</p>
            <p className="text-xs text-gray-500">
              Uploaded on {format(new Date(doc.uploadDate), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
        <StatusBadge status={doc.status === "approved" ? "approved" : doc.status === "rejected" ? "rejected" : "submitted"} className="capitalize" />
      </div>
    ))}
  </div>
);

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  const application = id ? getApplicationById(id) : null;
  
  if (!application) {
    return (
      <DashboardLayout title="Application Not Found">
        <div className="bg-white p-4 rounded border text-center">
          <h2 className="text-xl font-medium mb-4">Application Not Found</h2>
          <p className="text-gray-600 mb-4">
            The application you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/student/applications")}>
            Back to Applications
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  if (authState.user && application.studentId !== authState.user.id) {
    return (
      <DashboardLayout title="Unauthorized">
        <div className="bg-white p-4 rounded border text-center">
          <h2 className="text-xl font-medium mb-4">Unauthorized Access</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to view this application.
          </p>
          <Button onClick={() => navigate("/student/applications")}>
            Back to Applications
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleWithdraw = () => {
    setIsWithdrawing(true);
    
    setTimeout(() => {
      setIsWithdrawing(false);
      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn.",
      });
      navigate("/student/applications");
    }, 1500);
  };
  
  // Can only edit when application requires corrections or is in draft state
  const canEdit = ["draft", "corrections-needed"].includes(application?.status || "");
  
  // Can only withdraw when application is in the early stages of processing
  const canWithdraw = ["submitted", "under-review"].includes(application?.status || "");
  
  const steps = [
    { 
      id: 1, 
      name: "Submitted", 
      status: (["submitted", "under-review", "corrections-needed", "approved", "allocated", "disbursed"].includes(application?.status || "") ? "complete" : "upcoming") as "complete" | "upcoming" | "current"
    },
    { 
      id: 2, 
      name: "Under Review", 
      status: (["under-review", "corrections-needed", "approved", "allocated", "disbursed"].includes(application?.status || "") 
        ? "complete" 
        : application?.status === "submitted" ? "current" : "upcoming") as "complete" | "upcoming" | "current"
    },
    { 
      id: 3, 
      name: "Approved", 
      status: (["approved", "allocated", "disbursed"].includes(application?.status || "") 
        ? "complete" 
        : application?.status === "under-review" || application?.status === "corrections-needed" ? "current" : "upcoming") as "complete" | "upcoming" | "current"
    },
    { 
      id: 4, 
      name: "Allocated", 
      status: (["allocated", "disbursed"].includes(application?.status || "") 
        ? "complete" 
        : application?.status === "approved" ? "current" : "upcoming") as "complete" | "upcoming" | "current"
    },
    { 
      id: 5, 
      name: "Disbursed", 
      status: (["disbursed"].includes(application?.status || "") 
        ? "complete" 
        : application?.status === "allocated" ? "current" : "upcoming") as "complete" | "upcoming" | "current"
    }
  ];
  
  return (
    <DashboardLayout title="Application Details">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/student/applications")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded border shadow-none">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-4">
              <School className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">Application #{application?.id.slice(-6)}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Applied on {format(new Date(application?.applicationDate || new Date()), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
          
          <StatusBadge status={application?.status || "draft"} className="text-sm md:self-start" />
        </div>
      </div>
      
      <div className="bg-white rounded border p-4 mb-6 shadow-none">
        <h3 className="font-medium text-lg mb-4">Application Progress</h3>
        <StepsIndicator steps={steps} />
      </div>
      
      {application?.reviewComments && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <div className="mt-1">
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <CardTitle className="text-lg text-orange-800">Review Comments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">{application.reviewComments}</p>
            {application.status === "corrections-needed" && (
              <div className="mt-4 p-4 bg-orange-100 rounded border border-orange-200">
                <div className="flex items-start gap-3">
                  <Edit className="h-5 w-5 text-orange-800 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-800">Action Required</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Your application requires corrections. Please click the "Edit Application" button to make the necessary changes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-none">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-500" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <BookOpen className="h-4 w-4 text-primary-500 mr-2" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-sm text-gray-500">Institution Type</p>
                    <p className="font-medium">{application.institutionType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Institution Name</p>
                    <p className="font-medium">{application.institutionName}</p>
                  </div>
                  {application.courseOfStudy && (
                    <div>
                      <p className="text-sm text-gray-500">Course of Study</p>
                      <p className="font-medium">{application.courseOfStudy}</p>
                    </div>
                  )}
                  {application.yearOfStudy && (
                    <div>
                      <p className="text-sm text-gray-500">Year of Study</p>
                      <p className="font-medium">{application.yearOfStudy}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {application.familyInfo && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Users className="h-4 w-4 text-primary-500 mr-2" />
                    Family Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                    <div>
                      <p className="text-sm text-gray-500">Guardian Name</p>
                      <p className="font-medium">{application.familyInfo.guardianName || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p className="font-medium">{application.familyInfo.relationshipToApplicant || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation</p>
                      <p className="font-medium">{application.familyInfo.occupation || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Monthly Income (KES)</p>
                      <p className="font-medium">{application.familyInfo.monthlyIncome?.toLocaleString() || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Number of Dependents</p>
                      <p className="font-medium">{application.familyInfo.dependents || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {application.financialInfo && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <DollarSign className="h-4 w-4 text-primary-500 mr-2" />
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                      <div>
                        <p className="text-sm text-gray-500">Total Fees (KES)</p>
                        <p className="font-medium">{application.financialInfo.totalFees?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Other Scholarships (KES)</p>
                        <p className="font-medium">{application.financialInfo.otherScholarships?.toLocaleString() || "0"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Requested Amount (KES)</p>
                        <p className="font-medium">{application.financialInfo.requestedAmount?.toLocaleString()}</p>
                      </div>
                      {application.allocationAmount && (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-sm text-gray-500">Allocated Amount (KES)</p>
                          <p className="font-medium text-green-600">{application.allocationAmount.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {application.documents && application.documents.length > 0 && (
            <Card className="shadow-none">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-500" />
                  Supporting Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <DocumentList documents={application.documents} />
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-none">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <StatusBadge status={application.status} className="mt-1" />
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Application Date</p>
                    <p className="font-medium">{format(new Date(application.applicationDate), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                
                {application.reviewedBy && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Reviewed By</p>
                      <p className="font-medium">{application.reviewedBy}</p>
                    </div>
                  </div>
                )}
                
                {application.allocatedBy && application.allocationDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Allocation Date</p>
                      <p className="font-medium">{format(new Date(application.allocationDate), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                )}
                
                {application.disbursedBy && application.disbursementDate && (
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded border border-green-200">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Disbursement Date</p>
                      <p className="font-medium text-green-600">{format(new Date(application.disbursementDate), 'MMMM dd, yyyy')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-none">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {canEdit && (
                  <Button 
                    className="w-full"
                    onClick={() => navigate(`/student/applications/${application?.id}/edit`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {application?.status === "corrections-needed" ? "Make Corrections" : "Edit Application"}
                  </Button>
                )}
                
                {canWithdraw && (
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw Application"}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/student/applications")}
                >
                  View All Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationDetail;
