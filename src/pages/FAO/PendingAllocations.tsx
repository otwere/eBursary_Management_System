
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getApplicationsByStatus } from "@/data/mockData";
import { AllocationQueue, BatchAllocation, FundCategory, FundAllocation } from "@/types/funds";
import { Application } from "@/types/auth";
import { 
  AlertCircle, 
  ArrowUpDown, 
  Calendar, 
  Check, 
  CheckCircle, 
  ChevronDown, 
  Download, 
  FileText, 
  Filter, 
  Info, 
  Search, 
  Send, 
  SlidersHorizontal, 
  Users, 
  Ban,
  FileBarChart,
  FileCheck,
  Banknote
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const PendingAllocations = () => {
  const navigate = useNavigate();
  
  // Get applications pending allocation (sent by ARO)
  const pendingApplications = getApplicationsByStatus("pending-allocation");
  
  // State management
  const [selectedTab, setSelectedTab] = useState("individual");
  const [searchQuery, setSearchQuery] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState("");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState("");
  const [selectedFundType, setSelectedFundType] = useState("");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [isBulkAllocateModalOpen, setIsBulkAllocateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [allocatedAmount, setAllocatedAmount] = useState("");
  const [allocationNotes, setAllocationNotes] = useState("");
  const [selectedFundCategory, setSelectedFundCategory] = useState("");
  const [sortBy, setSortBy] = useState<string>("applicationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [fundCategoryOptions, setFundCategoryOptions] = useState<FundCategory[]>([]);
  
  // Institution list for filtering
  const institutions = [...new Set(pendingApplications.map(app => app.institutionName))];
  const educationLevels = [...new Set(pendingApplications.map(app => app.educationLevel).filter(Boolean))];
  
  // Statistics
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalAmount: 0,
    highPriority: 0,
    averageAmount: 0,
    byEducationLevel: [] as {level: string, count: number, amount: number}[]
  });

  // Calculate statistics
  useEffect(() => {
    const totalAmount = pendingApplications.reduce((sum, app) => sum + app.requestedAmount, 0);
    const averageAmount = pendingApplications.length > 0 ? totalAmount / pendingApplications.length : 0;
    
    // Group by education level
    const byEducationLevel = pendingApplications.reduce((acc, app) => {
      const level = app.educationLevel || "Not Specified";
      const existing = acc.find(item => item.level === level);
      
      if (existing) {
        existing.count += 1;
        existing.amount += app.requestedAmount;
      } else {
        acc.push({
          level,
          count: 1,
          amount: app.requestedAmount
        });
      }
      
      return acc;
    }, [] as {level: string, count: number, amount: number}[]);
    
    setStats({
      totalApplications: pendingApplications.length,
      totalAmount,
      highPriority: pendingApplications.filter(app => app.requestedAmount > 100000).length,
      averageAmount,
      byEducationLevel
    });
  }, [pendingApplications]);
  
  // Mock fund categories (in a real app, this would come from API)
  useEffect(() => {
    // Simulate fetching fund categories
    setFundCategoryOptions([
      {
        id: "cat-1",
        floatId: "float-1",
        name: "Bursary",
        description: "Need-based financial assistance",
        amount: 3000000,
        allocatedAmount: 1200000,
        disbursedAmount: 830000,
        remainingAmount: 1800000,
        academicYear: "2025",
        createdAt: "2024-03-15T09:00:00.000Z",
        createdBy: "Michael Johnson"
      },
      {
        id: "cat-2",
        floatId: "float-1",
        name: "Scholarship",
        description: "Merit-based financial assistance",
        amount: 2000000,
        allocatedAmount: 800000,
        disbursedAmount: 600000,
        remainingAmount: 1200000,
        academicYear: "2025",
        createdAt: "2024-03-15T09:15:00.000Z",
        createdBy: "Michael Johnson"
      }
    ]);
  }, []);
  
  // Filter applications based on search query and institution filter
  const filteredApplications = pendingApplications.filter(app => {
    const matchesSearch = 
      app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesInstitution = institutionFilter === "" || app.institutionName === institutionFilter;
    const matchesEducationLevel = selectedEducationLevel === "" || app.educationLevel === selectedEducationLevel;
    
    return matchesSearch && matchesInstitution && matchesEducationLevel;
  });

  // Sort applications
  const sortedApplications = React.useMemo(() => {
    return [...filteredApplications].sort((a, b) => {
      if (sortBy === "applicationDate") {
        const dateA = new Date(a.applicationDate).getTime();
        const dateB = new Date(b.applicationDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "requestedAmount") {
        return sortDirection === "asc" 
          ? a.requestedAmount - b.requestedAmount 
          : b.requestedAmount - a.requestedAmount;
      } else if (sortBy === "studentName") {
        const nameA = a.studentName || "";
        const nameB = b.studentName || "";
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      } else if (sortBy === "institutionName") {
        return sortDirection === "asc" 
          ? a.institutionName.localeCompare(b.institutionName) 
          : b.institutionName.localeCompare(a.institutionName);
      }
      return 0;
    });
  }, [filteredApplications, sortBy, sortDirection]);
  
  // Group applications by institution for bulk allocation
  const applicationsByInstitution = pendingApplications.reduce((acc, app) => {
    const institution = app.institutionName;
    if (!acc[institution]) {
      acc[institution] = [];
    }
    acc[institution].push(app);
    return acc;
  }, {} as Record<string, Application[]>);
  
  // Handle selecting/deselecting an application
  const toggleApplicationSelection = (appId: string) => {
    if (selectedApplications.includes(appId)) {
      setSelectedApplications(selectedApplications.filter(id => id !== appId));
    } else {
      setSelectedApplications([...selectedApplications, appId]);
    }
  };
  
  // Handle selecting all applications
  const toggleSelectAll = () => {
    if (selectedApplications.length === sortedApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(sortedApplications.map(app => app.id));
    }
  };
  
  // Handle selecting all applications for an institution
  const selectAllFromInstitution = (institutionName: string) => {
    const institutionAppIds = applicationsByInstitution[institutionName].map(app => app.id);
    
    // Check if all applications from this institution are already selected
    const allSelected = institutionAppIds.every(id => selectedApplications.includes(id));
    
    if (allSelected) {
      // Deselect all from this institution
      setSelectedApplications(selectedApplications.filter(id => !institutionAppIds.includes(id)));
    } else {
      // Select all from this institution
      const newSelection = [...new Set([...selectedApplications, ...institutionAppIds])];
      setSelectedApplications(newSelection);
    }
  };
  
  // Open allocation modal for a single application
  const handleAllocateFunds = (application: Application) => {
    setSelectedApplication(application);
    setAllocatedAmount(application.requestedAmount?.toString() || "");
    setIsAllocateModalOpen(true);
  };
  
  // Open application details modal
  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };
  
  // Open bulk allocation modal
  const handleBulkAllocate = () => {
    if (selectedApplications.length === 0) {
      toast.error("Please select at least one application for bulk allocation");
      return;
    }
    
    setIsBulkAllocateModalOpen(true);
  };
  
  // Submit individual allocation
  const handleSubmitAllocation = () => {
    if (!selectedApplication) return;
    
    if (!selectedFundCategory) {
      toast.error("Please select a fund category");
      return;
    }
    
    if (!allocatedAmount || parseFloat(allocatedAmount) <= 0) {
      toast.error("Please enter a valid allocation amount");
      return;
    }
    
    // In a real app, you would send this to the API
    console.log("Allocating funds:", {
      applicationId: selectedApplication.id,
      studentId: selectedApplication.studentId,
      studentName: selectedApplication.studentName,
      institutionId: selectedApplication.institutionId,
      institutionName: selectedApplication.institutionName,
      amount: parseFloat(allocatedAmount),
      fundCategoryId: selectedFundCategory,
      notes: allocationNotes
    });
    
    toast.success(`Funds allocated successfully to ${selectedApplication.studentName}`);
    setIsAllocateModalOpen(false);
    
    // Reset form
    setSelectedApplication(null);
    setAllocatedAmount("");
    setAllocationNotes("");
    setSelectedFundCategory("");
  };
  
  // Submit bulk allocation
  const handleSubmitBulkAllocation = () => {
    if (selectedApplications.length === 0) {
      toast.error("Please select at least one application");
      return;
    }
    
    if (!selectedFundCategory) {
      toast.error("Please select a fund category");
      return;
    }
    
    // Get selected applications
    const applications = pendingApplications.filter(app => 
      selectedApplications.includes(app.id)
    );
    
    // Calculate total allocation amount
    const totalAmount = applications.reduce((sum, app) => 
      sum + (app.requestedAmount || 0), 0
    );
    
    // Group by institution
    const institutionGroups = applications.reduce((acc, app) => {
      const institution = app.institutionName;
      if (!acc[institution]) {
        acc[institution] = [];
      }
      acc[institution].push(app);
      return acc;
    }, {} as Record<string, Application[]>);
    
    // Create batch allocations by institution
    Object.entries(institutionGroups).forEach(([institution, apps]) => {
      const institutionTotal = apps.reduce((sum, app) => 
        sum + (app.requestedAmount || 0), 0
      );
      
      // In a real app, you would send this to the API
      console.log(`Creating batch allocation for ${institution}:`, {
        institutionName: institution,
        applicationIds: apps.map(app => app.id),
        totalAmount: institutionTotal,
        fundCategoryId: selectedFundCategory,
        notes: allocationNotes
      });
    });
    
    toast.success(`Bulk allocation of ${formatCurrency(totalAmount)} created successfully for ${applications.length} applications`);
    setIsBulkAllocateModalOpen(false);
    setSelectedApplications([]);
    setAllocationNotes("");
    setSelectedFundCategory("");
  };
  
  // View application details
  const handleViewApplication = (applicationId: string) => {
    navigate(`/FAO/applications/${applicationId}`);
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };
  
  return (
    <DashboardLayout title="Pending Allocations">
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pending Fund Allocations</h1>
            <p className="text-muted-foreground">
              Review and allocate funds to applications approved by ARO
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/FAO/allocations-queue")}
              className="flex items-center gap-2"
            >
              <FileBarChart className="h-4 w-4" />
              Allocation Queue
            </Button>
            
            {selectedApplications.length > 0 && (
              <Button 
                onClick={handleBulkAllocate}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Allocate Selected ({selectedApplications.length})
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileCheck className="h-5 w-5 text-blue-700" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Pending fund allocation</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <Banknote className="h-5 w-5 text-purple-700" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.averageAmount)} avg. per application</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Institutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{institutions.length}</div>
                <div className="p-2 bg-amber-100 rounded-full">
                  <Users className="h-5 w-5 text-amber-700" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">From {educationLevels.length} education levels</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">{stats.highPriority}</div>
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-700" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {(stats.highPriority / stats.totalApplications * 100).toFixed(1)}% of total applications
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Pending Fund Allocations</CardTitle>
                <CardDescription>
                  Applications submitted by ARO ready for fund allocation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="individual">Individual Applications</TabsTrigger>
                <TabsTrigger value="institution">By Institution</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    type="search" 
                    placeholder="Search by student name, ID, or institution..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Select 
                    value={institutionFilter} 
                    onValueChange={setInstitutionFilter}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Institution</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Institutions</SelectItem>
                      {institutions.map(institution => (
                        <SelectItem 
                          key={institution} 
                          value={institution}
                        >
                          {institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={selectedEducationLevel} 
                    onValueChange={setSelectedEducationLevel}
                  >
                    <SelectTrigger className="w-full md:w-[200px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Education Level</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Levels</SelectItem>
                      {educationLevels.map(level => (
                        <SelectItem 
                          key={level} 
                          value={level}
                        >
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Sort By</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleSortChange("applicationDate")}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Date {sortBy === "applicationDate" && (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange("requestedAmount")}>
                        <Banknote className="h-4 w-4 mr-2" />
                        Amount {sortBy === "requestedAmount" && (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange("studentName")}>
                        <Users className="h-4 w-4 mr-2" />
                        Student Name {sortBy === "studentName" && (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange("institutionName")}>
                        <Users className="h-4 w-4 mr-2" />
                        Institution {sortBy === "institutionName" && (sortDirection === "asc" ? "↑" : "↓")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <TabsContent value="individual" className="mt-0">
                {sortedApplications.length > 0 ? (
                  <div className="overflow-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={
                                sortedApplications.length > 0 && 
                                selectedApplications.length === sortedApplications.length
                              }
                              onCheckedChange={toggleSelectAll}
                              aria-label="Select all applications"
                            />
                          </TableHead>
                          <TableHead className="whitespace-nowrap">Student</TableHead>
                          <TableHead onClick={() => handleSortChange("institutionName")} className="cursor-pointer">
                            <div className="flex items-center">
                              Institution
                              {sortBy === "institutionName" && (
                                <ArrowUpDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead>Education Level</TableHead>
                          <TableHead onClick={() => handleSortChange("requestedAmount")} className="cursor-pointer">
                            <div className="flex items-center">
                              Requested Amount
                              {sortBy === "requestedAmount" && (
                                <ArrowUpDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead onClick={() => handleSortChange("applicationDate")} className="cursor-pointer">
                            <div className="flex items-center">
                              Submitted Date
                              {sortBy === "applicationDate" && (
                                <ArrowUpDown className="ml-1 h-4 w-4" />
                              )}
                            </div>
                          </TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedApplications.map(application => (
                          <TableRow key={application.id} className="group">
                            <TableCell>
                              <Checkbox 
                                checked={selectedApplications.includes(application.id)}
                                onCheckedChange={() => toggleApplicationSelection(application.id)}
                                aria-label={`Select ${application.studentName}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{application.studentName}</div>
                              <div className="text-sm text-muted-foreground">{application.studentId}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{application.institutionName}</div>
                              {application.courseOfStudy && (
                                <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                  {application.courseOfStudy}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {application.educationLevel || "Not specified"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(application.requestedAmount)}
                              </div>
                              {application.approvedAmount && (
                                <div className="text-sm text-muted-foreground">
                                  Approved: {formatCurrency(application.approvedAmount)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatDate(application.lastUpdated || application.applicationDate)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {Math.floor(Math.random() * 14) + 1} days ago
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleViewDetails(application)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View Details</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewApplication(application.id)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleAllocateFunds(application)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Allocate
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No applications found</h3>
                    <p className="mt-1 text-gray-500">
                      There are no applications waiting for allocation that match your filters.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="institution" className="mt-0">
                {Object.keys(applicationsByInstitution).length === 0 ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No applications found</h3>
                    <p className="mt-1 text-gray-500">
                      There are no applications waiting for allocation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(applicationsByInstitution)
                      .filter(([institution]) => 
                        institutionFilter === "" || institution === institutionFilter
                      )
                      .map(([institution, apps]) => {
                        const institutionAppIds = apps.map(app => app.id);
                        const selectedCount = selectedApplications.filter(id => 
                          institutionAppIds.includes(id)
                        ).length;
                        const totalAmount = apps.reduce((sum, app) => 
                          sum + (app.requestedAmount || 0), 0
                        );
                        
                        return (
                          <Card key={institution} className="overflow-hidden">
                            <CardHeader className="bg-muted/50 pb-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-lg">{institution}</CardTitle>
                                  <CardDescription>
                                    {apps.length} application{apps.length !== 1 ? 's' : ''} pending allocation
                                  </CardDescription>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Total Requested</div>
                                    <div className="font-bold">{formatCurrency(totalAmount)}</div>
                                  </div>
                                  
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => selectAllFromInstitution(institution)}
                                  >
                                    <Checkbox 
                                      checked={selectedCount === apps.length && apps.length > 0}
                                      className="mr-2"
                                    />
                                    Select All
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/30">
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Education Level</TableHead>
                                    <TableHead>Requested Amount</TableHead>
                                    <TableHead>Submitted Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {apps.map(application => (
                                    <TableRow key={application.id} className="group">
                                      <TableCell>
                                        <Checkbox 
                                          checked={selectedApplications.includes(application.id)}
                                          onCheckedChange={() => toggleApplicationSelection(application.id)}
                                          aria-label={`Select ${application.studentName}`}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="font-medium">{application.studentName}</div>
                                        <div className="text-sm text-muted-foreground">{application.studentId}</div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                          {application.educationLevel || "Not specified"}
                                        </Badge>
                                        {application.courseOfStudy && (
                                          <div className="text-sm text-muted-foreground mt-1 truncate max-w-[200px]">
                                            {application.courseOfStudy}
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {formatCurrency(application.requestedAmount)}
                                      </TableCell>
                                      <TableCell>
                                        {formatDate(application.lastUpdated || application.applicationDate)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                          <TooltipProvider>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button 
                                                  variant="outline" 
                                                  size="sm"
                                                  onClick={() => handleViewDetails(application)}
                                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                  <Info className="h-4 w-4" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>View Details</TooltipContent>
                                            </Tooltip>
                                          </TooltipProvider>
                                          
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleViewApplication(application.id)}
                                          >
                                            <FileText className="h-4 w-4 mr-1" />
                                            View
                                          </Button>
                                          <Button 
                                            size="sm"
                                            onClick={() => handleAllocateFunds(application)}
                                          >
                                            <Send className="h-4 w-4 mr-1" />
                                            Allocate
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                            <CardFooter className="flex justify-end bg-muted/50 py-3">
                              <Button 
                                onClick={() => {
                                  setSelectedInstitution(institution);
                                  selectAllFromInstitution(institution);
                                  if (apps.length > 0) {
                                    handleBulkAllocate();
                                  }
                                }}
                                disabled={apps.length === 0}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Bulk Allocate ({apps.length})
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Individual Allocation Modal */}
      <Dialog open={isAllocateModalOpen} onOpenChange={setIsAllocateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate Funds</DialogTitle>
            <DialogDescription>
              Approve and allocate funds for this application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="space-y-2 rounded-md border p-3 bg-muted/20">
                <h3 className="font-medium">Student Details</h3>
                <p className="text-sm">{selectedApplication.studentName}</p>
                <p className="text-sm text-muted-foreground">{selectedApplication.institutionName} - {selectedApplication.educationLevel}</p>
                {selectedApplication.courseOfStudy && (
                  <p className="text-sm text-muted-foreground">{selectedApplication.courseOfStudy}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fund-category">Fund Category</Label>
                <Select 
                  value={selectedFundCategory}
                  onValueChange={setSelectedFundCategory}
                >
                  <SelectTrigger id="fund-category">
                    <SelectValue placeholder="Select fund category" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundCategoryOptions.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} - {formatCurrency(category.remainingAmount)} available
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allocated-amount">Allocation Amount (KES)</Label>
                <Input 
                  id="allocated-amount"
                  type="number"
                  value={allocatedAmount}
                  onChange={(e) => setAllocatedAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                <p className="text-xs text-muted-foreground">
                  Requested: {formatCurrency(selectedApplication.requestedAmount)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allocation-notes">Notes (Optional)</Label>
                <Input 
                  id="allocation-notes"
                  value={allocationNotes}
                  onChange={(e) => setAllocationNotes(e.target.value)}
                  placeholder="Add any notes about this allocation"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAllocation}>
              <Check className="h-4 w-4 mr-1" />
              Approve & Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Allocation Modal */}
      <Dialog open={isBulkAllocateModalOpen} onOpenChange={setIsBulkAllocateModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Fund Allocation</DialogTitle>
            <DialogDescription>
              Allocate funds to multiple applications at once
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Bulk Allocation</AlertTitle>
              <AlertDescription>
                You are about to allocate funds to {selectedApplications.length} selected application(s)
                {selectedInstitution && ` from ${selectedInstitution}`}.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="bulk-fund-category">Fund Category</Label>
              <Select 
                value={selectedFundCategory}
                onValueChange={setSelectedFundCategory}
              >
                <SelectTrigger id="bulk-fund-category">
                  <SelectValue placeholder="Select fund category" />
                </SelectTrigger>
                <SelectContent>
                  {fundCategoryOptions.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} - {formatCurrency(category.remainingAmount)} available
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bulk-allocation-notes">Notes (Optional)</Label>
              <Input 
                id="bulk-allocation-notes"
                value={allocationNotes}
                onChange={(e) => setAllocationNotes(e.target.value)}
                placeholder="Add any notes about this bulk allocation"
              />
            </div>
            
            <div className="rounded-md border p-4 bg-muted/20">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Applications:</span>
                  <span className="font-medium">{selectedApplications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(pendingApplications
                      .filter(app => selectedApplications.includes(app.id))
                      .reduce((sum, app) => sum + (app.requestedAmount || 0), 0)
                    )}
                  </span>
                </div>
                {selectedInstitution && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Institution:</span>
                    <span className="font-medium">{selectedInstitution}</span>
                  </div>
                )}
                {selectedApplications.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="max-h-36 overflow-auto space-y-1">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Selected Applications:</p>
                      {pendingApplications
                        .filter(app => selectedApplications.includes(app.id))
                        .map(app => (
                          <div key={app.id} className="text-xs flex justify-between">
                            <span>{app.studentName}</span>
                            <span>{formatCurrency(app.requestedAmount)}</span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitBulkAllocation}>
              <Check className="h-4 w-4 mr-1" />
              Approve & Allocate Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Application Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review detailed information for this application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Student Information</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{selectedApplication.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="text-sm font-medium">{selectedApplication.studentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <span className="text-sm font-medium">{selectedApplication.email || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <span className="text-sm font-medium">{selectedApplication.phoneNumber || "Not provided"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Institution Information</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{selectedApplication.institutionName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <span className="text-sm font-medium">{selectedApplication.institutionType || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Course:</span>
                      <span className="text-sm font-medium">{selectedApplication.courseOfStudy || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Year of Study:</span>
                      <span className="text-sm font-medium">{selectedApplication.yearOfStudy || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Education Level:</span>
                      <span className="text-sm font-medium">{selectedApplication.educationLevel || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Information</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Requested Amount:</span>
                      <span className="text-sm font-medium">{formatCurrency(selectedApplication.requestedAmount)}</span>
                    </div>
                    {selectedApplication.approvedAmount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Approved Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedApplication.approvedAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fund Category:</span>
                      <span className="text-sm font-medium">{selectedApplication.fundCategory || "Not assigned"}</span>
                    </div>
                    {selectedApplication.allocationAmount && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Allocated Amount:</span>
                        <span className="text-sm font-medium">{formatCurrency(selectedApplication.allocationAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Application Timeline</h3>
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Application Date:</span>
                      <span className="text-sm font-medium">{formatDate(selectedApplication.applicationDate)}</span>
                    </div>
                    {selectedApplication.reviewDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Review Date:</span>
                        <span className="text-sm font-medium">{formatDate(selectedApplication.reviewDate)}</span>
                      </div>
                    )}
                    {selectedApplication.approvalDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Approval Date:</span>
                        <span className="text-sm font-medium">{formatDate(selectedApplication.approvalDate)}</span>
                      </div>
                    )}
                    {selectedApplication.lastUpdated && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <span className="text-sm font-medium">{formatDate(selectedApplication.lastUpdated)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Current Status:</span>
                      <StatusBadge status={selectedApplication.status} />
                    </div>
                  </div>
                </div>
                
                {selectedApplication.reviewComments && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Review Comments</h3>
                    <div className="rounded-md border p-4">
                      <p className="text-sm">{selectedApplication.reviewComments}</p>
                    </div>
                  </div>
                )}
                
                {selectedApplication.documents && selectedApplication.documents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Documents</h3>
                    <div className="rounded-md border p-4">
                      <ul className="space-y-2">
                        {selectedApplication.documents.map((doc, index) => (
                          <li key={index} className="flex justify-between items-center">
                            <span className="text-sm">{doc.name}</span>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
              Close
            </Button>
            {selectedApplication && (
              <Button onClick={() => {
                setIsDetailsModalOpen(false);
                handleViewApplication(selectedApplication.id);
              }}>
                <FileText className="h-4 w-4 mr-1" />
                Full Details
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PendingAllocations;
