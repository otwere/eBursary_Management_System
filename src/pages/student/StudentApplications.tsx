import  { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, FilePlus, Filter, Search, Calendar, AlertTriangle, CheckCircle2, AlertCircle, Clock, X, Eye, Download, Printer, MoreHorizontal, Mail, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import NotificationBadge from "@/components/common/NotificationBadge";
import { Application } from "@/types/auth";
import { mockApplications, mockNotifications } from "@/data/mockData";
import { formatDate, formatCurrency } from "@/utils/format";
import { useToast } from "@/components/ui/use-toast";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ApplicationCard from "@/components/common/ApplicationCard";

const StudentApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(5);

  const filteredApplications = applications
    .filter((app) => {
      const searchMatch = 
        app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.courseOfStudy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = selectedStatus ? app.status === selectedStatus : true;
      
      const yearMatch = selectedYear 
        ? new Date(app.applicationDate).getFullYear().toString() === selectedYear 
        : true;
      
      if (activeTab === "all") return searchMatch && statusMatch && yearMatch;
      if (activeTab === "active") {
        return ["submitted", "under-review", "approved", "allocated"].includes(app.status) && 
               searchMatch && statusMatch && yearMatch;
      }
      if (activeTab === "completed") {
        return ["disbursed", "rejected"].includes(app.status) && 
               searchMatch && statusMatch && yearMatch;
      }
      if (activeTab === "draft") {
        return app.status === "draft" && searchMatch && statusMatch && yearMatch;
      }
      
      return searchMatch && statusMatch && yearMatch;
    })
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime());

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const uniqueYears = Array.from(
    new Set(applications.map((app) => new Date(app.applicationDate).getFullYear()))
  ).sort((a, b) => b - a);

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApplicationAction = (action: string, application: Application) => {
    switch (action) {
      case "view":
        navigate(`/student/applications/${application.id}`);
        break;
      case "delete":
        if (application.status === "draft") {
          setApplications((prevApps) => prevApps.filter((app) => app.id !== application.id));
          toast({
            title: "Draft Deleted",
            description: "Your draft application has been deleted.",
          });
        }
        break;
      case "download":
        setIsGeneratingPDF(true);
        setTimeout(() => {
          setIsGeneratingPDF(false);
          toast({
            title: "PDF Generated",
            description: "Your application PDF has been generated and downloaded.",
          });
        }, 1500);
        break;
      case "contact":
        toast({
          title: "Contact Initiated",
          description: "A message has been sent to the financial aid office regarding your application.",
        });
        break;
      default:
        break;
    }
  };

  const [notifications, setNotifications] = useState(mockNotifications);

  const handleNotificationClick = (notification: any) => {
    console.log("Notification clicked:", notification);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleViewAllNotifications = () => {
    navigate("/student/notifications");
  };

  const getApplicationTimeline = (application: Application) => {
    const statusOrder = ["draft", "submitted", "under-review", "corrections-needed", "approved", "allocated", "disbursed"];
    const currentStatusIndex = statusOrder.indexOf(application.status);
    
    return statusOrder.map((status, index) => {
      const isCompleted = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      
      return {
        status,
        completed: isCompleted && !isCurrent,
        current: isCurrent,
        date: isCompleted || isCurrent ? new Date() : undefined,
      };
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedYear, activeTab]);

  return (
    <DashboardLayout 
      title="My Applications" 
      notificationBadge={
        <NotificationBadge
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
          onViewAll={handleViewAllNotifications}
        />
      }
    >
      <div className="space-y-6 -mx-[70px]">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-indigo-50 h-20 rounded px-2 border-b-2 border-l-4 border-l-green-500">
          <div>
            <h1 className="text-lg  text-blue-800 p-0 -mt-2 font-bold">My Applications</h1>
            <p className="text-muted-foreground text-sm mt-0">
              Manage and track all your Applications Status
            </p>
          </div>
          <Button 
            onClick={() => navigate("/student/applications/new")}
            className="w-full sm:w-auto bg-blue-500"
          >
            <FilePlus className="mr-0 h-4 w-4" />
            New Application
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Search Applications</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by institution, course, or reference..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48 space-y-2">
                <label className="text-sm font-medium">Filter by Status</label>
                <Select 
                  value={selectedStatus} 
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="corrections-needed">Corrections Needed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="allocated">Allocated</SelectItem>
                    <SelectItem value="disbursed">Disbursed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48 space-y-2">
                <label className="text-sm font-medium">Academic Year</label>
                <Select 
                  value={selectedYear} 
                  onValueChange={setSelectedYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {uniqueYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year.toString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("");
                  setSelectedYear("");
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">
              All
              <Badge className="ml-2" variant="secondary">
                {applications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Active
              <Badge className="ml-2" variant="secondary">
                {applications.filter(app => ["submitted", "under-review", "approved", "allocated"].includes(app.status)).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              <Badge className="ml-2" variant="secondary">
                {applications.filter(app => ["disbursed", "rejected"].includes(app.status)).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts
              <Badge className="ml-2" variant="secondary">
                {applications.filter(app => app.status === "draft").length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No applications found"
                description={searchTerm || selectedStatus || selectedYear ? "Try adjusting your search or filters" : "Start by creating a new application"}
                icon={<FileText className="h-8 w-8 text-gray-400" />}
                action={
                  !searchTerm && !selectedStatus && !selectedYear
                    ? {
                        label: "Create Application",
                        onClick: () => navigate("/student/applications/new"),
                      }
                    : undefined
                }
              />
            ) : (
              <div className="grid gap-4">
                {currentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={() => handleViewDetails(application)}
                    onAction={(action) => handleApplicationAction(action, application)}
                  />
                ))}
                
                {filteredApplications.length > applicationsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNumber = currentPage - 2 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={idx}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No active applications"
                description="You don't have any active applications at the moment"
                icon={<Clock className="h-8 w-8 text-gray-400" />}
                action={{
                  label: "Create Application",
                  onClick: () => navigate("/student/applications/new"),
                }}
              />
            ) : (
              <div className="grid gap-4">
                {currentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={() => handleViewDetails(application)}
                    onAction={(action) => handleApplicationAction(action, application)}
                  />
                ))}
                
                {filteredApplications.length > applicationsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNumber = currentPage - 2 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={idx}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No completed applications"
                description="You don't have any completed applications yet"
                icon={<CheckCircle2 className="h-8 w-8 text-gray-400" />}
                action={{
                  label: "View All Applications",
                  onClick: () => setActiveTab("all"),
                }}
              />
            ) : (
              <div className="grid gap-4">
                {currentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={() => handleViewDetails(application)}
                    onAction={(action) => handleApplicationAction(action, application)}
                  />
                ))}
                
                {filteredApplications.length > applicationsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNumber = currentPage - 2 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={idx}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No draft applications"
                description="You don't have any applications saved as drafts"
                icon={<FileText className="h-8 w-8 text-gray-400" />}
                action={{
                  label: "Create Application",
                  onClick: () => navigate("/student/applications/new"),
                }}
              />
            ) : (
              <div className="grid gap-4">
                {currentApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onViewDetails={() => handleViewDetails(application)}
                    onAction={(action) => handleApplicationAction(action, application)}
                  />
                ))}
                
                {filteredApplications.length > applicationsPerPage && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = idx + 1;
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        } else {
                          pageNumber = currentPage - 2 + idx;
                          if (idx === 0) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                          if (idx === 4) return (
                            <PaginationItem key={idx}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return (
                          <PaginationItem key={idx}>
                            <PaginationLink
                              isActive={pageNumber === currentPage}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          
          {selectedApplication && (
            <>
              <DialogHeader className="bg-blue-50 h-20 rounded border-l-4 border-blue-500
              ">
                <DialogTitle className="text-xl mx-2 mt-1 text-blue-500">Application Details</DialogTitle>
                <DialogDescription className="mx-2 text-muted-foreground">
                  Reference : {selectedApplication.id}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-muted/30 p-4 rounded border">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Applied on {formatDate(new Date(selectedApplication.applicationDate))}
                      </span>
                    </div>
                    <StatusBadge status={selectedApplication.status} />
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-4">Application Timeline</h4>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        {getApplicationTimeline(selectedApplication).map((step, index) => (
                          <div key={index} className="relative pl-10">
                            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-100 text-green-600' : step.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                              {step.completed ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : step.current ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h5 className={`text-sm font-medium ${step.completed || step.current ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.status === "draft" && "Draft Saved"}
                                {step.status === "submitted" && "Application Submitted"}
                                {step.status === "under-review" && "Under Review"}
                                {step.status === "corrections-needed" && "Corrections Needed"}
                                {step.status === "approved" && "Application Approved"}
                                {step.status === "allocated" && "Funds Allocated"}
                                {step.status === "disbursed" && "Funds Disbursed"}
                              </h5>
                              {step.date && (
                                <p className="text-xs text-gray-500">{formatDate(step.date)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-1">
                  <Card className=" bg-slate-50 border-l-4 border  border-blue-400">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Institution & Course</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Institution :</span>
                        <span className="text-sm font-medium">{selectedApplication.institutionName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Course :</span>
                        <span className="text-sm font-medium">{selectedApplication.courseOfStudy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Academic Year :</span>
                        <span className="text-sm font-medium">
                          {new Date(selectedApplication.applicationDate).getFullYear()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Year of Study :</span>
                        <span className="text-sm font-medium">{selectedApplication.yearOfStudy || "Not specified"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className=" bg-green-50 border-l-4 border  border-green-400">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Financial Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Requested Amount :</span>
                        <span className="text-sm font-medium text-primary-600">
                          {formatCurrency(selectedApplication.requestedAmount)}
                        </span>
                      </div>
                      {selectedApplication.disbursedAmount && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Disbursed Amount :</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(selectedApplication.disbursedAmount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Category :</span>
                        <span className="text-sm font-medium">{selectedApplication.fundCategory || "General"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Application Type :</span>
                        <Badge variant="outline">
                          {selectedApplication.applicationType || "Standard"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Supporting Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedApplication.documents && selectedApplication.documents.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedApplication.documents.map((doc, index) => (
                          <li key={index} className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground">
                        No documents have been uploaded for this application
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedApplication.reviewComments && (
                  <Card>
                    <CardHeader className="pb-2 bg-amber-50">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Review Feedback
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm">{selectedApplication.reviewComments}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <DialogFooter className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline"
                  onClick={() => handleApplicationAction("download", selectedApplication)}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => handleApplicationAction("contact", selectedApplication)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                
                <Button 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    navigate(`/student/applications/${selectedApplication.id}`);
                  }}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Open Full Details
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentApplications;
