
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationReviewForm from "@/components/ARO/ApplicationReviewForm";
import DocumentVerificationChecklist from "@/components/ARO/DocumentVerificationChecklist"; 
import { StatusBadge } from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { Application, StudentDocument, ApplicationStatus } from "@/types/auth";
import { Filter, Search, CheckSquare, AlertCircle, Clock, Send } from "lucide-react";
import { mockApplications } from "@/data/mockData";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const ApplicationsReview = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewMode, setReviewMode] = useState<"details" | "documents">("details");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
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
  
  // Fetch applications on component mount
  useEffect(() => {
    // In a real app, we would fetch from an API
    const fetchedApplications = mockApplications;
    setApplications(fetchedApplications);
    setFilteredApplications(fetchedApplications);
  }, []);
  
  // Filter applications when search query or status filter changes
  useEffect(() => {
    let filtered = applications;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.studentName?.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.institutionName.toLowerCase().includes(query)
      );
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchQuery, statusFilter]);

  const handleReviewApplication = (application: Application) => {
    setSelectedApplication(application);
    setReviewMode("details");
    setIsReviewModalOpen(true);
  };
  
  const handleVerifyDocuments = (application: Application) => {
    setSelectedApplication(application);
    setReviewMode("documents");
    setIsReviewModalOpen(true);
  };
  
  const handleReviewSubmit = (reviewData: any) => {
    // Update application status in the state
    const updatedApplications = applications.map(app => {
      if (app.id === reviewData.applicationId) {
        // Set new status based on review data
        let newStatus: ApplicationStatus = reviewData.status as ApplicationStatus;
        
        // If approved and should be submitted to FAO, change status to pending-allocation
        if (reviewData.status === 'approved' && reviewData.submitToFAO) {
          newStatus = 'pending-allocation';
          // Would trigger notification to FAO in a real application
        }
        
        return { 
          ...app, 
          status: newStatus,
          reviewComments: reviewData.comments,
          approvedAmount: reviewData.approvedAmount,
          lastUpdated: new Date().toISOString(),
          submittedToFAO: reviewData.submitToFAO && reviewData.status === 'approved'
        }
      }
      return app;
    });
    
    setApplications(updatedApplications);
    setIsReviewModalOpen(false);
    
    // Show appropriate toast message based on the action
    if (reviewData.status === 'approved') {
      if (reviewData.submitToFAO) {
        toast.success("Application approved and submitted to FAO for allocation");
      } else {
        toast.success("Application approved successfully");
      }
    } else {
      toast.success("Application review submitted successfully");
    }
  };
  
  const handleDocumentVerification = (verificationResults: any) => {
    if (selectedApplication) {
      // In a real app, we would send this to the backend
      console.log("Document verification results:", verificationResults);
      
      // Update the application
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { 
              ...app, 
              documentsVerified: true,
              lastUpdated: new Date().toISOString()
            }
          : app
      );
      
      setApplications(updatedApplications);
      setIsReviewModalOpen(false);
      toast.success("Document verification completed successfully");
    }
  };
  
  const handleRequestDocuments = (missingDocuments: string[]) => {
    if (selectedApplication) {
      // In a real app, we would send this to the backend
      console.log("Requesting missing documents:", missingDocuments);
      
      // Update the application
      const updatedApplications = applications.map(app => 
        app.id === selectedApplication.id 
          ? { 
              ...app, 
              status: "corrections-needed" as ApplicationStatus,
              reviewComments: "Please upload the missing required documents.",
              lastUpdated: new Date().toISOString()
            }
          : app
      );
      
      setApplications(updatedApplications);
      setIsReviewModalOpen(false);
      toast.success("Document request sent to the applicant");
    }
  };

  const handleViewPendingFAO = () => {
    // In a real app, this would navigate to a dedicated page
    // For now, we'll just filter applications to show only those pending FAO review
    setStatusFilter("pending-allocation");
    toast.info("Showing applications pending FAO review");
  };

  const getCountByStatus = (status: string) => {
    if (status === "all") return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  // Count the number of applications pending FAO review
  const pendingFAOCount = applications.filter(app => app.status === "pending-allocation").length;

  return (
    <DashboardLayout title="Application Review">
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mx-1 ">
              <div>
                <CardTitle className="text-xl">Review Applications</CardTitle>
                <CardDescription>
                  Manage and review student bursary applications
                </CardDescription>
              </div>
              {pendingFAOCount > 0 && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  onClick={handleViewPendingFAO}
                >
                  <Send className="h-4 w-4" />
                  <span>Pending FAO Review</span>
                  <Badge variant="secondary" className="ml-1 bg-blue-200">{pendingFAOCount}</Badge>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    type="search" 
                    placeholder="Search applications..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
                  <SelectTrigger className="w-[180px] flex gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Applications 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("all")}</Badge>
                    </SelectItem>
                    <SelectItem value="submitted">
                      Submitted 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("submitted")}</Badge>
                    </SelectItem>
                    <SelectItem value="under-review">
                      Under Review 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("under-review")}</Badge>
                    </SelectItem>
                    <SelectItem value="corrections-needed">
                      Needs Corrections 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("corrections-needed")}</Badge>
                    </SelectItem>
                    <SelectItem value="approved">
                      Approved 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("approved")}</Badge>
                    </SelectItem>
                    <SelectItem value="pending-allocation">
                      Pending FAO 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("pending-allocation")}</Badge>
                    </SelectItem>
                    <SelectItem value="allocated">
                      Allocated 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("allocated")}</Badge>
                    </SelectItem>
                    <SelectItem value="rejected">
                      Rejected 
                      <Badge variant="secondary" className="ml-2">{getCountByStatus("rejected")}</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-medium">Student</th>
                      <th className="p-3 font-medium">Reference</th>
                      <th className="p-3 font-medium">Institution</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="p-3">{application.studentName || "Unknown"}</td>
                        <td className="p-3 font-mono text-xs">{application.id}</td>
                        <td className="p-3">{application.institutionName}</td>
                        <td className="p-3">
                          <StatusBadge status={application.status} />
                          {application.status === "pending-allocation" && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              FAO Review
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Document Verification Button */}
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={application.documentsVerified ? "bg-green-50 border-green-200" : ""}
                              onClick={() => handleVerifyDocuments(application)}
                            >
                              {application.documentsVerified ? (
                                <CheckSquare className="mr-1 h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                              )}
                              {application.documentsVerified ? "Documents Verified" : "Verify Documents"}
                            </Button>
                            
                            {/* Review Application Button */}
                            <Button 
                              variant={application.status === "submitted" || application.status === "under-review" ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleReviewApplication(application)}
                            >
                              <Clock className="mr-1 h-4 w-4" />
                              Review
                            </Button>
                            
                            {/* View Details Button */}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/ARO/applications/${application.id}`)}
                            >
                              Details
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No applications found"
                description="Try adjusting your filters or search query."
                icon={<Search className="h-12 w-12 text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application review dialog with tabs */}
      {selectedApplication && isReviewModalOpen && (
        <div className="relative z-50">
          {reviewMode === "details" ? (
            <ApplicationReviewForm
              isOpen={isReviewModalOpen}
              onClose={() => setIsReviewModalOpen(false)}
              application={selectedApplication}
              onSubmit={handleReviewSubmit}
            />
          ) : (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-5xl max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-blue-500" />
                    Document Verification
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsReviewModalOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </Button>
                </div>
                
                <div className="p-4 overflow-y-auto max-h-[calc(90vh-100px)]">
                  <div className="mb-6">
                    <h3 className="text-base font-medium mb-1">
                      Application: {selectedApplication.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Student: {selectedApplication.studentName} | Institution: {selectedApplication.institutionName}
                    </p>
                  </div>
                  
                  <Tabs defaultValue="verification" className="w-full">
                    <TabsList>
                      <TabsTrigger value="verification">Document Verification</TabsTrigger>
                      <TabsTrigger value="history">Verification History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="verification" className="mt-4">
                      <DocumentVerificationChecklist
                        applicationId={selectedApplication.id}
                        documents={mockDocuments}
                        requiredDocuments={requiredDocuments}
                        onVerifyDocuments={handleDocumentVerification}
                        onRequestDocuments={handleRequestDocuments}
                      />
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div className="p-8 text-center text-gray-500">
                        <p>No previous verification history available</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationsReview;
