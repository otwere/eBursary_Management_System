import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FundFloat, FundStatusType } from "@/types/funds";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Archive, ArrowUpDown, Download, FileBarChart, FileClock, FileText, InfoIcon, Search, X } from "lucide-react";
import { toast } from "sonner";

const ClosedFunds = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FundStatusType | "all">("closed");
  const [sortColumn, setSortColumn] = useState<keyof FundFloat>("closedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [isReopenFundModalOpen, setIsReopenFundModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundFloat | null>(null);
  const [reopenReason, setReopenReason] = useState("");
  
  // Mock fund data
  const [funds, setFunds] = useState<FundFloat[]>([
    {
      id: "fund-1",
      name: "2024 Q1 Bursary Fund",
      description: "First Quarter Bursary Allocation for 2024 | 042-0345 NGCDF/BS/2024-001",
      amount: 5000000,
      academicYear: "2024",
      createdAt: "2023-12-15T09:00:00.000Z",
      createdBy: "Michael Johnson",
      status: "closed",
      allocatedAmount: 4750000,
      disbursedAmount: 4500000,
      remainingAmount: 250000,
      financialPeriod: "2024-Q1",
      closedAt: "2024-04-01T10:30:00.000Z",
      closedBy: "Kevin mwangi",
      closureReason: "End of Financial Period, remaining Funds to be carried forward."
    },
    {
      id: "fund-2",
      name: "2023 Scholarship Fund",
      description: "Annual Scholarship Fund for 2023",
      amount: 8000000,
      academicYear: "2023",
      createdAt: "2023-01-10T11:30:00.000Z",
      createdBy: "Otwere Evans",
      status: "closed",
      allocatedAmount: 7800000,
      disbursedAmount: 7800000,
      remainingAmount: 200000,
      financialPeriod: "2023",
      closedAt: "2023-12-20T15:45:00.000Z",
      closedBy: "Kevin mwangi",
      closureReason: "End of Academic Year, all approved applications processed."
    },
    {
      id: "fund-3",
      name: "2023 Q2 Emergency Fund",
      description: "Special allocation for emergency cases in Q2 2023",
      amount: 2000000,
      academicYear: "2023",
      createdAt: "2023-04-05T14:15:00.000Z",
      createdBy: "Michael Johnson",
      status: "closed",
      allocatedAmount: 1950000,
      disbursedAmount: 1950000,
      remainingAmount: 50000,
      financialPeriod: "2023-Q2",
      closedAt: "2023-07-10T09:20:00.000Z",
      closedBy: "Kevin mwangi",
      closureReason: "Funds Objectives met, remaining Amount to be carried forward to the next Quatre."
    },
    {
      id: "fund-4",
      name: "2024 Scholarship Fund",
      description: "Annual scholarship fund for 2024",
      amount: 10000000,
      academicYear: "2024",
      createdAt: "2024-01-05T08:30:00.000Z",
      createdBy: "Otwere Evans",
      status: "active",
      allocatedAmount: 6500000,
      disbursedAmount: 5000000,
      remainingAmount: 3500000,
      financialPeriod: "2024",
    },
    {
      id: "fund-5",
      name: "2024 Q2 Bursary Fund",
      description: "Second quarter bursary allocation for 2024",
      amount: 5500000,
      academicYear: "2024",
      createdAt: "2024-03-20T10:45:00.000Z",
      createdBy: "Michael Johnson",
      status: "active",
      allocatedAmount: 2200000,
      disbursedAmount: 1800000,
      remainingAmount: 3300000,
      financialPeriod: "2024-Q2",
    }
  ]);
  
  // Filter and sort funds
  const filteredFunds = funds
    .filter(fund => 
      (activeTab === "all" || fund.status === activeTab) &&
      (fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fund.academicYear.includes(searchQuery))
    )
    .sort((a, b) => {
      // Handle dates specially
      if (sortColumn === "createdAt" || sortColumn === "closedAt") {
        const aValue = a[sortColumn] ? new Date(a[sortColumn] as string).getTime() : 0;
        const bValue = b[sortColumn] ? new Date(b[sortColumn] as string).getTime() : 0;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle numbers
      if (typeof a[sortColumn] === "number") {
        return sortDirection === "asc" 
          ? (a[sortColumn] as number) - (b[sortColumn] as number)
          : (b[sortColumn] as number) - (a[sortColumn] as number);
      }
      
      // Handle strings
      const aStr = String(a[sortColumn] || "");
      const bStr = String(b[sortColumn] || "");
      return sortDirection === "asc" 
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  
  // Handle sort
  const handleSort = (column: keyof FundFloat) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Handle viewing fund details
  const handleViewFundDetails = (fund: FundFloat) => {
    setSelectedFund(fund);
    setIsViewDetailsModalOpen(true);
  };
  
  // Handle reopening a fund
  const handleReopenFund = (fund: FundFloat) => {
    setSelectedFund(fund);
    setReopenReason("");
    setIsReopenFundModalOpen(true);
  };
  
  // Submit fund reopening
  const handleSubmitReopenFund = () => {
    if (!selectedFund) return;
    
    if (!reopenReason.trim()) {
      toast.error("Please provide a reason for reopening this fund");
      return;
    }
    
    // Update the fund status with the current timestamp
    const updatedFunds = funds.map(fund =>
      fund.id === selectedFund.id
        ? {
            ...fund,
            status: "active" as FundStatusType,
            closedAt: new Date().toISOString(), // Update closedAt to current timestamp
            closedBy: undefined,
            closureReason: undefined,
          }
        : fund
    );
    
    setFunds(updatedFunds);
    setIsReopenFundModalOpen(false);
    toast.success(`Fund "${selectedFund.name}" has been reopened successfully at ${new Date().toLocaleString()}`);
  };
  
  // Calculate total values
  const totalAmount = filteredFunds.reduce((sum, fund) => sum + fund.amount, 0);
  const totalAllocated = filteredFunds.reduce((sum, fund) => sum + fund.allocatedAmount, 0);
  const totalDisbursed = filteredFunds.reduce((sum, fund) => sum + fund.disbursedAmount, 0);
  const totalRemaining = filteredFunds.reduce((sum, fund) => sum + fund.remainingAmount, 0);
  
  // Calculate allocation percentage
  const allocationPercentage = (amount: number, total: number) => {
    return total > 0 ? ((amount / total) * 100).toFixed(1) + "%" : "0%";
  };
  
  // Get status badge color
  const getStatusBadgeColor = (status: FundStatusType) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-red-100 text-red-500 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "depleted":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Export fund report
  const handleExportReport = (fund: FundFloat) => {
    // In a real app, this would generate and download a report
    toast.success(`Exporting report for "${fund.name}"`);
  };
  
  return (
    <DashboardLayout title="Closure & Reopening of Funds ">
      <div className="space-y-6 lg:-mx-[90px] mt-[-4rem]">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2">
              <div className="border-l-4 border-l-red-500 pl-2 rounded  w-full h-16">
                <CardTitle className="text-xl font-bold text-blue-800">Funds Closure & Reopen Management</CardTitle>
                <CardDescription className="text-muted-foreground -mt-1">
                  View and Manage Active and Closed Funds
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as FundStatusType | "all")} className="w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <TabsList className="space-x-40">
                  <TabsTrigger value="all">All Created Funds</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="closed">Closed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="depleted">Depleted</TabsTrigger>
                </TabsList>
                
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    type="search" 
                    placeholder="Search funds..." 
                    className="pl-9 w-full sm:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <FundTable 
                  funds={filteredFunds}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  handleViewFundDetails={handleViewFundDetails}
                  handleReopenFund={handleReopenFund}
                  handleExportReport={handleExportReport}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                <FundTable 
                  funds={filteredFunds}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  handleViewFundDetails={handleViewFundDetails}
                  handleReopenFund={handleReopenFund}
                  handleExportReport={handleExportReport}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </TabsContent>
              
              <TabsContent value="closed" className="mt-0">
                <FundTable 
                  funds={filteredFunds}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  handleViewFundDetails={handleViewFundDetails}
                  handleReopenFund={handleReopenFund}
                  handleExportReport={handleExportReport}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <FundTable 
                  funds={filteredFunds}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  handleViewFundDetails={handleViewFundDetails}
                  handleReopenFund={handleReopenFund}
                  handleExportReport={handleExportReport}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </TabsContent>
              
              <TabsContent value="depleted" className="mt-0">
                <FundTable 
                  funds={filteredFunds}
                  sortColumn={sortColumn}
                  sortDirection={sortDirection}
                  handleSort={handleSort}
                  handleViewFundDetails={handleViewFundDetails}
                  handleReopenFund={handleReopenFund}
                  handleExportReport={handleExportReport}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row border-t bg-gray-50 gap-4 mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="space-y-1 mt-2 border-l-4 border-l-blue-500 pl-2 rounded">
                <p className="text-sm text-gray-500 -mb-2">Total Amount</p>
                <p className="text-lg font-bold text-blue-800">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-gray-500">{allocationPercentage(totalAmount, totalAmount)}</p>
              </div>
              <div className="space-y-1 mt-2 border-l-4 border-l-lime-500 pl-2 rounded">
                <p className="text-sm text-gray-500 -mb-1">Total Allocated</p>
                <p className=" text-lg font-bold text-lime-500">{formatCurrency(totalAllocated)}</p>
                <p className="text-xs text-gray-500">{allocationPercentage(totalAllocated, totalAmount)}</p>
              </div>
              <div className="space-y-1 mt-2 border-l-4 border-l-green-500 pl-2 rounded">
                <p className="text-sm text-gray-500 -mb-1">Total Disbursed</p>
                <p className=" text-lg font-bold text-green-500">{formatCurrency(totalDisbursed)}</p>
                <p className="text-xs text-gray-500">{allocationPercentage(totalDisbursed, totalAmount)}</p>
              </div>
              <div className="space-y-1 mt-2 border-l-4 border-l-orange-500 pl-2 rounded">
                <p className="text-sm text-gray-500 -mb-1">Total Remaining (Balance)</p>
                <p className="text-lg font-bold text-orange-500">{formatCurrency(totalRemaining)}</p>
                <p className="text-xs text-gray-500">{allocationPercentage(totalRemaining, totalAmount)}</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* View Fund Details Modal */}
      <Dialog open={isViewDetailsModalOpen} onOpenChange={setIsViewDetailsModalOpen}>
        <DialogContent className="lg:max-w-6xl sm:max-w-3xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-blue-500 pl-2 h-16 border-b-2 rounded">
            <DialogTitle className="text-lg font-bold text-blue-800 mb-[-0.5rem]">Fund Details</DialogTitle>
            <DialogDescription className="text-muted-foreground overflow-y-auto">
              Detailed Information about this Funds
            </DialogDescription>
          </DialogHeader>
          
          {selectedFund && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center mt-[-0.5rem] mb-[-1.2rem]">
                <h3 className="text-lg font-bold text-blue-800 ">{selectedFund.name}</h3>
                <Badge variant="outline" className={getStatusBadgeColor(selectedFund.status)}>
                  {selectedFund.status.charAt(0).toUpperCase() + selectedFund.status.slice(1)}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm w-fit">{selectedFund.description}</p>
              
              <div className="grid grid-cols-2 gap-4 border rounded bg-blue-50">
                <div className="space-y-1 mx-4">
                  <p className="text-sm text-gray-500 mb-[-0.4rem] mt-4">Academic Year</p>
                  <p className="font-bold text-blue-800">{selectedFund.academicYear}</p>
                </div>
                <div className="space-y-1 mx-32">
                  <p className="text-sm text-gray-500 mb-[-0.4rem] mt-4 ">Financial Period</p>
                  <p className="font-bold text-blue-800">{selectedFund.financialPeriod || "N/A"}</p>
                </div>
                <div className="space-y-1 mx-4">
                  <p className="text-sm text-gray-500 mb-[-0.4rem] ">Created On</p>
                  <p className="font-bold text-blue-800">{formatDate(selectedFund.createdAt)}</p>
                </div>
                <div className="space-y-1 mx-32">
                  <p className="text-sm text-gray-500 mb-[-0.4rem]">Created By</p>
                  <p className="font-bold text-blue-800">{selectedFund.createdBy}</p>
                </div>
                {selectedFund.status === "closed" && (
                  <>
                    <div className="space-y-1 mx-4 mb-4">
                      <p className="text-sm text-gray-500 mb-[-0.4rem]">Closed On</p>
                      <p className="font-bold text-blue-800">{formatDate(selectedFund.closedAt)}</p>
                    </div>
                    <div className="space-y-1 mx-32">
                      <p className="text-sm text-gray-500 mb-[-0.4rem]">Closed By</p>
                      <p className="font-bold text-blue-800">{selectedFund.closedBy}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="rounded border p-4 space-y-3 bg-gray-100">
                <h4 className="font-bold text-blue-800">Funds Allocation</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1 border-l-4 border-l-blue-500 pl-2 rounded">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-blue-800">{formatCurrency(selectedFund.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {allocationPercentage(selectedFund.amount, selectedFund.amount)}
                    </p>
                  </div>
                  <div className="space-y-1 border-l-4 border-l-lime-500 pl-2 rounded">
                    <p className="text-sm text-gray-500">Allocated</p>
                    <p className="font-bold text-lime-500">{formatCurrency(selectedFund.allocatedAmount)}</p>
                    <p className="text-xs text-gray-500">
                      {allocationPercentage(selectedFund.allocatedAmount, selectedFund.amount)}
                    </p>
                  </div>
                  <div className="space-y-1 border-l-4 border-l-green-500 pl-2 rounded">
                    <p className="text-sm text-gray-500">Disbursed</p>
                    <p className="font-bold text-green-500">{formatCurrency(selectedFund.disbursedAmount)}</p>
                    <p className="text-xs text-gray-500">
                      {allocationPercentage(selectedFund.disbursedAmount, selectedFund.amount)}
                    </p>
                  </div>
                  <div className="space-y-1 border-l-4 border-l-orange-500 pl-2 rounded">
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="font-bold text-orange-500">{formatCurrency(selectedFund.remainingAmount)}</p>
                    <p className="text-xs text-gray-500">
                      {allocationPercentage(selectedFund.remainingAmount, selectedFund.amount)}
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedFund.status === "closed" && selectedFund.closureReason && (
                <div className="space-y-2 rounded">
                  <h4 className="font-bold text-blue-800">Closure Reason</h4>
                  <p className="text-sm text-gray-600 p-3 rounded border bg-red-50">
                    {selectedFund.closureReason}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedFund?.status === "closed" && (
              <Button 
                variant="outline" 
                className="sm:mr-auto"
                onClick={() => {
                  setIsViewDetailsModalOpen(false);
                  handleReopenFund(selectedFund);
                }}
              >
                <Archive className="h-4 w-4 mr-1 rotate-180" />
                Reopen Fund
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => selectedFund && handleExportReport(selectedFund)}
            >
              <Download className="h-4 w-4 mr-1" />
              Export Report
            </Button>
            <Button onClick={() => setIsViewDetailsModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reopen Fund Modal */}
      <Dialog open={isReopenFundModalOpen} onOpenChange={setIsReopenFundModalOpen}>
        <DialogContent className="lg:max-w-5xl sm:max-w-xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-blue-500 pl-2 rounded h-12 border-b-2">
            <DialogTitle className="font-bold text-blue-800 mb-[-0.4rem]">Reopen Fund</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to reopen this fund?
            </DialogDescription>
          </DialogHeader>
          
          {selectedFund && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <h3 className="font-bold text-blue-800">{selectedFund.name}</h3>
                <p className="text-sm text-gray-500">{selectedFund.description}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reopen-reason">Reason for Reopening</Label>
                <Textarea
                  id="reopen-reason"
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Enter the reason for reopening this fund..."
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReopenFundModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReopenFund}>
              Reopen Fund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

// Fund Table Component
interface FundTableProps {
  funds: FundFloat[];
  sortColumn: keyof FundFloat;
  sortDirection: "asc" | "desc";
  handleSort: (column: keyof FundFloat) => void;
  handleViewFundDetails: (fund: FundFloat) => void;
  handleReopenFund: (fund: FundFloat) => void;
  handleExportReport: (fund: FundFloat) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString?: string) => string;
  getStatusBadgeColor: (status: FundStatusType) => string;
}

const FundTable: React.FC<FundTableProps> = ({
  funds,
  sortColumn,
  sortDirection,
  handleSort,
  handleViewFundDetails,
  handleReopenFund,
  handleExportReport,
  formatCurrency,
  formatDate,
  getStatusBadgeColor
}) => {
  // If no funds, show message
  if (funds.length === 0) {
    return (
      <div className="text-center py-10 border rounded">
        <FileBarChart className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-bold text-gray-800">No funds found</h3>
        <p className="mt-1 text-gray-500">
          There are no funds matching your current filters.
        </p>
      </div>
    );
  }
  
  // Render table with funds
  return (
    <div className="overflow-auto rounded border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-64 cursor-pointer"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                <span>Fund Name</span>
                {sortColumn === "name" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("academicYear")}
            >
              <div className="flex items-center">
                <span>Academic Year</span>
                {sortColumn === "academicYear" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center">
                <span>Amount</span>
                {sortColumn === "amount" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("allocatedAmount")}
            >
              <div className="flex items-center">
                <span>Allocated</span>
                {sortColumn === "allocatedAmount" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("remainingAmount")}
            >
              <div className="flex items-center">
                <span>Remaining</span>
                {sortColumn === "remainingAmount" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                <span>Status</span>
                {sortColumn === "status" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort("closedAt")}
            >
              <div className="flex items-center">
                <span>Closed Date</span>
                {sortColumn === "closedAt" && (
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funds.map(fund => (
            <TableRow key={fund.id}>
              <TableCell>
                <div className="font-bold text-blue-800">{fund.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {fund.description}
                </div>
              </TableCell>
              <TableCell>{fund.academicYear}</TableCell>
              <TableCell>{formatCurrency(fund.amount)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{formatCurrency(fund.allocatedAmount)}</div>
                  <div className="text-xs text-gray-500">
                    {((fund.allocatedAmount / fund.amount) * 100).toFixed(1)}%
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(fund.remainingAmount)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeColor(fund.status)}>
                  {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {fund.closedAt ? formatDate(fund.closedAt) : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewFundDetails(fund)}
                    title="View Details"
                  >
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleExportReport(fund)}
                    title="Export Report"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  {fund.status === "closed" && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleReopenFund(fund)}
                      title="Reopen Fund"
                    >
                      <Archive className="h-4 w-4 rotate-180" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClosedFunds;
