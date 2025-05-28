
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Application, StudentDocument, ApplicationStatus } from "@/types/auth";
import ApplicationReviewForm from "@/components/ARO/ApplicationReviewForm";
import DocumentVerificationChecklist from "@/components/ARO/DocumentVerificationChecklist";
import { formatDate, formatCurrency } from "@/utils/format";
import { ArrowLeft, Calendar, PieChart, User, DollarSign, School, Clock, FileText, CheckSquare, AlertCircle, Send, Lock } from "lucide-react";
import { toast } from "sonner";
import { mockApplications } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { getApplicationPermissions } from "@/utils/rbac";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { authState } = useAuth();
  
  // Define mock required documents
  const requiredDocuments = [
    { id: "id-card", name: "National ID Card", required: true, submitted: false },
    { id: "birth-cert", name: "Birth Certificate", required: true, submitted: false },
    { id: "transcript", name: "Academic Transcript", required: true, submitted: false },
    { id: "fee-structure", name: "Fee Structure", required: true, submitted: false },
    { id: "admission-letter", name: "Admission Letter", required: false, submitted: false },
    { id: "guardian-id", name: "Guardian ID", required: true, submitted: false },
  ];
  
  // Define mock submitted documents
  const mockDocuments: StudentDocument[] = [
    { 
      id: "id-card", 
      name: "National ID Card", 
      type: "image", 
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", 
      required: true,
      status: 'pending'
    },
    { 
      id: "birth-cert", 
      name: "Birth Certificate", 
      type: "pdf", 
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
      required: true,
      status: 'pending'
    },
    { 
      id: "transcript", 
      name: "Academic Transcript", 
      type: "pdf", 
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", 
      required: true,
      status: 'pending'
    },
    { 
      id: "income-proof", 
      name: "Proof of Income", 
      type: "image", 
      url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", 
      required: false,
      status: 'pending'
    },
  ];

  const userRole = authState.user?.role || "student";
  const permissions = getApplicationPermissions(userRole);

  useEffect(() => {
    // In a real app, we would fetch from an API
    const fetchedApplications = mockApplications;
    const foundApplication = fetchedApplications.find(app => app.id === id);
    setApplication(foundApplication || null);
  }, [id]);
  
  const handleReviewSubmit = (reviewData: any) => {
    // Update application in the state
    if (application) {
      // Set new status based on review data
      let newStatus: ApplicationStatus = reviewData.status as ApplicationStatus;
      
      // If approved and should be submitted to FAO, change status to pending-allocation
      if (reviewData.status === 'approved' && reviewData.submitToFAO) {
        newStatus = 'pending-allocation';
        // Would trigger notification to FAO in a real application
      }
      
      const updatedApplication: Application = {
        ...application,
        status: newStatus,
        reviewComments: reviewData.comments,
        approvedAmount: reviewData.approvedAmount,
        lastUpdated: new Date().toISOString(),
        submittedToFAO: reviewData.submitToFAO && reviewData.status === 'approved'
      };
      
      setApplication(updatedApplication);
      
      // Show appropriate toast message based on the action
      if (reviewData.status === 'approved') {
        if (reviewData.submitToFAO) {
          toast.success("Application Approved and Submitted to FAO for Allocation");
        } else {
          toast.success("Application Approved Successfully");
          return{}
        }
      } else {
        toast.success("Application review submitted successfully");
      }
    }
    
    setIsReviewModalOpen(false);
  };
  
  const handleDocumentVerification = (verificationResults: any) => {
    if (application) {
      // In a real app, we would send this to the backend
      console.log("Document verification results:", verificationResults);
      
      // Update the application
      const updatedApplication: Application = {
        ...application,
        documentsVerified: true,
        lastUpdated: new Date().toISOString()
      };
      
      setApplication(updatedApplication);
      toast.success("Document verification completed successfully");
    }
  };
  
  const handleRequestDocuments = (missingDocuments: string[]) => {
    if (application) {
      // In a real app, we would send this to the backend
      console.log("Requesting missing documents:", missingDocuments);
      
      // Update the application
      const updatedApplication: Application = {
        ...application,
        status: "corrections-needed",
        reviewComments: "Please upload the missing required documents.",
        lastUpdated: new Date().toISOString()
      };
      
      setApplication(updatedApplication);
      toast.success("Document request sent to the applicant");
    }
  };

  const handleSubmitToFAO = () => {
    if (application) {
      const updatedApplication: Application = {
        ...application,
        status: "pending-allocation",
        lastUpdated: new Date().toISOString(),
        submittedToFAO: true
      };
      
      setApplication(updatedApplication);
      toast.success("Application submitted to FAO for allocation");
    }
  };

  if (!application) {
    return (
      <DashboardLayout title="Application Details">
        <div className="text-center py-10">
          <p>Loading application details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const isPendingFAO = application.status === 'pending-allocation';
  const isApproved = application.status === 'approved';
  const canSubmitToFAO = permissions.canSubmitToFAO && isApproved;

  return (
    <DashboardLayout title="Application Details">
      <div className="space-y-6 lg:-mx-[80px]">
        <div className="flex items-center justify-between bg-gray-100 h-20 border-l-4   border-l-blue-500 rounded ">
          <div className="flex items-center space-x-4  rounded h-12 pl-2 ">
            {/* <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded px-10"
              onClick={() => navigate("/ARO/applications")}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button> */}
            <h2 className="text-xl font-bold text-blue-800 mt-[-3rem]">Application Details</h2>
          </div>
          <div className="flex items-center gap-2 mx-2">
            <StatusBadge status={application.status} />
            
            {isPendingFAO && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                <Send className="h-3 w-3" /> Pending FAO Review
              </span>
            )}
          </div>
        </div>
        
        {isPendingFAO && (
          <Alert className="bg-blue-50 border-blue-200">
            <Send className="h-4 w-4 text-blue-700" />
            <AlertTitle className="text-blue-700 font-bold">Pending FAO Review</AlertTitle>
            <AlertDescription className="text-blue-600">
              This Application has been Approved and submitted to the Financial Allocations Officer for fund Allocation.
            </AlertDescription>
          </Alert>
        )}
        
        {isApproved && !application.submittedToFAO && canSubmitToFAO && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-700" />
            <AlertTitle className="text-amber-700">Approved But Not Submitted</AlertTitle>
            <AlertDescription className="text-amber-600 flex justify-between items-center">
              <span>This Application is Approved but not yet Submitted to the FAO for Fund Allocation.</span>
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={handleSubmitToFAO}
              >
                <Send className="h-4 w-4 mr-1" /> Submit to FAO
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {application.status === 'approved' && !permissions.canSubmitToFAO && (
          <Alert className="bg-gray-50 border-gray-200">
            <Lock className="h-4 w-4 text-gray-700" />
            <AlertTitle className="text-gray-700">Permission Required</AlertTitle>
            <AlertDescription className="text-gray-600">
              You do not have permission to submit Applications to FAO. Only AROs with submission rights can perform this action.
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="border-l-4 border-l-amber-500 pl-2 -mx-4 h-16">
                <CardTitle className="text-xl font-bold text-blue-800">Application #{application.id}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Submitted on {formatDate(new Date(application.applicationDate))}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={application.documentsVerified ? "outline" : "default"}
                  className={application.documentsVerified ? "bg-green-50 border-green-200" : ""}
                  onClick={() => {}}
                >
                  {application.documentsVerified ? (
                    <CheckSquare className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  )}
                  {application.documentsVerified ? "Documents Verified" : "Verify Documents"}
                </Button>
                
                <Button onClick={() => setIsReviewModalOpen(true)} disabled={application.status === "pending-allocation"}>
                  <Clock className="mr-2 h-4 w-4" />
                  Review Application
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <Tabs defaultValue="details">
            <div className="px-6">
              <TabsList className="w-full justify-start lg:space-x-64">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Applicant Details
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Details
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Status History
                </TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="pt-6">
              <TabsContent value="details">
                <div className="grid md:grid-cols-2 gap-8 border-t-2">
                  <div className="space-y-6  mt-4">
                    <div className="border-l-4  border-l-blue-500  pl-4 rounded">
                      <h3 className="text-lg  text-primary-800 font-bold flex items-center gap-2">
                        <User className="h-5 w-5 text-primary-500" />
                        Student Information
                      </h3>
                      <Separator className="my-2" />
                      <dl className="space-y-2">
                        <div className="grid grid-cols-2 py-1">
                          <dt className="text-sm font-medium text-gray-500">Name:</dt>
                          <dd>{application.studentName || "Unknown"}</dd>
                        </div>
                        <div className="grid grid-cols-2 py-1 border-t">
                          <dt className="text-sm font-medium text-gray-500">Student ID:</dt>
                          <dd>{application.studentId}</dd>
                        </div>
                        <div className="grid grid-cols-2 py-1 border-t">
                          <dt className="text-sm font-medium text-gray-500">Course/Program:</dt>
                          <dd>{application.courseOfStudy || "Not specified"}</dd>
                        </div>
                        <div className="grid grid-cols-2 py-1 border-t">
                          <dt className="text-sm font-medium text-gray-500">Academic Year:</dt>
                          <dd>{application.academicYear || "Not specified"}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="border-l-4 border-amber-500 pl-4 rounded"> 
                      <h3 className="text-lg text-primary-800 font-bold flex items-center gap-2">
                        <School className="h-5 w-5 text-primary-500" />
                        Institution Information
                      </h3>
                      <Separator className="my-2" />
                      <dl className="space-y-2">
                        <div className="grid grid-cols-2 py-1">
                          <dt className="text-sm font-medium text-gray-500">Institution Name:</dt>
                          <dd>{application.institutionName}</dd>
                        </div>
                        <div className="grid grid-cols-2 py-1 border-t">
                          <dt className="text-sm font-medium text-gray-500">Institution ID:</dt>
                          <dd>{application.institutionId}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  <div className="space-y-6 mt-4">
                    <div className="border-l-4 border-l-lime-500 pl-4 rounded">
                      <h3 className="text-lg text-primary-800 font-bold flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary-500" />
                        Funding Information
                      </h3>
                      <Separator className="my-2" />
                      <dl className="space-y-2">
                        <div className="grid grid-cols-2 py-1">
                          <dt className="text-sm font-medium text-gray-500">Requested Amount:</dt>
                          <dd className="font-semibold text-primary-600">{formatCurrency(application.requestedAmount)}</dd>
                        </div>
                        
                        {application.approvedAmount && (
                          <div className="grid grid-cols-2 py-1 border-t">
                            <dt className="text-sm font-medium text-gray-500">Approved Amount:</dt>
                            <dd className={`font-semibold ${isPendingFAO || !permissions.canEditAllocationAmount ? "text-gray-600 flex items-center" : "text-green-600"}`}>
                              {formatCurrency(application.approvedAmount)}
                              
                              {!permissions.canEditAllocationAmount && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Lock className="h-3 w-3" /> 
                                  <span>Only FAO can edit</span>
                                </span>
                              )}
                            </dd>
                          </div>
                        )}
                        
                        {application.disbursedAmount && (
                          <div className="grid grid-cols-2 py-1 border-t">
                            <dt className="text-sm font-medium text-gray-500">Disbursed Amount:</dt>
                            <dd className="font-semibold text-green-700">{formatCurrency(application.disbursedAmount)}</dd>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 py-1 border-t">
                          <dt className="text-sm font-medium text-gray-500">Fund Category:</dt>
                          <dd>{application.fundCategory || "Not categorized"}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="border-l-4 border-l-purple-500 pl-4 rounded">
                      <h3 className="text-lg text-primary-800 font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary-500" />
                        Application Timeline
                      </h3>
                      <Separator className="my-2" />
                      <dl className="space-y-2">
                        <div className="grid grid-cols-2 py-1">
                          <dt className="text-sm font-medium text-gray-500">Submitted Date:</dt>
                          <dd>{formatDate(new Date(application.applicationDate))}</dd>
                        </div>
                        
                        {application.lastUpdated && (
                          <div className="grid grid-cols-2 py-1 border-t">
                            <dt className="text-sm font-medium text-gray-500">Last Updated:</dt>
                            <dd>{formatDate(new Date(application.lastUpdated))}</dd>
                          </div>
                        )}
                        
                        {application.submittedToFAO && (
                          <div className="grid grid-cols-2 py-1 border-t">
                            <dt className="text-sm font-medium text-gray-500">Submitted to FAO:</dt>
                            <dd className="flex items-center gap-1 text-blue-600">
                              <Send className="h-3 w-3" />
                              {application.lastUpdated ? formatDate(new Date(application.lastUpdated)) : "Unknown date"}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                </div>
                
                {application.reviewComments && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      Review Comments
                    </h4>
                    <p className="text-gray-700">{application.reviewComments}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentVerificationChecklist
                  applicationId={application.id}
                  documents={mockDocuments}
                  requiredDocuments={requiredDocuments}
                  onVerifyDocuments={handleDocumentVerification}
                  onRequestDocuments={handleRequestDocuments}
                />
              </TabsContent>
              
              <TabsContent value="financial">
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3 border-l-4 border-l-blue-500 mb-4 border-b-2 rounded">
                      <CardTitle className="text-lg font-bold text-blue-800 mb-[-0.5rem]">Financial Summary</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Overview of the Financial Details for this Application | <span className="font-bold"> #{application.id}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 ">
                        <div className="p-4 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-center border-l-4 border-l-blue-700 rounded">
                          <p className="text-xs text-blue-600 uppercase font-medium">Requested</p>
                          <p className="text-xl font-bold text-blue-700">{formatCurrency(application.requestedAmount)}</p>
                        </div>
                        
                        <div className="p-4 bg-green-50 hover:bg-green-100 border border-green-100 border-l-4 border-l-green-500 rounded text-center">
                          <p className="text-xs text-green-600 uppercase font-medium">Approved</p>
                          <p className="text-xl font-bold text-green-700">
                            {application.approvedAmount 
                              ? formatCurrency(application.approvedAmount) 
                              : "Pending"}
                          </p>
                          
                          {application.approvedAmount && !permissions.canEditAllocationAmount && (
                            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-600">
                              <Lock className="h-3 w-3" />
                              <span>FAO access only</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 bg-purple-50 hover:bg-purple-100 border-l-4 border-l-purple-500 border border-purple-100 rounded text-center">
                          <p className="text-xs text-purple-600 uppercase font-medium">Disbursed</p>
                          <p className="text-xl font-bold text-purple-700">
                            {application.disbursedAmount 
                              ? formatCurrency(application.disbursedAmount) 
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">More detailed Financial Information will be available once the Application is Approved.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="relative border-l-2 border-gray-200 ml-3 pl-8 space-y-8 py-4">
                  <div className="relative">
                    <div className="absolute -left-[41px] bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center">
                      <PieChart className="h-3 w-3 text-white" />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded">
                      <h4 className="text-sm font-medium">Application Submitted</h4>
                      <time className="text-xs text-gray-500 mt-1 block">
                        {formatDate(new Date(application.applicationDate))}
                      </time>
                      <p className="mt-2 text-sm">
                        Student submitted application for {formatCurrency(application.requestedAmount)}
                      </p>
                    </div>
                  </div>
                  
                  {application.lastUpdated && application.reviewComments && (
                    <div className="relative">
                      <div className="absolute -left-[41px] bg-amber-500 h-6 w-6 rounded-full flex items-center justify-center">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-amber-50 border border-amber-100 p-4 rounded">
                        <h4 className="text-sm font-medium">Review Comments Added</h4>
                        <time className="text-xs text-gray-500 mt-1 block">
                          {formatDate(new Date(application.lastUpdated))}
                        </time>
                        <p className="mt-2 text-sm">
                          {application.reviewComments}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {(application.status === "approved" || application.status === "pending-allocation") && application.approvedAmount && (
                    <div className="relative">
                      <div className="absolute -left-[41px] bg-green-500 h-6 w-6 rounded-full flex items-center justify-center">
                        <CheckSquare className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-green-50 border border-green-100 p-4 rounded">
                        <h4 className="text-sm font-medium">Application Approved</h4>
                        <time className="text-xs text-gray-500 mt-1 block">
                          {formatDate(new Date(application.lastUpdated || application.applicationDate))}
                        </time>
                        <p className="mt-2 text-sm">
                          Application approved for {formatCurrency(application.approvedAmount)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {application.status === "pending-allocation" && (
                    <div className="relative">
                      <div className="absolute -left-[41px] bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center">
                        <Send className="h-3 w-3 text-white" />
                      </div>
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded">
                        <h4 className="text-sm font-medium">Submitted to FAO</h4>
                        <time className="text-xs text-gray-500 mt-1 block">
                          {formatDate(new Date(application.lastUpdated || application.applicationDate))}
                        </time>
                        <p className="mt-2 text-sm">
                          Application Submitted to Financial Allocations Officer for Fund Allocation
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="border-t bg-gray-50">
            <Button 
              variant="outline" 
              className="ml-auto mt-4"
              onClick={() => navigate("/ARO/applications")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Application review modal */}
      {isReviewModalOpen && (
        <ApplicationReviewForm
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          application={application}
          onSubmit={handleReviewSubmit}
        />
      )}
    </DashboardLayout>
  );
};

export default ApplicationDetail;
