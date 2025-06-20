import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransactionRecord } from "@/types/funds";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  Calendar,
  ArrowDownUp,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  CreditCard,
  Wallet,
  Info
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// DetailItem component moved outside the main component
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span className="text-sm text-gray-800 font-mono">{value}</span>
    </div>
  );
}

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
    processedBy: "Otwere Evans",
    details: {
      bankName: "Equity Bank",
      accountNumber: "****5678",
      institutionName: "University of Nairobi",
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
    processedBy: "Otwere Evans",
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
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547*****543",
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
    processedBy: "Otwere Evans",
    details: {
      bankName: "KCB Bank",
      institutionName: "Kenya Technical University",
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
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547*******123",
      mpesaName: "Samuel Johnson",
      confirmationCode: "QWERTY123"
    }
  },
  {
    id: "trans-6",
    disbursementId: "disb-4",
    applicationId: "APP1006",
    studentId: "STD12350",
    studentName: "Linda Achieng",
    institutionId: "INST004",
    institutionName: "Egerton University",
    amount: 40000,
    method: "Mpesa",
    transactionDate: "2024-03-22T13:15:00.000Z",
    status: "successful",
    reference: "MP-38475920",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547*****980",
      mpesaName: "Linda Achieng",
      confirmationCode: "LMNOP789"
    }
  },
  {
    id: "trans-7",
    disbursementId: "disb-5",
    applicationId: "APP1007",
    studentId: "STD12351",
    studentName: "Brian Otieno",
    institutionId: "INST005",
    institutionName: "Kenyatta University",
    amount: 32000,
    method: "BankTransfer",
    transactionDate: "2024-03-23T10:45:00.000Z",
    status: "successful",
    reference: "TRF-92837465",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      bankName: "Absa Bank",
      institutionName: "Kenyatta University",
      accountNumber: "****7890",
      accountName: "Brian Otieno"
    }
  },
  {
    id: "trans-8",
    disbursementId: "disb-6",
    applicationId: "APP1008",
    studentId: "STD12352",
    studentName: "Faith Wanjiku",
    institutionId: "INST006",
    institutionName: "Mount Kenya University",
    amount: 28000,
    method: "Cheque",
    transactionDate: "2024-03-24T09:05:00.000Z",
    status: "successful",
    reference: "CHQ-56789",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      institutionName: "Mount Kenya University",
      chequeNumber: "000456",
      receiptNumber: "REC-8910"
    }
  },
  {
    id: "trans-9",
    disbursementId: "disb-7",
    applicationId: "APP1009",
    studentId: "STD12353",
    studentName: "George Kimani",
    institutionId: "INST007",
    institutionName: "Maseno University",
    amount: 27000,
    method: "Mpesa",
    transactionDate: "2024-03-25T11:00:00.000Z",
    status: "failed",
    reference: "MP-92837467",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547********",
      mpesaName: "George Kimani",
      failureReason: "Insufficient funds"
    }
  },
  {
    id: "trans-10",
    disbursementId: "disb-8",
    applicationId: "APP1010",
    studentId: "STD12354",
    studentName: "Caroline Nduta",
    institutionId: "INST008",
    institutionName: "Jomo Kenyatta University",
    amount: 50000,
    method: "BankTransfer",
    transactionDate: "2024-03-26T10:15:00.000Z",
    status: "successful",
    reference: "TRF-27384930",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      bankName: "Cooperative Bank",
      institutionName: "Jomo Kenyatta University",
      accountNumber: "****3456",
      accountName: "Caroline Nduta"
    }
  },
  {
    id: "trans-11",
    disbursementId: "disb-9",
    applicationId: "APP1011",
    studentId: "STD12355",
    studentName: "Daniel Kiprono",
    institutionId: "INST009",
    institutionName: "Technical University of Mombasa",
    amount: 31000,
    method: "Mpesa",
    transactionDate: "2024-03-27T08:55:00.000Z",
    status: "successful",
    reference: "MP-19283746",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547********",
      mpesaName: "Daniel Kiprono",
      confirmationCode: "ABC12345"
    }
  },
  {
    id: "trans-12",
    disbursementId: "disb-10",
    applicationId: "APP1012",
    studentId: "STD12356",
    studentName: "Irene Wambui",
    institutionId: "INST010",
    institutionName: "Strathmore University",
    amount: 60000,
    method: "Cheque",
    transactionDate: "2024-03-28T13:45:00.000Z",
    status: "successful",
    reference: "CHQ-90876",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      institutionName: "Strathmore University",
      amount: 60000,
      chequeNumber: "000789",
      receiptNumber: "REC-2345"
    }
  },
  {
    id: "trans-13",
    disbursementId: "disb-11",
    applicationId: "APP1013",
    studentId: "STD12357",
    studentName: "Martin Njoroge",
    institutionId: "INST011",
    institutionName: "Daystar University",
    amount: 22000,
    method: "Mpesa",
    transactionDate: "2024-03-29T12:30:00.000Z",
    status: "failed",
    reference: "MP-37281920",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      mpesaNumber: "2547*****008",
      mpesaName: "Martin Njoroge",
      failureReason: "Network error"
    }
  },
  {
    id: "trans-14",
    disbursementId: "disb-12",
    applicationId: "APP1014",
    studentId: "STD12358",
    studentName: "Nancy Chebet",
    institutionId: "INST012",
    institutionName: "Masinde Muliro University",
    amount: 37000,
    method: "BankTransfer",
    transactionDate: "2024-03-30T14:20:00.000Z",
    status: "successful",
    reference: "TRF-38475912",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      bankName: "Family Bank",
      institutionName: "Masinde Muliro University",
      accountNumber: "****8910",
      accountName: "Nancy Chebet"
    }
  },
  {
    id: "trans-15",
    disbursementId: "disb-13",
    applicationId: "APP1015",
    studentId: "STD12359",
    studentName: "Victor Kiplagat",
    institutionId: "INST013",
    institutionName: "Africa Nazarene University",
    amount: 45000,
    method: "Cheque",
    transactionDate: "2024-04-01T10:00:00.000Z",
    status: "successful",
    reference: "CHQ-45678",
    transactionType: "disbursement",
    processedBy: "Otwere Evans",
    details: {
      institutionName: "Africa Nazarene University",
      chequeNumber: "000321",
      receiptNumber: "REC-5678"
    }
  },
];

const TransactionHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TransactionRecord; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const itemsPerPage = 5;

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort transactions
  const requestSort = (key: keyof TransactionRecord) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sorted and filtered transactions
  const getFilteredTransactions = () => {
    let filteredTransactions = [...mockTransactions];

    // Apply filters
    filteredTransactions = filteredTransactions.filter(transaction => {
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

      // Filter by search query
      const searchMatch = searchQuery === "" ||
        transaction.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.institutionName.toLowerCase().includes(searchQuery.toLowerCase());

      return statusMatch && methodMatch && dateMatch && searchMatch;
    });

    // Apply sorting
    if (sortConfig !== null) {
      filteredTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredTransactions;
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

  // Render method details
  const renderMethodDetails = (transaction: TransactionRecord) => {
    switch (transaction.method) {
      case "BankTransfer":
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Bank Name</p>
              <p className="text-sm">{transaction.details.bankName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Number</p>
              <p className="text-sm">{transaction.details.accountNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Name</p>
              <p className="text-sm">{transaction.details.institutionName || 'N/A'}</p>
            </div>
          </div>
        );
      case "Cheque":
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Cheque Number</p>
              <p className="text-sm">{transaction.details.chequeNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Receipt Number</p>
              <p className="text-sm">{transaction.details.receiptNumber || 'N/A'}</p>
            </div>
          </div>
        );
      case "Mpesa":
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Phone Number</p>
              <p className="text-sm">{transaction.details.mpesaNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Name</p>
              <p className="text-sm">{transaction.details.mpesaName || 'N/A'}</p>
            </div>
            {transaction.details.confirmationCode && (
              <div>
                <p className="text-sm font-medium">Confirmation Code</p>
                <p className="text-sm">{transaction.details.confirmationCode}</p>
              </div>
            )}
            {transaction.details.failureReason && (
              <div>
                <p className="text-sm font-medium">Failure Reason</p>
                <p className="text-sm text-red-600">{transaction.details.failureReason}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Transaction History">
      <div className="space-y-6 lg:-mx-[78px] mt-[-4rem]">
        {/* Header */}
        <div className="border-l-4 border-l-yellow-500 pl-2 rounded h-20 border-b-2 ">
          <h1 className="text-xl font-bold text-blue-800 -mb-2">Transaction History - Disbursement</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and track all Financial Transactions
          </p>
        </div>
        {/* Summary Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 lg:mx-[2px]">
          <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100 h-24">
            <CardHeader className="pb-2">
              <CardDescription className="-mt-2 text-muted-foreground">Total Transactions</CardDescription>
              <CardTitle className="text-2xl text-blue-800 font-bold">{getFilteredTransactions().length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100">
            <CardHeader className="pb-2 -mt-2">
              <CardDescription className="text-muted-foreground">Total Amount (Disbursed)</CardDescription>
              <CardTitle className="text-2xl text-green-500 font-bold">
                {formatCurrency(getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0))}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-gray-500 bg-gray-50 hover:bg-gray-100">
            <CardHeader className="pb-2 -mt-2">
              <CardDescription className="text-muted-foreground">Average Amount</CardDescription>
              <CardTitle className="text-2xl text-gray-500 font-bold">
                {getFilteredTransactions().length > 0
                  ? formatCurrency(getFilteredTransactions().reduce((sum, t) => sum + t.amount, 0) / getFilteredTransactions().length)
                  : formatCurrency(0)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search Student Name, Reference, Institution"
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
              <div className="border-l-4 border-l-yellow-500 h-14 pl-2 rounded-none">
                <CardTitle className="text-xl font-bold text-blue-800 ">Transactions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Total {getFilteredTransactions().length} Transactions | FY : 2024 -2025 | Academic Year : 2024
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="border-t-2">
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => requestSort('transactionDate')}
                      className="flex items-center"
                    >
                      Date
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => requestSort('reference')}
                      className="flex items-center"
                    >
                      Reference
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => requestSort('studentName')}
                      className="flex items-center"
                    >
                      Student
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>
                    <button
                      onClick={() => requestSort('amount')}
                      className="flex items-center"
                    >
                      Amount
                      <ArrowDownUp className="ml-1 h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getPaginatedTransactions().map((transaction) => (
                  <>
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{formatDate(transaction.transactionDate)}</div>
                        <div className="text-xs text-gray-500">Disbursed By : {transaction.processedBy}</div>
                      </TableCell>
                      <TableCell>
                        <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">
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
                        <div className="text-xs text-gray-500">ID : {transaction.institutionId}</div>
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
                        {transaction.status === "failed" && (
                          <div className="text-xs text-red-500 mt-1">
                            {transaction.details.failureReason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleRowExpansion(transaction.id)}
                          >
                            {expandedRows[transaction.id] ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                Generate Receipt
                              </DropdownMenuItem>
                              {transaction.status === "successful" && (
                                <DropdownMenuItem className="text-red-600">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Request Reversal
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows[transaction.id] && (
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <TableCell colSpan={8} className="p-0">
                          <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Transaction Details Card */}
                              <div className="bg-white hover:bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-xs border-l-4 border-l-blue-500">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-gray-500" />
                                  Transaction Details
                                </h3>
                                <div className="space-y-2.5">
                                  <DetailItem label="Application ID" value={transaction.applicationId} />
                                  <DetailItem label="Disbursement ID" value={transaction.disbursementId} />
                                  <DetailItem label="Transaction Type" value={transaction.transactionType} />
                                  <DetailItem label="Processed By" value={transaction.processedBy} />
                                </div>
                              </div>

                              {/* Payment Method Card */}
                              <div className="bg-white hover:bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-xs border-l-4 border-l-green-500">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <Wallet className="h-4 w-4 text-gray-500" />
                                  Payment Method
                                </h3>
                                {renderMethodDetails(transaction)}
                              </div>

                              {/* Actions Card */}
                              <div className="bg-white hover:bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-xs border-l-4 border-l-gray-500">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                  <Info className="h-4 w-4 text-gray-500" />
                                  Additional Information
                                </h3>

                                {transaction.details.notes && (
                                  <div className="bg-blue-50/60 p-3 rounded border border-blue-100 mb-4">
                                    <p className="text-sm text-blue-800">
                                      <span className="font-medium">Notes:</span> {transaction.details.notes}
                                    </p>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <FileText className="h-3.5 w-3.5" />
                                    View Receipt
                                  </Button>
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <Download className="h-3.5 w-3.5" />
                                    Download Proof
                                  </Button>
                                  <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500">
                                    <Share2 className="h-3.5 w-3.5" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
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
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 space-y-4 md:space-y-0">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, getFilteredTransactions().length)} of {getFilteredTransactions().length} entries
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionHistory;