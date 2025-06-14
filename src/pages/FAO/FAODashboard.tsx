
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getApplicationsByStatus } from "@/data/mockData";
import StatCard from "@/components/common/StatCard";
import ApplicationCard from "@/components/common/ApplicationCard";
import { FundCategoryType, FundFloat, FundStatusType } from "@/types/funds";
import { 
  AlertCircle, Archive, ArrowDown, ArrowUp, Banknote, BarChart3, 
  Building, Calendar, CheckCircle, Clock, FileCheck, FileText, 
  LineChart, Loader2, PieChart, Plus, School, Users 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAODashboard = () => {
  const navigate = useNavigate();
  
  // Get applications eligible for allocation (already approved by ARO)
  const pendingAllocationApplications = getApplicationsByStatus("pending-allocation");
  const allocatedApplications = getApplicationsByStatus("allocated");
  const disbursedApplications = getApplicationsByStatus("disbursed");
  
  // Mock active funds data
  const activeFunds: FundFloat[] = [
    {
      id: "fund-1",
      name: "2024 Bursary Fund",
      description: "Annual bursary allocation for 2024",
      amount: 5000000,
      academicYear: "2024",
      createdAt: "2024-01-05T09:00:00.000Z",
      createdBy: "Michael Johnson",
      status: "active",
      allocatedAmount: 2500000,
      disbursedAmount: 2000000,
      remainingAmount: 2500000,
      financialPeriod: "2024"
    },
    {
      id: "fund-2",
      name: "2024 Scholarship Fund",
      description: "Annual scholarship allocation for 2024",
      amount: 3000000,
      academicYear: "2024",
      createdAt: "2024-01-10T10:30:00.000Z",
      createdBy: "Otwere Evans",
      status: "active",
      allocatedAmount: 1500000,
      disbursedAmount: 1000000,
      remainingAmount: 1500000,
      financialPeriod: "2024"
    }
  ];
  
  // Mock institution data
  const topInstitutions = [
    { name: "University of Nairobi", count: 45, allocatedAmount: 1500000 },
    { name: "Kenyatta University", count: 38, allocatedAmount: 1200000 },
    { name: "Moi University", count: 33, allocatedAmount: 900000 },
    { name: "Strathmore University", count: 27, allocatedAmount: 800000 },
    { name: "JKUAT", count: 22, allocatedAmount: 700000 }
  ];
  
  // Mock recent allocations
  const recentAllocations = [
    { 
      id: "alloc1", 
      studentName: "James Mwangi", 
      institution: "University of Nairobi", 
      amount: 50000, 
      date: "2024-04-10T09:15:00.000Z", 
      educationLevel: "University" 
    },
    { 
      id: "alloc2", 
      studentName: "Faith Wanjiku", 
      institution: "Kenyatta University", 
      amount: 45000, 
      date: "2024-04-10T11:30:00.000Z", 
      educationLevel: "University" 
    },
    { 
      id: "alloc3", 
      studentName: "David Ochieng", 
      institution: "Technical University of Kenya", 
      amount: 30000, 
      date: "2024-04-09T14:45:00.000Z", 
      educationLevel: "TVET" 
    },
  ];
  
  // Calculate total funds
  const totalBudget = 8000000; // Sum of active funds
  const totalAllocatedFunds = 4000000; // Sum of allocated amounts
  const totalDisbursedFunds = 3000000; // Sum of disbursed amounts
  const remainingBudget = 4000000; // Sum of remaining amounts
  const percentageAllocated = (totalAllocatedFunds / totalBudget) * 100;
  
  // Calculate allocation statistics by education level
  const educationLevelStats = {
    university: { allocated: 2500000, applications: 85 },
    college: { allocated: 800000, applications: 42 },
    tvet: { allocated: 500000, applications: 35 },
    secondary: { allocated: 200000, applications: 28 }
  };
  
  // Calculate total applications
  const totalApplications = 
    pendingAllocationApplications.length + 
    allocatedApplications.length + 
    disbursedApplications.length;
  
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
      day: 'numeric'
    });
  };
  
  // Get status badge styling
  const getStatusBadgeStyles = (status: FundStatusType) => {
    switch(status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "depleted":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };
  
  // Get fund color by category
  const getFundCategoryColor = (category: FundCategoryType) => {
    return category === "Bursary" 
      ? "bg-blue-100 text-blue-800 border-blue-200" 
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  return (
    <DashboardLayout title="Funds Manager - Dashboard">
      <div className="space-y-6 lg:-mx-[80px] mt-[-4rem]">
        {/* Overview section */}
        <div className="flex justify-between items-center border-l-4  border-l-green-500 rounded-none h-20 border-b-2">
          <div className="pl-2 mb-5">
            <h1 className="text-xl font-bold text-blue-800">Funds Manager Allocation Dashboard</h1>
            <p className="text-muted-foreground text-sm -mt-1">
              Manage Funds Approves & Allocate  Bursary & Scholarship Applications
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/FAO/closed-funds")}>
              <Archive className="h-4 w-4 mr-2" />
              Closed Funds
            </Button>
            <Button onClick={() => navigate("/FAO/fund-management")}>
              <Plus className="h-4 w-4 mr-2" />
              Load New Funds (Float)
            </Button>
          </div>
        </div>

        {/* Budget overview */}
        <Card>
          <CardHeader className="border-l-4 border-l-blue-500 mb-4 border-b-2 rounded-none">
            <CardTitle className="text-xl -my-2 text-blue-800 font-bold">Budget Overview</CardTitle>
            <CardDescription className="text-muted-foreground">Current Financial Period Funding Status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500 rounded p-4 border border-blue-100 h-28">
                <p className="text-sm font-medium text-blue-700">Total Budget</p>
                <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
                <div className="mt-1 text-xs text-blue-600">
                  Academic Year 2024
                </div>
              </div>
              <div className="bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500 rounded p-4 border border-green-100">
                <p className="text-sm font-medium text-green-700">Allocated Funds</p>
                <p className="text-xl font-bold">{formatCurrency(totalAllocatedFunds)}</p>
                <div className="mt-1 text-xs text-green-600">
                  {pendingAllocationApplications.length > 0 && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {pendingAllocationApplications.length} Pending Applications
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-amber-50 hover:bg-amber-100 border-l-4 border-l-amber-500 rounded p-4 border border-amber-100">
                <p className="text-sm font-medium text-amber-700">Disbursed Funds</p>
                <p className="text-xl font-bold">{formatCurrency(totalDisbursedFunds)}</p>
                <div className="mt-1 text-xs text-amber-600">
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {disbursedApplications.length} Applications Funded
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 hover:bg-purple-100 border-l-4 border-l-purple-500 rounded p-4 border border-purple-100">
                <p className="text-sm font-medium text-purple-700">Remaining Budget</p>
                <p className="text-xl font-bold">{formatCurrency(remainingBudget)}</p>
                <div className="mt-1 text-xs text-purple-600 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Current Financial Year  (2024 - 2025)</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p>Budget Utilization</p>
                <p>{percentageAllocated.toFixed(1)}%</p>
              </div>
              <Progress value={percentageAllocated} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Pending Allocations" 
            value={pendingAllocationApplications.length}
            icon={<FileCheck className="h-6 w-6" />}
            description="Applications awaiting Fund Allocation"
            trend={pendingAllocationApplications.length > 5 ? { value: pendingAllocationApplications.length - 5, isPositive: false } : undefined}
            className="bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500"
          />
          <StatCard 
            title="Allocated" 
            value={allocatedApplications.length}
            icon={<Banknote className="h-6 w-6" />}
            description="Applications with Funds Allocated"
            trend={{ value: 15, isPositive: true }}
            className="bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500"
          />
          <StatCard 
            title="Average Allocation" 
            value={formatCurrency(totalAllocatedFunds / (allocatedApplications.length + disbursedApplications.length) || 0)}
            icon={<LineChart className="h-6 w-6" />}
            description="Average Funds per Application"
            className="bg-gray-50 hover:bg-gray-100 border-l-4 border-l-gray-500"
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Funds Section */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="border-l-4 border-l-green-500 rounded-none pl-2">
                <CardTitle className="text-lg font-bold text-blue-800">Active Funds</CardTitle>
                <CardDescription className="text-muted-foreground">Current Active Funding Sources</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/FAO/fund-management")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeFunds.map(fund => (
                  <div 
                    key={fund.id} 
                    className="border rounded p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => navigate("/FAO/fund-management")}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{fund.name}</h3>
                          <Badge variant="outline" className={getStatusBadgeStyles(fund.status)}>
                            {fund.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{fund.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Remaining (Balance)</div>
                        <div className="font-bold text-orange-500">{formatCurrency(fund.remainingAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total</div>
                        <div className="font-medium">{formatCurrency(fund.amount)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Allocated</div>
                        <div className="font-medium">{formatCurrency(fund.allocatedAmount)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Disbursed</div>
                        <div className="font-medium">{formatCurrency(fund.disbursedAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Usage</span>
                        <span>{((fund.allocatedAmount / fund.amount) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(fund.allocatedAmount / fund.amount) * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 py-3">
              <Button 
                variant="link" 
                className="ml-auto"
                onClick={() => navigate("/FAO/fund-management")}
              >
                Manage all Funds
              </Button>
            </CardFooter>
          </Card>
          
          {/* Applications stats */}
          <Card>
            <CardHeader className="border-l-4 border-l-cyan-500 rounded-sm border-b-2 mb-2">
              <CardTitle className="text-lg -my-2 font-bold text-blue-800 ">Application Stats</CardTitle>
              <CardDescription className="text-muted-foreground">Fund Allocation by Education level  </CardDescription>
              <p className="text-sm font-bold text-green-500 ml-auto">FY : 2024 - 2025</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* University Stats */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="font-medium">University</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {educationLevelStats.university.applications} Applications
                  </span>
                </div>
                <Progress value={educationLevelStats.university.allocated / totalAllocatedFunds * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(educationLevelStats.university.allocated / totalAllocatedFunds * 100).toFixed(1)}% of Total</span>
                  <span>{formatCurrency(educationLevelStats.university.allocated)}</span>
                </div>
              </div>
              
              {/* College Stats */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-green-600" />
                    <span className="font-medium">College</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {educationLevelStats.college.applications} Applications
                  </span>
                </div>
                <Progress value={educationLevelStats.college.allocated / totalAllocatedFunds * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(educationLevelStats.college.allocated / totalAllocatedFunds * 100).toFixed(1)}% of Total</span>
                  <span>{formatCurrency(educationLevelStats.college.allocated)}</span>
                </div>
              </div>
              
              {/* TVET Stats */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-amber-600" />
                    <span className="font-medium">TVET</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {educationLevelStats.tvet.applications} Applications
                  </span>
                </div>
                <Progress value={educationLevelStats.tvet.allocated / totalAllocatedFunds * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(educationLevelStats.tvet.allocated / totalAllocatedFunds * 100).toFixed(1)}% of Total</span>
                  <span>{formatCurrency(educationLevelStats.tvet.allocated)}</span>
                </div>
              </div>
              
              {/* Secondary Stats */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="font-medium">Secondary</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {educationLevelStats.secondary.applications} Applications
                  </span>
                </div>
                <Progress value={educationLevelStats.secondary.allocated / totalAllocatedFunds * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(educationLevelStats.secondary.allocated / totalAllocatedFunds * 100).toFixed(1)}% of Total</span>
                  <span>{formatCurrency(educationLevelStats.secondary.allocated)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 p-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate("/FAO/financial-reports")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Reports
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Applications awaiting allocation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="border-l-4 border-l-orange-500 rounded pl-3 h-16 ">
              <CardTitle className="text-lg font-bold text-blue-800 -mb-1">Applications Awaiting Allocation</CardTitle>
              <CardDescription className="text-muted-foreground">
                Approved Applications Pending Fund Allocation
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/FAO/pending-allocations")}>
              <Banknote className="h-4 w-4 mr-2" />
              Approve & Allocate Funds
              
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">
                  Pending Allocation 
                  <Badge variant="secondary" className="ml-2">{pendingAllocationApplications.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="recent">
                  Recent Allocations 
                  <Badge variant="secondary" className="ml-2">{recentAllocations.length}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                {pendingAllocationApplications.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingAllocationApplications.slice(0, 3).map((app) => (
                      <ApplicationCard 
                        key={app.id} 
                        application={app}
                        viewPath={`/FAO/pending-allocations`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="mt-2 text-gray-500">No applications awaiting fund allocation at the moment.</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate("/FAO/pending-allocations")}>
                      Refresh List
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="space-y-4">
                  {recentAllocations.map(allocation => (
                    <div key={allocation.id} className="flex items-center gap-4 p-3 border rounded hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={allocation.studentName} />
                        <AvatarFallback>{allocation.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{allocation.studentName}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {allocation.institution} • {allocation.educationLevel}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(allocation.amount)}</div>
                        <div className="text-xs text-gray-500">{formatDate(allocation.date)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          {pendingAllocationApplications.length > 3 && (
            <CardFooter className="border-t bg-gray-50">
              <Button 
                variant="link" 
                className="ml-auto"
                onClick={() => navigate("/FAO/pending-allocations")}
              >
                View all {pendingAllocationApplications.length} pending allocations
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Institution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Institutions */}
          <Card>
            <CardHeader className="border-l-4 border-l-yellow-500 border-b-2 rounded mb-2">
              <CardTitle className="text-lg -mb-2 font-bold text-blue-800">Top Institutions</CardTitle>
              <CardDescription className="text-muted-foreground">Institutions with most Funded Applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topInstitutions.map((institution, index) => (
                  <div key={institution.name} className="flex items-center">
                    <div className="w-6 text-gray-500 font-medium">{index + 1}</div>
                    <div className="flex-1 ml-2">
                      <div className="font-medium">{institution.name}</div>
                      <div className="text-sm text-gray-500">{institution.count} applications</div>
                    </div>
                    <div className="text-right font-medium">
                      {formatCurrency(institution.allocatedAmount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Allocation Distribution */}
          <Card>
            <CardHeader className="border-l-4 border-l-green-500 border-b-2 rounded ">
              <CardTitle className="text-lg font-bold text-blue-800 -mb-2">Allocation Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">Fund Allocation by Category</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-60">
              <div className="text-center space-y-2">
                <PieChart className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500 text-lg">Fund allocation visualization</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/FAO/financial-reports")}
                >
                  <LineChart className="h-4 w-4 mr-2" />
                  View Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FAODashboard;
