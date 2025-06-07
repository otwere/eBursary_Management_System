
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FundUtilizationSummary, FundCategoryType, EducationLevelType, DisbursementMethodType } from "@/types/funds";
import { BarChart, LineChart, DollarSign, FileText, Download, Printer, ArrowRight, PieChart, Filter, ChevronDown, DownloadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock utilization summary data
const mockUtilizationSummary: FundUtilizationSummary = {
  academicYear: "2025",
  totalBudget: 5000000,
  allocatedAmount: 3500000,
  disbursedAmount: 2500000,
  remainingAmount: 1500000,
  categoryBreakdown: [
    {
      categoryType: "Bursary",
      allocatedAmount: 2100000,
      disbursedAmount: 1500000,
      percentage: 60
    },
    {
      categoryType: "Scholarship",
      allocatedAmount: 1400000,
      disbursedAmount: 1000000,
      percentage: 40
    }
  ],
  educationLevelBreakdown: [
    {
      educationLevel: "University",
      allocatedAmount: 1750000,
      disbursedAmount: 1200000,
      percentage: 50
    },
    {
      educationLevel: "College",
      allocatedAmount: 875000,
      disbursedAmount: 600000,
      percentage: 25
    },
    {
      educationLevel: "TVET",
      allocatedAmount: 525000,
      disbursedAmount: 400000,
      percentage: 15
    },
    {
      educationLevel: "Secondary",
      allocatedAmount: 350000,
      disbursedAmount: 300000,
      percentage: 10
    }
  ],
  institutionTypeBreakdown: [
    {
      institutionType: "Public University",
      allocatedAmount: 1400000,
      disbursedAmount: 1000000,
      count: 120
    },
    {
      institutionType: "Private University",
      allocatedAmount: 350000,
      disbursedAmount: 200000,
      count: 30
    },
    {
      institutionType: "Public College",
      allocatedAmount: 700000,
      disbursedAmount: 500000,
      count: 85
    },
    {
      institutionType: "Private College",
      allocatedAmount: 175000,
      disbursedAmount: 100000,
      count: 20
    },
    {
      institutionType: "TVET Institute",
      allocatedAmount: 525000,
      disbursedAmount: 400000,
      count: 60
    },
    {
      institutionType: "Secondary School",
      allocatedAmount: 350000,
      disbursedAmount: 300000,
      count: 45
    }
  ],

  disbursementMethodBreakdown: [
    {
      method: "BankTransfer",
      amount: 1500000,
      count: 180,
      percentage: 60
    },
    {
      method: "Cheque",
      amount: 500000,
      count: 50,
      percentage: 20
    },
    {
      method: "Mpesa",
      amount: 500000,
      count: 120,
      percentage: 20
    }
  ]
};

// Mock monthly disbursement data
const mockMonthlyDisbursement = [
  { month: "Jan", bursary: 200000, scholarship: 150000 },
  { month: "Feb", bursary: 180000, scholarship: 120000 },
  { month: "Mar", bursary: 250000, scholarship: 180000 },
  { month: "Apr", bursary: 300000, scholarship: 200000 },
  { month: "May", bursary: 220000, scholarship: 150000 },
  { month: "Jun", bursary: 180000, scholarship: 100000 },
  { month: "Jul", bursary: 120000, scholarship: 80000 },
  { month: "Aug", bursary: 50000, scholarship: 20000 },
  { month: "Sep", bursary: 0, scholarship: 0 },
  { month: "Oct", bursary: 0, scholarship: 0 },
  { month: "Nov", bursary: 0, scholarship: 0 },
  { month: "Dec", bursary: 0, scholarship: 0 }
];
// Mock data for Funds Approved Report
const mockFundsApprovedData = {
  academicYear: "2025",
  totalApplications: 1250,
  approvedApplications: 950,
  rejectedApplications: 300,
  approvalRate: 76,
  approvalTimeline: [
    { month: "Jan", applications: 80, approved: 60, rejected: 20 },
    { month: "Feb", applications: 100, approved: 75, rejected: 25 },
    { month: "Mar", applications: 150, approved: 120, rejected: 30 },
    { month: "Apr", applications: 200, approved: 160, rejected: 40 },
    { month: "May", applications: 180, approved: 140, rejected: 40 },
    { month: "Jun", applications: 120, approved: 90, rejected: 30 },
    { month: "Jul", applications: 90, approved: 70, rejected: 20 },
    { month: "Aug", applications: 80, approved: 60, rejected: 20 },
    { month: "Sep", applications: 70, approved: 50, rejected: 20 },
    { month: "Oct", applications: 60, approved: 45, rejected: 15 },
    { month: "Nov", applications: 50, approved: 40, rejected: 10 },
    { month: "Dec", applications: 70, approved: 50, rejected: 20 }
  ],
  approvalByCategory: [
    { category: "Bursary", applications: 750, approved: 600, rejected: 150 },
    { category: "Scholarship", applications: 500, approved: 350, rejected: 150 }
  ],
  approvalByRegion: [
    { region: "X Ward", applications: 300, approved: 250, rejected: 50 },
    { region: "Y Ward", applications: 200, approved: 160, rejected: 40 },
    { region: "Z Ward", applications: 250, approved: 180, rejected: 70 },
    { region: "Ab Ward", applications: 150, approved: 110, rejected: 40 },
    { region: "Bc Ward", applications: 120, approved: 80, rejected: 40 },
    { region: "Cd Ward", applications: 150, approved: 100, rejected: 50 },
    { region: "Dd Ward", applications: 80, approved: 70, rejected: 10 }
  ]
};

// Mock data for Disbursement Summary Report
const mockDisbursementSummary = {
  academicYear: "2025",
  totalDisbursements: 2500000,
  successfulDisbursements: 2300000,
  failedDisbursements: 200000,
  successRate: 92,
  averageProcessingTime: "2.5 days",
  disbursementByMonth: [
    { month: "Jan", amount: 180000, successful: 170000, failed: 10000 },
    { month: "Feb", amount: 200000, successful: 190000, failed: 10000 },
    { month: "Mar", amount: 250000, successful: 230000, failed: 20000 },
    { month: "Apr", amount: 300000, successful: 290000, failed: 10000 },
    { month: "May", amount: 280000, successful: 260000, failed: 20000 },
    { month: "Jun", amount: 220000, successful: 200000, failed: 20000 },
    { month: "Jul", amount: 200000, successful: 190000, failed: 10000 },
    { month: "Aug", amount: 150000, successful: 140000, failed: 10000 },
    { month: "Sep", amount: 120000, successful: 110000, failed: 10000 },
    { month: "Oct", amount: 100000, successful: 95000, failed: 5000 },
    { month: "Nov", amount: 80000, successful: 75000, failed: 5000 },
    { month: "Dec", amount: 120000, successful: 110000, failed: 10000 }
  ],
  disbursementByMethod: [
    { method: "Bank Transfer", amount: 1500000, count: 180, successRate: 95 },
    { method: "MPesa", amount: 800000, count: 350, successRate: 98 },
    { method: "Cheque", amount: 200000, count: 50, successRate: 80 }
  ],
  disbursementByInstitution: [
    { institutionType: "Public University", amount: 1000000, count: 120 },
    { institutionType: "Private University", amount: 200000, count: 30 },
    { institutionType: "Public College", amount: 500000, count: 85 },
    { institutionType: "Private College", amount: 100000, count: 20 },
    { institutionType: "TVET Institute", amount: 400000, count: 60 },
    { institutionType: "Secondary School", amount: 300000, count: 45 }
  ]
};

// Mock data for Allocation Distribution Report
const mockAllocationDistribution = {
  academicYear: "2025",
  totalAllocated: 3500000,
  allocatedByCategory: [
    { category: "Bursary", amount: 2100000, percentage: 60 },
    { category: "Scholarship", amount: 1400000, percentage: 40 }
  ],
  allocatedByRegion: [
    { region: "Nairobi", amount: 700000, percentage: 20 },
    { region: "Central", amount: 525000, percentage: 15 },
    { region: "Rift Valley", amount: 700000, percentage: 20 },
    { region: "Eastern", amount: 350000, percentage: 10 },
    { region: "Western", amount: 315000, percentage: 9 },
    { region: "Nyanza", amount: 420000, percentage: 12 },
    { region: "Coast", amount: 490000, percentage: 14 }
  ],
  allocatedByGender: [
    { gender: "Male", amount: 1400000, percentage: 40 },
    { gender: "Female", amount: 2100000, percentage: 60 }
  ],
  allocatedByDisability: [
    { disabilityStatus: "With Disability", amount: 350000, percentage: 10 },
    { disabilityStatus: "Without Disability", amount: 3150000, percentage: 90 }
  ]
};

// Mock data for Beneficiary Analysis Report
const mockBeneficiaryAnalysis = {
  academicYear: "2025",
  totalBeneficiaries: 950,
  beneficiariesByCategory: [
    { category: "Bursary", count: 600, percentage: 63 },
    { category: "Scholarship", count: 350, percentage: 37 }
  ],
  beneficiariesByEducationLevel: [
    { level: "University", count: 475, percentage: 50 },
    { level: "College", count: 238, percentage: 25 },
    { level: "TVET", count: 143, percentage: 15 },
    { level: "Secondary", count: 94, percentage: 10 }
  ],
  beneficiariesByGender: [
    { gender: "Male", count: 380, percentage: 40 },
    { gender: "Female", count: 570, percentage: 60 }
  ],
  beneficiariesByRegion: [
    { region: "Nairobi", count: 250, percentage: 26 },
    { region: "Central", count: 160, percentage: 17 },
    { region: "Rift Valley", count: 180, percentage: 19 },
    { region: "Eastern", count: 110, percentage: 12 },
    { region: "Western", count: 80, percentage: 8 },
    { region: "Nyanza", count: 100, percentage: 11 },
    { region: "Coast", count: 70, percentage: 7 }
  ],
  beneficiariesByDisability: [
    { disabilityStatus: "With Disability", count: 95, percentage: 10 },
    { disabilityStatus: "Without Disability", count: 855, percentage: 90 }
  ],
  beneficiariesByNeedLevel: [
    { needLevel: "Extreme Need", count: 285, percentage: 30 },
    { needLevel: "High Need", count: 380, percentage: 40 },
    { needLevel: "Medium Need", count: 190, percentage: 20 },
    { needLevel: "Low Need", count: 95, percentage: 10 }
  ]
};

// Mock data for Institution Breakdown Report
const mockInstitutionBreakdown = {
  academicYear: "2025",
  totalInstitutions: 360,
  institutionsByType: [
    { type: "Public University", count: 30, students: 12000, funding: 1400000 },
    { type: "Private University", count: 25, students: 5000, funding: 350000 },
    { type: "Public College", count: 85, students: 17000, funding: 700000 },
    { type: "Private College", count: 50, students: 5000, funding: 175000 },
    { type: "TVET Institute", count: 120, students: 24000, funding: 525000 },
    { type: "Secondary School", count: 50, students: 10000, funding: 350000 }
  ],
  institutionsByRegion: [
    { region: "Nairobi", count: 80, funding: 700000 },
    { region: "Central", count: 60, funding: 525000 },
    { region: "Rift Valley", count: 70, funding: 700000 },
    { region: "Eastern", count: 40, funding: 350000 },
    { region: "Western", count: 35, funding: 315000 },
    { region: "Nyanza", count: 45, funding: 420000 },
    { region: "Coast", count: 30, funding: 490000 }
  ],
  topInstitutionsByFunding: [
    { name: "University of Nairobi", type: "Public University", funding: 350000, students: 1200 },
    { name: "Kenyatta University", type: "Public University", funding: 300000, students: 1000 },
    { name: "Strathmore University", type: "Private University", funding: 150000, students: 400 },
    { name: "Kenya Polytechnic", type: "Public College", funding: 120000, students: 800 },
    { name: "Kabete Technical", type: "TVET Institute", funding: 100000, students: 600 }
  ],
  fundingPerStudentByType: [
    { type: "Public University", fundingPerStudent: 11667 },
    { type: "Private University", fundingPerStudent: 7000 },
    { type: "Public College", fundingPerStudent: 4118 },
    { type: "Private College", fundingPerStudent: 3500 },
    { type: "TVET Institute", fundingPerStudent: 2188 },
    { type: "Secondary School", fundingPerStudent: 3500 }
  ]
};



// Report types
const reportTypes = [
  { id: "fund-utilization", name: "Fund Utilization Report" },
  { id: "fund-approval", name: "Funds Approved Report" },
  { id: "disbursement-summary", name: "Disbursement Summary Report" },
  { id: "allocation-distribution", name: "Allocation Distribution Report" },
  { id: "beneficiary-analysis", name: "Beneficiary Analysis Report" },
  { id: "institution-breakdown", name: "Institution Breakdown Report" }
];

const FinancialReports = () => {
  const [selectedReport, setSelectedReport] = useState("fund-utilization");
  const [selectedPeriod, setSelectedPeriod] = useState("current-year");
  const [activeTab, setActiveTab] = useState("overview");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (percentage: number) => {
    return `${percentage}%`;
  };

  const handleDownloadReport = () => {
    // Mock function to simulate downloading a report
    console.log(`Downloading ${selectedReport} report for ${selectedPeriod}`);
  };

  const handlePrintReport = () => {
    // Mock function to simulate printing a report
    console.log(`Printing ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <DashboardLayout title="Financial Reports - Dashboard">
      <div className="space-y-6 lg:-mx-[70px] mt-[-4rem]">
        {/* Header */}
        <div className="border-l-4 border-l-red-500 pl-2 rounded-sm h-20 border-b-2">
          <h1 className="text-xl font-bold text-blue-800">Financial Reports</h1>
          <p className="text-muted-foreground text-sm -mt-0">
            Generate | Analyze Financial Reports for Funds Approved , Allocation & Disbursement
          </p>
        </div>

        {/* Report Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select
                  value={selectedReport}
                  onValueChange={setSelectedReport}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(report => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-year">Current Year (2024-2025)</SelectItem>
                    <SelectItem value="previous-year">Previous Year (2023-2024)</SelectItem>
                    <SelectItem value="q1-2024">Q1 2024</SelectItem>
                    <SelectItem value="q2-2024">Q2 2024</SelectItem>
                    <SelectItem value="q3-2024">Q3 2024</SelectItem>
                    <SelectItem value="q4-2024">Q4 2024</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2">
                <Button className="flex-1" onClick={handleDownloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handlePrintReport}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            {selectedPeriod === "custom" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Content - Fund Utilization */}
        {selectedReport === "fund-utilization" && (
          <div className="space-y-6">
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-56 sm:space-x-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="category-breakdown">Category Breakdown</TabsTrigger>
                  <TabsTrigger value="education-level">Education Level</TabsTrigger>
                  <TabsTrigger value="disbursement-method">Disbursement Method</TabsTrigger>
                </TabsList>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-red-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Fund Utilization Summary</CardTitle>
                      <CardDescription className="text-muted-foreground">Academic Year : {mockUtilizationSummary.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 -mx-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border-l-4 border-l-gray-500 pl-2 rounded-none">
                            <p className="text-sm text-gray-500">Total Budget</p>
                            <p className="text-xl font-bold">{formatCurrency(mockUtilizationSummary.totalBudget)}</p>
                            <p className="text-xs text-gray-500">FY - (2024 - 2025) | Academic Year : {mockUtilizationSummary.academicYear}</p>
                          </div>
                          <div className="border-l-4 border-l-blue-500 pl-2 rounded-none">
                            <p className="text-sm text-gray-500">Allocated Amount</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(mockUtilizationSummary.allocatedAmount)}</p>
                            <p className="text-xs text-gray-500">
                              {formatPercentage(Math.round((mockUtilizationSummary.allocatedAmount / mockUtilizationSummary.totalBudget) * 100))} of Budget
                            </p>
                          </div>
                          <div className="border-l-4 border-l-green-500 pl-2 rounded-none">
                            <p className="text-sm text-gray-500">Disbursed Amount</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(mockUtilizationSummary.disbursedAmount)}</p>
                            <p className="text-xs text-gray-500">
                              {formatPercentage(Math.round((mockUtilizationSummary.disbursedAmount / mockUtilizationSummary.allocatedAmount) * 100))} of Allocated
                            </p>
                          </div>
                          <div className="border-l-4 border-l-amber-500 pl-2 rounded-none">
                            <p className="text-sm text-gray-500">Remaining Amount</p>
                            <p className="text-xl font-bold text-amber-600">{formatCurrency(mockUtilizationSummary.remainingAmount)}</p>
                            <p className="text-xs text-gray-500">
                              {formatPercentage(Math.round((mockUtilizationSummary.remainingAmount / mockUtilizationSummary.totalBudget) * 100))} of Budget
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Budget Allocation Progress</span>
                              <span>{formatPercentage(Math.round((mockUtilizationSummary.allocatedAmount / mockUtilizationSummary.totalBudget) * 100))}</span>
                            </div>
                            <Progress value={Math.round((mockUtilizationSummary.allocatedAmount / mockUtilizationSummary.totalBudget) * 100)} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Disbursement Progress</span>
                              <span>{formatPercentage(Math.round((mockUtilizationSummary.disbursedAmount / mockUtilizationSummary.allocatedAmount) * 100))}</span>
                            </div>
                            <Progress value={Math.round((mockUtilizationSummary.disbursedAmount / mockUtilizationSummary.allocatedAmount) * 100)} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-gray-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Monthly Disbursement Trend</CardTitle>
                      <CardDescription>Bursary vs Scholarship Disbursements</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                      <div className="text-center space-y-2">
                        <LineChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Monthly disbursement chart would be here</p>
                        <p className="text-sm text-gray-400">Displaying trends over time for fund categories</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2 border-l-8 border-l-red-500">
                    <CardHeader className="pb-2 ">
                      <CardTitle className="text-lg font-bold text-blue-800 -mb-3">Education Level Distribution</CardTitle>
                      <CardDescription className="text-muted-foreground">Allocation by Education Level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {mockUtilizationSummary.educationLevelBreakdown.map((level) => (
                          <div key={level.educationLevel} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-primary-800">{level.educationLevel}</span>
                              <Badge variant="outline" className="bg-blue-500 text-gray-50">{formatPercentage(level.percentage)}</Badge>
                            </div>
                            <Progress value={level.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Allocated : {formatCurrency(level.allocatedAmount)}</span>
                              <span>Disbursed : {formatCurrency(level.disbursedAmount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Category Breakdown Tab */}
              <TabsContent value="category-breakdown" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader className="border-l-4 border-l-purple-500 border-b-2 rounded">
                        <CardTitle className="text-lg font-bold text-blue-800 -mb-3">Fund Categories</CardTitle>
                        <CardDescription className="text-muted-foreground">Bursary vs Scholarship Distribution</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="text-center space-y-2">
                          <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-gray-500 text-lg">Category distribution chart would be here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader className="border-l-4 border-l-purple-500 border-b-2 rounded">
                        <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Category Details</CardTitle>
                        <CardDescription>Detailed breakdown of Fund Categories</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Allocated</TableHead>
                              <TableHead>Disbursed</TableHead>
                              <TableHead>Percentage</TableHead>
                              <TableHead>Utilization</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockUtilizationSummary.categoryBreakdown.map((category) => (
                              <TableRow key={category.categoryType}>
                                <TableCell>
                                  <div className="font-medium">{category.categoryType}</div>
                                </TableCell>
                                <TableCell>{formatCurrency(category.allocatedAmount)}</TableCell>
                                <TableCell>{formatCurrency(category.disbursedAmount)}</TableCell>
                                <TableCell>{formatPercentage(category.percentage)}</TableCell>
                                <TableCell>
                                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${category.categoryType === "Bursary" ? "bg-blue-500" : "bg-green-500"}`}
                                      style={{ width: `${Math.round((category.disbursedAmount / category.allocatedAmount) * 100)}%` }}
                                    ></div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-3">
                    <Card>
                      <CardHeader className="border-l-4 border-l-purple-500 rounded border-b-2 mb-4">
                        <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Monthly Breakdown by Category</CardTitle>
                        <CardDescription className="text-muted-foreground">Monthly Distribution of Disbursements by Category</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[400px] flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <BarChart className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-gray-500 text-lg">Monthly breakdown chart would be here</p>
                          <p className="text-sm text-gray-400">Showing monthly Distribution of Bursary and Scholarship Funds</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Education Level Tab */}
              <TabsContent value="education-level" className="mt-0">
                <Card>
                  <CardHeader className="border-l-4 border-l-purple-500 rounded border-b-2">
                    <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Education Level Distribution</CardTitle>
                    <CardDescription className="text-muted-foreground">Funds Distribution across different Education Levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Education Level</TableHead>
                          <TableHead>Allocated Amount</TableHead>
                          <TableHead>Disbursed Amount</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockUtilizationSummary.educationLevelBreakdown.map((level) => (
                          <TableRow key={level.educationLevel}>
                            <TableCell>
                              <div className="font-medium">{level.educationLevel}</div>
                            </TableCell>
                            <TableCell>{formatCurrency(level.allocatedAmount)}</TableCell>
                            <TableCell>{formatCurrency(level.disbursedAmount)}</TableCell>
                            <TableCell>{formatPercentage(level.percentage)}</TableCell>
                            <TableCell>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-500 rounded-full"
                                  style={{ width: `${Math.round((level.disbursedAmount / level.allocatedAmount) * 100)}%` }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-6">
                  <Card>
                    <CardHeader className="border-l-4 border-l-purple-500 rounded border-b-2">
                      <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Institution Type Distribution</CardTitle>
                      <CardDescription className="text-muted-foreground">Fund Distribution by Institution type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Institution Type</TableHead>
                            <TableHead>Allocated</TableHead>
                            <TableHead>Disbursed</TableHead>
                            <TableHead className="text-right">Beneficiaries</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockUtilizationSummary.institutionTypeBreakdown.map((inst) => (
                            <TableRow key={inst.institutionType}>
                              <TableCell>
                                <div className="font-medium">{inst.institutionType}</div>
                              </TableCell>
                              <TableCell>{formatCurrency(inst.allocatedAmount)}</TableCell>
                              <TableCell>{formatCurrency(inst.disbursedAmount)}</TableCell>
                              <TableCell className="text-right">{inst.count}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="border-l-4 border-l-purple-500 border-b-2 rounded">
                      <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Institution Distribution</CardTitle>
                      <CardDescription className="text-muted-foreground">Visual Representation of Institution Distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Institution distribution chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Disbursement Method Tab */}
              <TabsContent value="disbursement-method" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-1">
                    <Card>
                      <CardHeader className="border-l-4 border-l-lime-500 border-b-2 rounded">
                        <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Disbursement Methods</CardTitle>
                        <CardDescription className="text-muted-foreground">Distribution by Payment Method Chart</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                          <p className="text-gray-500 text-lg">Method distribution chart would be here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader className="border-l-4 border-l-lime-500 border-b-2 rounded">
                        <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Payment Method Details</CardTitle>
                        <CardDescription className="text-muted-foreground">Detailed Breakdown of Disbursement Methods</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Method</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead className="text-right">Transactions</TableHead>
                              <TableHead className="text-right">Percentage</TableHead>
                              <TableHead className="text-right">Distribution</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockUtilizationSummary.disbursementMethodBreakdown.map((method) => (
                              <TableRow key={method.method}>
                                <TableCell>
                                  <div className="font-medium">{method.method}</div>
                                </TableCell>
                                <TableCell>{formatCurrency(method.amount)}</TableCell>
                                <TableCell className="text-right">{method.count}</TableCell>
                                <TableCell className="text-right">{formatPercentage(method.percentage)}</TableCell>
                                <TableCell>
                                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${method.method === "BankTransfer"
                                          ? "bg-blue-500"
                                          : method.method === "Cheque"
                                            ? "bg-purple-500"
                                            : "bg-green-500"
                                        }`}
                                      style={{ width: `${method.percentage}%` }}
                                    ></div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Additional report types would be added here */}
        {/* Funds Approved Report */}
        {selectedReport === "fund-approval" && (
          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-[17.5rem] sm:space-x-0 md:space-x-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Approval Timeline</TabsTrigger>
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                  <TabsTrigger value="regions">By Ward</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Approval Summary</CardTitle>
                      <CardDescription>Academic Year: {mockFundsApprovedData.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-l-4 border-l-blue-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Total Applications</p>
                          <p className="text-xl font-bold">{mockFundsApprovedData.totalApplications}</p>
                        </div>
                        <div className="border-l-4 border-l-green-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Approved Applications</p>
                          <p className="text-xl font-bold text-green-600">{mockFundsApprovedData.approvedApplications}</p>
                          <p className="text-xs text-gray-500">
                            {mockFundsApprovedData.approvalRate}% Approval Rate
                          </p>
                        </div>
                        <div className="border-l-4 border-l-red-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Rejected Applications</p>
                          <p className="text-xl font-bold text-red-600">{mockFundsApprovedData.rejectedApplications}</p>
                        </div>
                        <div className="border-l-4 border-l-amber-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Pending Applications</p>
                          <p className="text-xl font-bold text-amber-600">85</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Approval Rate</span>
                            <span>{mockFundsApprovedData.approvalRate}%</span>
                          </div>
                          <Progress value={mockFundsApprovedData.approvalRate} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Rejection Rate</span>
                            <span>{100 - mockFundsApprovedData.approvalRate}%</span>
                          </div>
                          <Progress value={100 - mockFundsApprovedData.approvalRate} className="h-2 bg-red-100" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Monthly Approval Trend</CardTitle>
                      <CardDescription>Applications vs Approvals</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                      <div className="text-center space-y-2">
                        <LineChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Monthly approval chart would be here</p>
                        <p className="text-sm text-gray-400">Showing trends in applications and approvals over time</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Approval by Category</CardTitle>
                      <CardDescription>Breakdown of applications and approvals by fund category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Applications</TableHead>
                            <TableHead>Approved</TableHead>
                            <TableHead>Rejected</TableHead>
                            <TableHead>Approval Rate</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockFundsApprovedData.approvalByCategory.map((category) => (
                            <TableRow key={category.category}>
                              <TableCell className="font-medium">{category.category}</TableCell>
                              <TableCell>{category.applications}</TableCell>
                              <TableCell>{category.approved}</TableCell>
                              <TableCell>{category.rejected}</TableCell>
                              <TableCell>{Math.round((category.approved / category.applications) * 100)}%</TableCell>
                              <TableCell>
                                <Progress
                                  value={Math.round((category.approved / category.applications) * 100)}
                                  className="h-2"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Approval Timeline</CardTitle>
                    <CardDescription>Monthly Breakdown of Applications and Approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Total Applications</TableHead>
                          <TableHead>Total Approved</TableHead>
                          <TableHead>Rejected</TableHead>
                          <TableHead>Approval Rate</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockFundsApprovedData.approvalTimeline.map((month) => (
                          <TableRow key={month.month}>
                            <TableCell className="font-medium">{month.month}</TableCell>
                            <TableCell>{month.applications}</TableCell>
                            <TableCell>{month.approved}</TableCell>
                            <TableCell>{month.rejected}</TableCell>
                            <TableCell>{Math.round((month.approved / month.applications) * 100)}%</TableCell>
                            <TableCell>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${Math.round((month.approved / month.applications) * 100)}%` }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Approval by Category</CardTitle>
                      <CardDescription>Visual representation of Approval rates by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Category approval chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Monthly Category Approval</CardTitle>
                      <CardDescription>Approval trends by category over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <BarChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Monthly category approval chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Regions Tab */}
              <TabsContent value="regions" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Approval by Ward</CardTitle>
                    <CardDescription>Geographical Distribution of Applications and Approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Wards</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Approved</TableHead>
                          <TableHead>Rejected</TableHead>
                          <TableHead>Approval Rate</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockFundsApprovedData.approvalByRegion.map((region) => (
                          <TableRow key={region.region}>
                            <TableCell className="font-medium">{region.region}</TableCell>
                            <TableCell>{region.applications}</TableCell>
                            <TableCell>{region.approved}</TableCell>
                            <TableCell>{region.rejected}</TableCell>
                            <TableCell>{Math.round((region.approved / region.applications) * 100)}%</TableCell>
                            <TableCell>
                              <Progress
                                value={Math.round((region.approved / region.applications) * 100)}
                                className="h-2"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Disbursement Summary Report */}
        {selectedReport === "disbursement-summary" && (
          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-[16rem] sm:space-x-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="timeline">Disbursement Timeline</TabsTrigger>
                  <TabsTrigger value="methods">By Method</TabsTrigger>
                  <TabsTrigger value="institutions">By Institution</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Disbursement Summary</CardTitle>
                      <CardDescription>Academic Year: {mockDisbursementSummary.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-l-4 border-l-blue-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Total Disbursements</p>
                          <p className="text-xl font-bold">{formatCurrency(mockDisbursementSummary.totalDisbursements)}</p>
                        </div>
                        <div className="border-l-4 border-l-green-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Successful</p>
                          <p className="text-xl font-bold text-green-600">{formatCurrency(mockDisbursementSummary.successfulDisbursements)}</p>
                          <p className="text-xs text-gray-500">
                            {mockDisbursementSummary.successRate}% Success Rate
                          </p>
                        </div>
                        <div className="border-l-4 border-l-red-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Failed</p>
                          <p className="text-xl font-bold text-red-600">{formatCurrency(mockDisbursementSummary.failedDisbursements)}</p>
                        </div>
                        <div className="border-l-4 border-l-amber-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Avg Processing Time</p>
                          <p className="text-xl font-bold text-amber-600">{mockDisbursementSummary.averageProcessingTime}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Success Rate</span>
                            <span>{mockDisbursementSummary.successRate}%</span>
                          </div>
                          <Progress value={mockDisbursementSummary.successRate} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Failure Rate</span>
                            <span>{100 - mockDisbursementSummary.successRate}%</span>
                          </div>
                          <Progress value={100 - mockDisbursementSummary.successRate} className="h-2 bg-red-100" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Monthly Disbursement Trend</CardTitle>
                      <CardDescription>Successful vs Failed disbursements</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                      <div className="text-center space-y-2">
                        <LineChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Monthly disbursement chart would be here</p>
                        <p className="text-sm text-gray-400">Showing trends in successful and failed disbursements</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Disbursement by Institution Type</CardTitle>
                      <CardDescription>Breakdown of disbursements by institution category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Institution Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Beneficiaries</TableHead>
                            <TableHead>Average per Beneficiary</TableHead>
                            <TableHead>Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockDisbursementSummary.disbursementByInstitution.map((inst) => (
                            <TableRow key={inst.institutionType}>
                              <TableCell className="font-medium">{inst.institutionType}</TableCell>
                              <TableCell>{formatCurrency(inst.amount)}</TableCell>
                              <TableCell>{inst.count}</TableCell>
                              <TableCell>{formatCurrency(inst.amount / inst.count)}</TableCell>
                              <TableCell>{Math.round((inst.amount / mockDisbursementSummary.totalDisbursements) * 100)}%</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Disbursement Timeline</CardTitle>
                    <CardDescription>Monthly breakdown of disbursements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Successful</TableHead>
                          <TableHead>Failed</TableHead>
                          <TableHead>Success Rate</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockDisbursementSummary.disbursementByMonth.map((month) => (
                          <TableRow key={month.month}>
                            <TableCell className="font-medium">{month.month}</TableCell>
                            <TableCell>{formatCurrency(month.amount)}</TableCell>
                            <TableCell>{formatCurrency(month.successful)}</TableCell>
                            <TableCell>{formatCurrency(month.failed)}</TableCell>
                            <TableCell>{Math.round((month.successful / month.amount) * 100)}%</TableCell>
                            <TableCell>
                              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${Math.round((month.successful / month.amount) * 100)}%` }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Methods Tab */}
              <TabsContent value="methods" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Disbursement by Method</CardTitle>
                      <CardDescription>Visual Representation of Disbursement Methods</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Disbursement ethod chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Method Details</CardTitle>
                      <CardDescription>Detailed Breakdown by Disbursement Method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Transactions</TableHead>
                            <TableHead>Success Rate</TableHead>
                            <TableHead>Average Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockDisbursementSummary.disbursementByMethod.map((method) => (
                            <TableRow key={method.method}>
                              <TableCell className="font-medium">{method.method}</TableCell>
                              <TableCell>{formatCurrency(method.amount)}</TableCell>
                              <TableCell>{method.count}</TableCell>
                              <TableCell>{method.successRate}%</TableCell>
                              <TableCell>{formatCurrency(method.amount / method.count)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Institutions Tab */}
              <TabsContent value="institutions" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Top Institutions by Disbursement</CardTitle>
                    <CardDescription>Institutions Receiving the Highest Disbursements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institution</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Total Amount</TableHead>
                          <TableHead>No. of Beneficiaries</TableHead>
                          <TableHead>Average</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockInstitutionBreakdown.topInstitutionsByFunding.slice(0, 10).map((inst) => (
                          <TableRow key={inst.name}>
                            <TableCell className="font-medium">{inst.name}</TableCell>
                            <TableCell>{inst.type}</TableCell>
                            <TableCell>{formatCurrency(inst.funding)}</TableCell>
                            <TableCell>{inst.students}</TableCell>
                            <TableCell>{formatCurrency(inst.funding / inst.students)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Allocation Distribution Report */}
        {selectedReport === "allocation-distribution" && (
          <div className="space-y-6">
            <Tabs defaultValue="categories">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-[16.5rem] sm:space-x-0">
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                  <TabsTrigger value="regions">By Region</TabsTrigger>
                  <TabsTrigger value="demographics">By Demographics</TabsTrigger>
                  <TabsTrigger value="institutions">By Institution</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation Summary</CardTitle>
                      <CardDescription>Academic Year: {mockAllocationDistribution.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="border-l-4 border-l-blue-500 pl-2 rounded-none mb-4">
                        <p className="text-sm text-gray-500">Total Allocated</p>
                        <p className="text-xl font-bold">{formatCurrency(mockAllocationDistribution.totalAllocated)}</p>
                      </div>

                      <div className="space-y-4">
                        {mockAllocationDistribution.allocatedByCategory.map((category) => (
                          <div key={category.category} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{category.category}</span>
                              <span>{formatPercentage(category.percentage)}</span>
                            </div>
                            <Progress value={category.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Amount: {formatCurrency(category.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation by Category</CardTitle>
                      <CardDescription>Visual representation of fund distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Category allocation chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Regions Tab */}
              <TabsContent value="regions" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation by Region</CardTitle>
                      <CardDescription>Geographical distribution of allocated funds</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAllocationDistribution.allocatedByRegion.map((region) => (
                            <TableRow key={region.region}>
                              <TableCell className="font-medium">{region.region}</TableCell>
                              <TableCell>{formatCurrency(region.amount)}</TableCell>
                              <TableCell>{formatPercentage(region.percentage)}</TableCell>
                              <TableCell>
                                <Progress value={region.percentage} className="h-2" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Regional Allocation Map</CardTitle>
                      <CardDescription>Visual representation of regional distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Regional allocation map would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Demographics Tab */}
              <TabsContent value="demographics" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation by Gender</CardTitle>
                      <CardDescription>Distribution of funds by gender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAllocationDistribution.allocatedByGender.map((gender) => (
                          <div key={gender.gender} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{gender.gender}</span>
                              <span>{formatPercentage(gender.percentage)}</span>
                            </div>
                            <Progress value={gender.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Amount: {formatCurrency(gender.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation by Disability</CardTitle>
                      <CardDescription>Distribution of funds by disability status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAllocationDistribution.allocatedByDisability.map((disability) => (
                          <div key={disability.disabilityStatus} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{disability.disabilityStatus}</span>
                              <span>{formatPercentage(disability.percentage)}</span>
                            </div>
                            <Progress value={disability.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Amount: {formatCurrency(disability.amount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Institutions Tab */}
              <TabsContent value="institutions" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Allocation by Institution Type</CardTitle>
                    <CardDescription>Breakdown of funds by institution category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institution Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Funding per Student</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockInstitutionBreakdown.institutionsByType.map((inst) => (
                          <TableRow key={inst.type}>
                            <TableCell className="font-medium">{inst.type}</TableCell>
                            <TableCell>{formatCurrency(inst.funding)}</TableCell>
                            <TableCell>{Math.round((inst.funding / mockAllocationDistribution.totalAllocated) * 100)}%</TableCell>
                            <TableCell>{formatCurrency(inst.funding / inst.students)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Beneficiary Analysis Report */}
        {selectedReport === "beneficiary-analysis" && (
          <div className="space-y-6">
            <Tabs defaultValue="overview">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-[17.5rem] sm:space-x-0">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                  <TabsTrigger value="demographics">Demographics</TabsTrigger>
                  <TabsTrigger value="regions">By Region</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Beneficiary Summary</CardTitle>
                      <CardDescription>Academic Year: {mockBeneficiaryAnalysis.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-l-4 border-l-blue-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Total Beneficiaries</p>
                          <p className="text-xl font-bold">{mockBeneficiaryAnalysis.totalBeneficiaries}</p>
                        </div>
                        <div className="border-l-4 border-l-purple-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Bursary Recipients</p>
                          <p className="text-xl font-bold text-purple-600">
                            {mockBeneficiaryAnalysis.beneficiariesByCategory.find(b => b.category === "Bursary")?.count}
                          </p>
                        </div>
                        <div className="border-l-4 border-l-green-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Scholarship Recipients</p>
                          <p className="text-xl font-bold text-green-600">
                            {mockBeneficiaryAnalysis.beneficiariesByCategory.find(b => b.category === "Scholarship")?.count}
                          </p>
                        </div>
                        <div className="border-l-4 border-l-amber-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">With Disabilities</p>
                          <p className="text-xl font-bold text-amber-600">
                            {mockBeneficiaryAnalysis.beneficiariesByDisability.find(b => b.disabilityStatus === "With Disability")?.count}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Gender Distribution</span>
                            <span>Female: {mockBeneficiaryAnalysis.beneficiariesByGender.find(b => b.gender === "Female")?.percentage}%</span>
                          </div>
                          <Progress
                            value={mockBeneficiaryAnalysis.beneficiariesByGender.find(b => b.gender === "Female")?.percentage}
                            className="h-2"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Disability Inclusion</span>
                            <span>{mockBeneficiaryAnalysis.beneficiariesByDisability.find(b => b.disabilityStatus === "With Disability")?.percentage}%</span>
                          </div>
                          <Progress
                            value={mockBeneficiaryAnalysis.beneficiariesByDisability.find(b => b.disabilityStatus === "With Disability")?.percentage}
                            className="h-2 bg-purple-100"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Beneficiary Distribution</CardTitle>
                      <CardDescription>Visual representation of beneficiary demographics</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Beneficiary distribution chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Beneficiaries by Education Level</CardTitle>
                      <CardDescription>Breakdown of beneficiaries by their education level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Education Level</TableHead>
                            <TableHead>Beneficiaries</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockBeneficiaryAnalysis.beneficiariesByEducationLevel.map((level) => (
                            <TableRow key={level.level}>
                              <TableCell className="font-medium">{level.level}</TableCell>
                              <TableCell>{level.count}</TableCell>
                              <TableCell>{formatPercentage(level.percentage)}</TableCell>
                              <TableCell>
                                <Progress value={level.percentage} className="h-2" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Beneficiaries by Category</CardTitle>
                      <CardDescription>Breakdown by Fund Category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Total No. of Beneficiaries</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockBeneficiaryAnalysis.beneficiariesByCategory.map((category) => (
                            <TableRow key={category.category}>
                              <TableCell className="font-medium">{category.category}</TableCell>
                              <TableCell>{category.count}</TableCell>
                              <TableCell>{formatPercentage(category.percentage)}</TableCell>
                              <TableCell>
                                <Progress value={category.percentage} className="h-2" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Category Distribution</CardTitle>
                      <CardDescription>Visual Representation by Category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Category distribution chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Demographics Tab */}
              <TabsContent value="demographics" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Gender Distribution</CardTitle>
                      <CardDescription>Breakdown of Beneficiaries by Gender</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockBeneficiaryAnalysis.beneficiariesByGender.map((gender) => (
                          <div key={gender.gender} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{gender.gender}</span>
                              <span>{formatPercentage(gender.percentage)}</span>
                            </div>
                            <Progress value={gender.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500 cursor-pointer">
                              <span>Beneficiary (Students) : {gender.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Disability Distribution</CardTitle>
                      <CardDescription>Breakdown of Beneficiaries by Disability Status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockBeneficiaryAnalysis.beneficiariesByDisability.map((disability) => (
                          <div key={disability.disabilityStatus} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{disability.disabilityStatus}</span>
                              <span>{formatPercentage(disability.percentage)}</span>
                            </div>
                            <Progress value={disability.percentage} className="h-2" />
                            <div className="flex justify-between text-sm text-gray-500 cursor-pointer">
                              <span>Beneficiary (Students) : {disability.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2 border-l-4 border-l-amber-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Need Level Distribution</CardTitle>
                      <CardDescription>Breakdown of Beneficiaries by Assessed Need Level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Need Level</TableHead>
                            <TableHead>Total No. of Beneficiaries</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Progress</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockBeneficiaryAnalysis.beneficiariesByNeedLevel.map((need) => (
                            <TableRow key={need.needLevel}>
                              <TableCell className="font-medium">{need.needLevel}</TableCell>
                              <TableCell>{need.count}</TableCell>
                              <TableCell>{formatPercentage(need.percentage)}</TableCell>
                              <TableCell>
                                <Progress value={need.percentage} className="h-2" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Regions Tab */}
              <TabsContent value="regions" className="mt-0">
                <Card>
                  <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                    <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Beneficiaries by Region</CardTitle>
                    <CardDescription>Geographical Distribution of Beneficiaries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Region | Ward</TableHead>
                          <TableHead>Total No. of  Beneficiaries</TableHead>
                          <TableHead>Percentage</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockBeneficiaryAnalysis.beneficiariesByRegion.map((region) => (
                          <TableRow key={region.region}>
                            <TableCell className="font-medium">{region.region}</TableCell>
                            <TableCell>{region.count}</TableCell>
                            <TableCell>{formatPercentage(region.percentage)}</TableCell>
                            <TableCell>
                              <Progress value={region.percentage} className="h-2" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Institution Breakdown Report */}
        {selectedReport === "institution-breakdown" && (
          <div className="space-y-6">
            <Tabs defaultValue="types">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="lg:space-x-56 sm:space-x-0">
                  <TabsTrigger value="types">By Institution Type</TabsTrigger>
                  <TabsTrigger value="regions">By Region | Ward</TabsTrigger>
                  <TabsTrigger value="funding">Funding Analysis</TabsTrigger>
                  <TabsTrigger value="top">Top Institutions</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <DownloadCloud className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              {/* Types Tab */}
              <TabsContent value="types" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 border-b-2 mb-4 rounded-none">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Institution Summary</CardTitle>
                      <CardDescription>Academic Year : {mockInstitutionBreakdown.academicYear} | FY : {mockInstitutionBreakdown.academicYear}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="border-l-4 border-l-blue-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Total Institutions</p>
                          <p className="text-xl font-bold">{mockInstitutionBreakdown.totalInstitutions}</p>
                        </div>
                        <div className="border-l-4 border-l-purple-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Public Institutions</p>
                          <p className="text-xl font-bold text-purple-600">
                            {mockInstitutionBreakdown.institutionsByType
                              .filter(inst => inst.type.includes("Public"))
                              .reduce((sum, inst) => sum + inst.count, 0)}
                          </p>
                        </div>
                        <div className="border-l-4 border-l-green-500 pl-2 rounded-none">
                          <p className="text-sm text-gray-500">Private Institutions</p>
                          <p className="text-xl font-bold text-green-600">
                            {mockInstitutionBreakdown.institutionsByType
                              .filter(inst => inst.type.includes("Private"))
                              .reduce((sum, inst) => sum + inst.count, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Institutions by Type</CardTitle>
                      <CardDescription>Breakdown of Participating Institutions by Category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Institution Type</TableHead>
                            <TableHead>No. of Institutions</TableHead>
                            <TableHead>No. of Students</TableHead>
                            <TableHead> Total Funding</TableHead>
                            <TableHead className="text-right"> Avg. Funding per Student</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockInstitutionBreakdown.institutionsByType.map((inst) => (
                            <TableRow key={inst.type}>
                              <TableCell className="font-medium">{inst.type}</TableCell>
                              <TableCell>{inst.count}</TableCell>
                              <TableCell>{inst.students}</TableCell>
                              <TableCell>{formatCurrency(inst.funding)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(inst.funding / inst.students)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Regions Tab */}
              <TabsContent value="regions" className="mt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Institutions by Region | County</CardTitle>
                      <CardDescription>Geographical Distribution of Participating Institutions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Region | County</TableHead>
                            <TableHead>No. of Institutions</TableHead>
                            <TableHead>Total Funding</TableHead>
                            <TableHead className="text-right">Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockInstitutionBreakdown.institutionsByRegion.map((region) => (
                            <TableRow key={region.region}>
                              <TableCell className="font-medium">{region.region}</TableCell>
                              <TableCell>{region.count}</TableCell>
                              <TableCell>{formatCurrency(region.funding)}</TableCell>
                              <TableCell className="text-right">
                                {Math.round((region.count / mockInstitutionBreakdown.totalInstitutions) * 100)}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-purple-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Regional Distribution</CardTitle>
                      <CardDescription>Visual representation by region</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                        <p className="text-gray-500 text-lg">Regional distribution chart would be here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Funding Tab */}
              <TabsContent value="funding" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-green-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Funding Analysis</CardTitle>
                      <CardDescription>Funding Distribution across Institution Types</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Institution Type</TableHead>
                            <TableHead>Total Funding</TableHead>
                            <TableHead>No. of Institutions</TableHead>
                            <TableHead>No. of Students</TableHead>
                            <TableHead>Funding per Institution</TableHead>
                            <TableHead className="text-right">Avg. Funding per Student</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockInstitutionBreakdown.institutionsByType.map((inst) => (
                            <TableRow key={inst.type}>
                              <TableCell className="font-medium">{inst.type}</TableCell>
                              <TableCell>{formatCurrency(inst.funding)}</TableCell>
                              <TableCell>{inst.count}</TableCell>
                              <TableCell>{inst.students}</TableCell>
                              <TableCell>{formatCurrency(inst.funding / inst.count)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(inst.funding / inst.students)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Top Institutions Tab */}
              <TabsContent value="top" className="mt-0">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-2 border-l-4 border-l-blue-500 rounded-none border-b-2">
                      <CardTitle className="text-lg text-blue-800 font-bold -mb-2">Top Institutions by Funding</CardTitle>
                      <CardDescription>Institutions receiving the highest Funding Amounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Institution</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Total Funding</TableHead>
                            <TableHead>No. of Students</TableHead>
                            <TableHead className="text-right">Avg. Funding per Student</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockInstitutionBreakdown.topInstitutionsByFunding.map((inst) => (
                            <TableRow key={inst.name}>
                              <TableCell className="font-medium">{inst.name}</TableCell>
                              <TableCell>{inst.type}</TableCell>
                              <TableCell>{formatCurrency(inst.funding)}</TableCell>
                              <TableCell>{inst.students}</TableCell>
                              <TableCell className="text-right">{formatCurrency(inst.funding / inst.students)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        {/* {selectedReport !== "fund-utilization" && (
          <Card>
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="text-lg font-medium">Report Under Development</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  This report type is currently being developed. Please check back later or select "Fund Utilization Report" to view available reports.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedReport("fund-utilization")}
                >
                  Switch to Fund Utilization Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )} */}
      </div>
    </DashboardLayout>
  );
};

export default FinancialReports;
