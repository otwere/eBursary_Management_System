import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { mockApplications } from "@/data/mockData";
import { formatDate, formatCurrency } from "@/utils/format";
import { 
  Trash, Download, MessageSquare, CheckCircle, X, Filter, Eye, Search, 
  ArrowUpDown, Users, Calendar, FileText, SlidersHorizontal, ChevronDown,
  MoreHorizontal, Printer, Mail, RefreshCw, ExternalLink, Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types/auth";
import EmptyState from "@/components/common/EmptyState";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const StudentApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("applicationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  // Get unique years from applications
  const uniqueYears = Array.from(
    new Set(mockApplications.map((app) => new Date(app.applicationDate).getFullYear()))
  ).sort((a, b) => b - a);
  
  // Get unique institutions from applications
  const uniqueInstitutions = Array.from(
    new Set(mockApplications.map((app) => app.institutionType))
  ).filter(Boolean) as string[];
  
  // Filter and sort applications
  const filteredApplications = mockApplications
    .filter(app => {
      // Filter by search query
      const searchMatch = 
        app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.courseOfStudy && app.courseOfStudy.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by status
      const statusMatch = selectedStatus === "all" || app.status === selectedStatus;
      
      // Filter by year
      const year = new Date(app.applicationDate).getFullYear().toString();
      const yearMatch = selectedYear === "all" || year === selectedYear;
      
      // Filter by institution type
      const institutionMatch = selectedInstitution === "all" || app.institutionType === selectedInstitution;
      
      // Filter by tab
      if (activeTab === "all") return searchMatch && statusMatch && yearMatch && institutionMatch;
      if (activeTab === "pending") {
        return ["submitted", "under-review"].includes(app.status) && 
               searchMatch && yearMatch && institutionMatch;
      }
      if (activeTab === "approved") {
        return ["approved", "allocated", "disbursed"].includes(app.status) && 
               searchMatch && yearMatch && institutionMatch;
      }
      if (activeTab === "rejected") {
        return app.status === "rejected" && searchMatch && yearMatch && institutionMatch;
      }
      if (activeTab === "corrections") {
        return app.status === "corrections-needed" && searchMatch && yearMatch && institutionMatch;
      }
      
      return searchMatch && statusMatch && yearMatch && institutionMatch;
    })
    .sort((a, b) => {
      if (sortField === "applicationDate") {
        const dateA = new Date(a.applicationDate).getTime();
        const dateB = new Date(b.applicationDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      if (sortField === "requestedAmount") {
        return sortDirection === "asc" 
          ? a.requestedAmount - b.requestedAmount 
          : b.requestedAmount - a.requestedAmount;
      }
      
      if (sortField === "studentName") {
        const nameA = a.studentName || "";
        const nameB = b.studentName || "";
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      }
      
      return 0;
    });
  
  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus, sortField, sortDirection, activeTab, selectedYear, selectedInstitution]);
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };
  
  const handleSelectApplication = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications([...selectedApplications, id]);
    } else {
      setSelectedApplications(selectedApplications.filter(appId => appId !== id));
    }
  };
  
  const handleBulkAction = () => {
    setIsExporting(bulkAction === "export");
    
    setTimeout(() => {
      setIsExporting(false);
      
      toast({
        title: `Bulk Action: ${bulkAction}`,
        description: `Successfully applied to ${selectedApplications.length} applications`,
        variant: bulkAction === "approve" ? "default" : bulkAction === "reject" ? "destructive" : "default",
      });
      
      setIsBulkActionOpen(false);
      setSelectedApplications([]);
      setBulkAction("");
    }, 1500);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedYear("all");
    setSelectedInstitution("all");
  };
  
  const handleApplicationAction = (action: string, applicationId: string) => {
    const application = mockApplications.find(app => app.id === applicationId);
    
    if (!application) return;
    
    switch(action) {
      case "view":
        navigate(`/ARO/applications/${applicationId}`);
        break;
      case "review":
        navigate(`/ARO/applications/${applicationId}`);
        break;
      case "message":
        toast({
          title: "Message Sent",
          description: `A message has been sent regarding application ${applicationId}`,
        });
        break;
      case "export":
        setIsExporting(true);
        setTimeout(() => {
          setIsExporting(false);
          toast({
            title: "Export Complete",
            description: `Application ${applicationId} has been exported to PDF`,
          });
        }, 1500);
        break;
      default:
        break;
    }
  };
  
  // Calculate totals for tab badges
  const pendingCount = mockApplications.filter(app => 
    ["submitted", "under-review"].includes(app.status)).length;
  const approvedCount = mockApplications.filter(app => 
    ["approved", "allocated", "disbursed"].includes(app.status)).length;
  const rejectedCount = mockApplications.filter(app => 
    app.status === "rejected").length;
  const correctionsCount = mockApplications.filter(app => 
    app.status === "corrections-needed").length;
  
  return (
    <DashboardLayout title="Student Applications">
      <div className="space-y-6  lg:-mx-[85px]">
        {/* Header section */}
        <div className="bg-blue-50 border-l-4 border-l-blue-500 p-4 rounded border-b-2 h-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-blue-800 -mt-2">Student Applications</h1>
              <p className="text-muted-foreground text-sm mt-[-0.25rem]">
                View and manage all Students' Applications in one Place.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {/* <Button 
                variant="outline" 
                onClick={() => setShowDetailedView(!showDetailedView)}
              >
                {showDetailedView ? (
                  <>
                    <Table className="mr-2 h-4 w-4" />
                    Table View
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Detailed View
                  </>
                )}
              </Button> */}
              
              <Button 
                variant="outline"
                onClick={() => {
                  setIsExporting(true);
                  setTimeout(() => {
                    setIsExporting(false);
                    toast({
                      title: "Export Complete",
                      description: "All applications exported successfully",
                    });
                  }, 1500);
                }}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </>
                )}
              </Button>
              
              <Button 
                variant="default"
                onClick={() => navigate("/ARO/applications-review")}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Review Applications
              </Button>
            </div>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 bg-yellow-50 hover:bg-yellow-100 border-l-4 border-l-yellow-500 rounded">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-semibold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 bg-red-50 hover:bg-amber-100 border-l-4 border-l-orange-500 rounded">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-100">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Need Corrections</p>
                  <p className="text-2xl font-semibold">{correctionsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500 rounded">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <p className="text-2xl font-semibold">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500 rounded">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <p className="text-2xl font-semibold">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b w-full justify-start rounded-none p-0 h-auto mb-6 space-x-40">
            <TabsTrigger 
              value="all" 
              className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 text-base"
            >
              All Applications
              <Badge className="ml-2" variant="secondary">
                {mockApplications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 text-base"
            >
              Pending Review
              <Badge className="ml-2" variant="secondary">
                {pendingCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="approved" 
              className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 text-base"
            >
              Approved
              <Badge className="ml-2" variant="secondary">
                {approvedCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="rejected" 
              className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 text-base"
            >
              Rejected
              <Badge className="ml-2" variant="secondary">
                {rejectedCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="corrections" 
              className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-2 text-base"
            >
              Corrections
              <Badge className="ml-2" variant="secondary">
                {correctionsCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {/* Controls */}
            <div className="bg-white rounded border p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, institution, ID..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="corrections-needed">Corrections Needed</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="allocated">Allocated</SelectItem>
                      <SelectItem value="disbursed">Disbursed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Academic Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {uniqueYears.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                    <SelectTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Institution Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutions</SelectItem>
                      {uniqueInstitutions.map(inst => (
                        <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                  
                  {selectedApplications.length > 0 && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setIsBulkActionOpen(true)}
                      className="whitespace-nowrap"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Bulk Actions ({selectedApplications.length})
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No applications found"
                description="Try adjusting your search or filters to find what you're looking for"
                icon={<FileText className="h-10 w-10 text-gray-400" />}
              />
            ) : showDetailedView ? (
              // Detailed Card View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {currentApplications.map((application) => (
                  <Card key={application.id} className="overflow-hidden hover:shadow-md transition-all duration-200">
                    <div className={`h-1.5 w-full ${
                      application.status === "approved" || application.status === "disbursed" ? "bg-green-500" :
                      application.status === "rejected" ? "bg-red-500" :
                      application.status === "under-review" ? "bg-blue-500" : 
                      application.status === "corrections-needed" ? "bg-amber-500" : "bg-purple-500"
                    }`} />
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500">Reference</p>
                          <p className="text-sm font-medium">{application.id}</p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-0">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Student</p>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-2">
                              {application.studentName ? application.studentName.charAt(0) : "?"}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{application.studentName || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{application.studentEmail || "No email provided"}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Institution</p>
                            <p className="text-sm font-medium truncate">{application.institutionName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Course</p>
                            <p className="text-sm font-medium truncate">{application.courseOfStudy || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Requested</p>
                            <p className="text-sm font-semibold text-primary">{formatCurrency(application.requestedAmount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date</p>
                            <p className="text-sm">{formatDate(new Date(application.applicationDate))}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <div className="pt-4 px-6 pb-3 mt-2 border-t flex justify-between items-center bg-gray-50">
                      <Checkbox 
                        checked={selectedApplications.includes(application.id)}
                        onCheckedChange={(checked) => handleSelectApplication(application.id, !!checked)}
                        aria-label={`Select application ${application.id}`}
                      />
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApplicationAction("message", application.id)}
                        >
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleApplicationAction("view", application.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApplicationAction("review", application.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Review Application
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleApplicationAction("export", application.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Export to PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApplicationAction("message", application.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApplicationAction("view", application.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Table View
              <div className="rounded border overflow-hidden mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedApplications.length === currentApplications.length && currentApplications.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all applications"
                        />
                      </TableHead>
                      <TableHead className="w-[120px]">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("applicationDate")}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="w-[140px]">Reference</TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("studentName")}
                        >
                          Student
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort("requestedAmount")}
                        >
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedApplications.includes(application.id)}
                            onCheckedChange={(checked) => handleSelectApplication(application.id, !!checked)}
                            aria-label={`Select application ${application.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatDate(new Date(application.applicationDate))}
                        </TableCell>
                        <TableCell className="font-mono text-xs ">
                          {application.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-2">
                              {application.studentName ? application.studentName.charAt(0) : "?"}
                            </div>
                            <div>
                              <p className="font-medium">{application.studentName || "Unknown"}</p>
                              <p className="text-xs text-gray-500">{application.studentEmail || "No email"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{application.institutionName}</p>
                            <p className="text-xs text-gray-500">{application.courseOfStudy || "Not specified"}</p>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(application.requestedAmount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={application.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApplicationAction("view", application.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApplicationAction("message", application.id)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleApplicationAction("view", application.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleApplicationAction("review", application.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Review Application
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleApplicationAction("export", application.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export to PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.print()}>
                                  <Printer className="mr-2 h-4 w-4" />
                                  Print Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            {filteredApplications.length > applicationsPerPage && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {indexOfFirstApplication + 1} to {Math.min(indexOfLastApplication, filteredApplications.length)} of {filteredApplications.length} applications
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNumber = i + 1;
                      
                      // Logic for showing correct page numbers when there are many pages
                      if (totalPages > 5) {
                        if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <PaginationItem key={i}>
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bulk action dialog */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-500">
              Select an action to apply to {selectedApplications.length} selected applications.
            </p>
            <div className="space-y-2">
              <div 
                className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                  bulkAction === "approve" ? "border-primary bg-primary-50" : ""
                }`}
                onClick={() => setBulkAction("approve")}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Approve Applications</span>
              </div>
              <div 
                className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                  bulkAction === "reject" ? "border-primary bg-primary-50" : ""
                }`}
                onClick={() => setBulkAction("reject")}
              >
                <X className="h-4 w-4 text-red-500" />
                <span>Reject Applications</span>
              </div>
              <div 
                className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                  bulkAction === "review" ? "border-primary bg-primary-50" : ""
                }`}
                onClick={() => setBulkAction("review")}
              >
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Mark for Review</span>
              </div>
              <div 
                className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                  bulkAction === "export" ? "border-primary bg-primary-50" : ""
                }`}
                onClick={() => setBulkAction("export")}
              >
                <Download className="h-4 w-4 text-blue-500" />
                <span>Export Applications</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkAction}
              disabled={!bulkAction || isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Apply to {selectedApplications.length} Applications</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentApplications;
