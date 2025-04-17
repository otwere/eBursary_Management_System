import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionRecord } from "@/types/funds";
import { Search, Filter, Download, Eye, MoreHorizontal, FileText, Calendar, ArrowDownUp } from "lucide-react";

// Mock transaction data
const mockTransactions: TransactionRecord[] = [
  {
    id: "trans-1",
    disbursementId: "disb-1",
    applicationId: "APP1001",
    studentId: "STD12345",
    studentName: "Pauline Mercy",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    amount: 45000,
    method: "BankTransfer",
    transactionDate: "2024-03-15T10:35:00.000Z",
    status: "successful",
    reference: "TRF-28395728",
    transactionType: "disbursement",
    processedBy: "Sarah Williams",
    details: {
      bankName: "Equity Bank",
      accountNumber: "****5678",
      accountName: "Pauline Mercy"
    }
  },
  {
    id: "trans-2",
    disbursementId: "disb-2",
    applicationId: "APP1002",
    studentId: "STD12346",
    studentName: "Kevin mwangi",
    institutionId: "INST002",
    institutionName: "Kenya Technical University",
    amount: 30000,
    method: "Cheque",
    transactionDate: "2024-03-10T11:15:00.000Z",
    status: "successful",
    reference: "CHQ-12453",
    transactionType: "disbursement",
    processedBy: "Sarah Williams",
    details: {
      chequeNumber: "000345",
      receiptNumber: "REC-7893"
    }
  },
  {
    id: "trans-3",
    disbursementId: "disb-5",
    applicationId: "APP1005",
    studentId: "STD12349",
    studentName: "Mike Brown",
    institutionId: "INST005",
    institutionName: "Kenyatta University",
    amount: 35000,
    method: "Mpesa",
    transactionDate: "2024-03-17T14:05:00.000Z",
    status: "failed",
    reference: "MP-39284757",
    transactionType: "disbursement",
    processedBy: "Sarah Williams",
    details: {
      mpesaNumber: "2547********",
      mpesaName: "Mike Brown",
      failureReason: "Incorrect phone number"
    }
  },
  {
    id: "trans-4",
    disbursementId: "disb-2",
    applicationId: "APP1002",
    studentId: "STD12346",
    studentName: "Kevin mwangi",
    institutionId: "INST002",
    institutionName: "Kenya Technical University",
    amount: 5000,
    method: "BankTransfer",
    transactionDate: "2024-03-20T09:25:00.000Z",
    status: "successful",
    reference: "TRF-28395730",
    transactionType: "disbursement",
    processedBy: "Sarah Williams",
    details: {
      bankName: "KCB Bank",
      accountNumber: "****4321",
      accountName: "Kevin mwangi",
      notes: "Additional disbursement"
    }
  },
  {
    id: "trans-5",
    disbursementId: "disb-3",
    applicationId: "APP1003",
    studentId: "STD12347",
    studentName: "Samuel Johnson",
    institutionId: "INST003",
    institutionName: "Moi University",
    amount: 25000,
    method: "Mpesa",
    transactionDate: "2024-03-19T15:30:00.000Z",
    status: "successful",
    reference: "MP-39284758",
    transactionType: "disbursement",
    processedBy: "Sarah Williams",
    details: {
      mpesaNumber: "2547********",
      mpesaName: "Samuel Johnson",
      confirmationCode: "QWERTY123"
    }
  }
];

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get filtered transactions
  const getFilteredTransactions = () => {
    return mockTransactions.filter(transaction => {
      // Filter by status
      const statusMatch = statusFilter === "all" || transaction.status === statusFilter;
      
      // Filter by method
      const methodMatch = methodFilter === "all" || transaction.method === methodFilter;
      
      // Filter by date
      let dateMatch = true;
      if (dateFilter === "today") {
        const today = new Date();
        const transDate = new Date(transaction.transactionDate);
        dateMatch = today.toDateString() === transDate.toDateString();
      } else if (dateFilter === "this-week") {
        const today = new Date();
        const transDate = new Date(transaction.transactionDate);
        const diffTime = Math.abs(today.getTime() - transDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dateMatch = diffDays <= 7;
      } else if (dateFilter === "this-month") {
        const today = new Date();
        const transDate = new Date(transaction.transactionDate);
        dateMatch = today.getMonth() === transDate.getMonth() && 
                    today.getFullYear() === transDate.getFullYear();
      }
      
      // Filter by search query (student name, ID, reference, institution)
      const searchMatch = searchQuery === "" || 
        transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.institutionName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return statusMatch && methodMatch && dateMatch && searchMatch;
    });
  };

  // Get paginated transactions
  const getPaginatedTransactions = () => {
    const filteredTransactions = getFilteredTransactions();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage);

  // Get status badge
  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case "successful":
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Successful</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Failed</Badge>;
      case "reversed":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Reversed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get method badge
  const getMethodBadge = (method: TransactionRecord['method']) => {
    switch (method) {
      case "BankTransfer":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Bank Transfer</Badge>;
      case "Cheque":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Cheque</Badge>;
      case "Mpesa":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">M-Pesa</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout title="Transaction History">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold mt-[-1rem]">Transaction History</h1>
          <p className="text-gray-500 ">
            View and track all Financial Transactions
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by student, reference..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="reversed">Reversed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Payment Method</label>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="BankTransfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Mpesa">M-Pesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl mt-[-1rem]">Transactions</CardTitle>
                <CardDescription>
                  Showing {getFilteredTransactions().length} Transactions
                </CardDescription>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPaginatedTransactions().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(transaction.transactionDate)}</div>
                      <div className="text-xs text-gray-500">By : {transaction.processedBy}</div>
                    </TableCell>
                    <TableCell>
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono">
                        {transaction.reference}
                      </code>
                      <div className="text-xs text-gray-500 mt-1">ID : {transaction.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.studentName}</div>
                      <div className="text-xs text-gray-500">{transaction.studentId}</div>
                    </TableCell>
                    <TableCell>
                      <div>{transaction.institutionName}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {getMethodBadge(transaction.method)}
                      <div className="text-xs text-gray-500 mt-1">
                        {transaction.method === "BankTransfer" && transaction.details.bankName && (
                          <span>{transaction.details.bankName}</span>
                        )}
                        {transaction.method === "Cheque" && transaction.details.chequeNumber && (
                          <span>#{transaction.details.chequeNumber}</span>
                        )}
                        {transaction.method === "Mpesa" && transaction.details.mpesaNumber && (
                          <span>{transaction.details.mpesaName}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {getPaginatedTransactions().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Calendar className="h-8 w-8 mb-2" />
                        <p>No transactions found</p>
                        <p className="text-sm">Try changing your filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionHistory;
