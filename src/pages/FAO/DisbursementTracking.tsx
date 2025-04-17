
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Disbursement, DisbursementMethodType } from "@/types/funds";
import { Search, Filter, FileText, MoreHorizontal, Eye, Download, Calendar, ArrowDown, FileCheck, DollarSign, BanknoteIcon, CreditCard, Smartphone } from "lucide-react";

// Mock disbursements data
const mockDisbursements: Disbursement[] = [
  {
    id: "disb-1",
    applicationId: "APP1001",
    studentId: "STD12345",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    amount: 45000,
    method: "BankTransfer",
    status: "completed",
    reference: "TRF-28395728",
    transactionDate: "2024-03-15T10:30:00.000Z",
    processedBy: "Otwere Evans",
    processedAt: "2024-03-15T10:35:00.000Z",
    notes: "Disbursement completed successfully",
    bankName: "Equity Bank",
    accountNumber: "****5678",
    accountName: "Pauline Mercy"
  },
  {
    id: "disb-2",
    applicationId: "APP1002",
    studentId: "STD12346",
    institutionId: "INST002",
    institutionName: "Kenya Technical University",
    amount: 30000,
    method: "Cheque",
    status: "completed",
    reference: "CHQ-12453",
    transactionDate: "2024-03-10T11:00:00.000Z",
    processedBy: "Otwere Evans",
    processedAt: "2024-03-10T11:15:00.000Z",
    notes: "Cheque handed over to institution finance office",
    chequeNumber: "000345",
    receiptNumber: "REC-7893"
  },
  {
    id: "disb-3",
    applicationId: "APP1003",
    studentId: "STD12347",
    institutionId: "INST003",
    institutionName: "Moi University",
    amount: 25000,
    method: "Mpesa",
    status: "in-progress",
    reference: "MP-39284756",
    transactionDate: "2024-03-18T09:00:00.000Z",
    notes: "Waiting for M-Pesa confirmation",
    mpesaNumber: "2547********",
    mpesaName: "Kevin mwangi"
  },
  {
    id: "disb-4",
    applicationId: "APP1004",
    studentId: "STD12348",
    institutionId: "INST004",
    institutionName: "Strathmore University",
    amount: 50000,
    method: "BankTransfer",
    status: "pending",
    reference: "TRF-28395729",
    bankName: "KCB Bank",
    accountNumber: "****1234",
    accountName: "Alice Johnson"
  },
  {
    id: "disb-5",
    applicationId: "APP1005",
    studentId: "STD12349",
    institutionId: "INST005",
    institutionName: "Kenyatta University",
    amount: 35000,
    method: "Mpesa",
    status: "failed",
    reference: "MP-39284757",
    transactionDate: "2024-03-17T14:00:00.000Z",
    processedBy: "Otwere Evans",
    processedAt: "2024-03-17T14:05:00.000Z",
    notes: "Failed due to incorrect phone number",
    mpesaNumber: "2547********",
    mpesaName: "Mike Brown"
  }
];

const DisbursementTracking = () => {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [methodFilter, setMethodFilter] = React.useState<DisbursementMethodType | "all">("all");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get filtered disbursements
  const getFilteredDisbursements = () => {
    return mockDisbursements.filter(disbursement => {
      // Filter by status
      const statusMatch = filter === "all" || disbursement.status === filter;
      
      // Filter by method
      const methodMatch = methodFilter === "all" || disbursement.method === methodFilter;
      
      // Filter by search query (institution name, student ID, or reference)
      const searchMatch = searchQuery === "" || 
        disbursement.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disbursement.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (disbursement.reference && disbursement.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return statusMatch && methodMatch && searchMatch;
    });
  };

  // Calculate totals
  const getTotalAmount = (status: string) => {
    if (status === "all") {
      return mockDisbursements.reduce((sum, disb) => sum + disb.amount, 0);
    }
    return mockDisbursements
      .filter(disb => disb.status === status)
      .reduce((sum, disb) => sum + disb.amount, 0);
  };

  // Get method icon
  const getMethodIcon = (method: DisbursementMethodType) => {
    switch (method) {
      case "BankTransfer":
        return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
      case "Cheque":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
      case "Mpesa":
        return <Smartphone className="h-4 w-4 text-green-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status: Disbursement['status']) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout title="Disbursement Tracking">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold mt-[-1rem]">Disbursement Tracking</h1>
          <p className="text-gray-500 mt-0">
            Track and Manage Fund Disbursements to Institutions
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Disbursements</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(getTotalAmount("all"))}</p>
                  <p className="text-xs text-gray-500 mt-1">{mockDisbursements.length} transactions</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(getTotalAmount("completed"))}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {mockDisbursements.filter(d => d.status === "completed").length} transactions
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <FileCheck className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold mt-1 text-blue-600">
                    {formatCurrency(getTotalAmount("in-progress") + getTotalAmount("pending"))}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {mockDisbursements.filter(d => d.status === "in-progress" || d.status === "pending").length} transactions
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <ArrowDown className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Failed</p>
                  <p className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(getTotalAmount("failed"))}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {mockDisbursements.filter(d => d.status === "failed").length} transactions
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-full">
                  <Calendar className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Disbursements Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-xl mt-[-0.5rem]">Disbursements</CardTitle>
                <CardDescription>
                  View and Manage Fund Disbursements
                </CardDescription>
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search disbursements..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as DisbursementMethodType | "all")}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>{methodFilter === "all" ? "All Methods" : methodFilter}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Mpesa">M-Pesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setFilter}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
              
              <TabsContent value={filter} className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredDisbursements().map(disbursement => (
                      <TableRow key={disbursement.id}>
                        <TableCell>
                          <div className="font-medium">{disbursement.institutionName}</div>
                          <div className="text-xs text-gray-500">App ID: {disbursement.applicationId}</div>
                        </TableCell>
                        <TableCell>{disbursement.studentId}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(disbursement.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getMethodIcon(disbursement.method)}
                            <span className="ml-2">{disbursement.method}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {disbursement.method === "BankTransfer" && disbursement.bankName && (
                              <span>{disbursement.bankName} • {disbursement.accountNumber}</span>
                            )}
                            {disbursement.method === "Cheque" && disbursement.chequeNumber && (
                              <span>Cheque #{disbursement.chequeNumber}</span>
                            )}
                            {disbursement.method === "Mpesa" && disbursement.mpesaNumber && (
                              <span>{disbursement.mpesaNumber}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                            {disbursement.reference || "N/A"}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(disbursement.transactionDate)}</div>
                          {disbursement.processedBy && (
                            <div className="text-xs text-gray-500">
                              By: {disbursement.processedBy}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(disbursement.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                View Application
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {getFilteredDisbursements().length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <FileText className="h-8 w-8 mb-2" />
                            <p>No disbursements found</p>
                            <p className="text-sm">Try changing your filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DisbursementTracking;
