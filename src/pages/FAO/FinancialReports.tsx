
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
    <DashboardLayout title="Financial Reports">
      <div className="space-y-6 lg:-mx-[70px]">
        {/* Header */}
        <div className="border-l-4 border-l-red-500 pl-2 rounded-sm bg-blue-50 h-20">
          <h1 className="text-xl font-bold text-blue-800">Financial Reports</h1>
          <p className="text-muted-foreground text-sm -mt-0">
            Generate and Analyze Financial Reports for Funds Approval & Allocation and Disbursement
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
                                      className={`h-full rounded-full ${
                                        method.method === "BankTransfer" 
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
        {selectedReport !== "fund-utilization" && (
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinancialReports;
