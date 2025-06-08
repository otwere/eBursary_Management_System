
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FundFloat, FundCategory } from "@/types/funds";
import { PlusCircle, DollarSign, FileText, BadgeCent, PieChart, ArrowUpRight, ArrowDownRight, Wallet, Banknote } from "lucide-react";
import { toast } from "sonner";

// Mock fund data
const mockFundFloats: FundFloat[] = [
  {
    id: "float-1",
    name: "Annual Education Fund 2025",
    description: "Main Budget Allocation for Education Support in the 2025 Academic Year",
    amount: 5000000,
    academicYear: "2025",
    createdAt: "2024-03-10T08:00:00.000Z",
    createdBy: "Michael Johnson",
    status: "active",
    allocatedAmount: 2000000,
    disbursedAmount: 1500000,
    remainingAmount: 3000000,
    financialPeriod: "2024-2025"
  },
  {
    id: "float-2",
    name: "Emergency Relief Fund",
    description: "Special Allocation for Students affected by Economic Hardship",
    amount: 1000000,
    academicYear: "2025",
    createdAt: "2024-04-05T10:30:00.000Z",
    createdBy: "Michael Johnson",
    status: "active",
    allocatedAmount: 300000,
    disbursedAmount: 100000,
    remainingAmount: 700000,
    financialPeriod: "2024-2025"
  }
];

// Mock fund categories
const mockFundCategories: FundCategory[] = [
  {
    id: "cat-1",
    floatId: "float-1",
    name: "Bursary",
    description: "Need-based Financial assistance for Tuition and related Costs",
    amount: 3000000,
    allocatedAmount: 1200000,
    disbursedAmount: 900000,
    remainingAmount: 1800000,
    academicYear: "2025",
    createdAt: "2024-03-15T09:00:00.000Z",
    createdBy: "Michael Johnson"
  },
  {
    id: "cat-2",
    floatId: "float-1",
    name: "Scholarship",
    description: "Needy Merit-based Financial assistance for outstanding Academic Performance",
    amount: 2000000,
    allocatedAmount: 800000,
    disbursedAmount: 600000,
    remainingAmount: 1200000,
    academicYear: "2025",
    createdAt: "2024-03-15T09:15:00.000Z",
    createdBy: "Michael Johnson"
  },
  {
    id: "cat-3",
    floatId: "float-2",
    name: "Bursary",
    description: "Emergency Relief Bursary Fund",
    amount: 600000,
    allocatedAmount: 200000,
    disbursedAmount: 70000,
    remainingAmount: 400000,
    academicYear: "2025",
    createdAt: "2024-04-07T11:00:00.000Z",
    createdBy: "Michael Johnson"
  },
  {
    id: "cat-4",
    floatId: "float-2",
    name: "Scholarship",
    description: "Emergency Relief Scholarship Fund",
    amount: 400000,
    allocatedAmount: 100000,
    disbursedAmount: 30000,
    remainingAmount: 300000,
    academicYear: "2025",
    createdAt: "2024-04-07T11:30:00.000Z",
    createdBy: "Michael Johnson"
  }
];

const FundManagement = () => {
  const navigate = useNavigate();
  const [isCreateFundOpen, setIsCreateFundOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundFloat | null>(null);
  const [fundFloats, setFundFloats] = useState<FundFloat[]>(mockFundFloats);
  const [fundCategories, setFundCategories] = useState<FundCategory[]>(mockFundCategories);
  
  // Form state for new fund
  const [newFundName, setNewFundName] = useState("");
  const [newFundAmount, setNewFundAmount] = useState("");
  const [newFundDescription, setNewFundDescription] = useState("");
  const [newFundAcademicYear, setNewFundAcademicYear] = useState("");
  const [newFundPeriod, setNewFundPeriod] = useState("");
  
  // Form state for fund allocation
  const [bursaryAmount, setBursaryAmount] = useState("");
  const [scholarshipAmount, setScholarshipAmount] = useState("");
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);

  const handleCreateFund = () => {
    if (!newFundName || !newFundAmount || !newFundAcademicYear) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(newFundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newFund: FundFloat = {
      id: `float-${Date.now()}`,
      name: newFundName,
      description: newFundDescription,
      amount,
      academicYear: newFundAcademicYear,
      createdAt: new Date().toISOString(),
      createdBy: "Michael Johnson", // Would come from auth context in real app
      status: "active",
      allocatedAmount: 0,
      disbursedAmount: 0,
      remainingAmount: amount,
      financialPeriod: newFundPeriod
    };

    setFundFloats([...fundFloats, newFund]);
    setIsCreateFundOpen(false);
    resetNewFundForm();
    toast.success("New fund float created successfully");
  };

  const resetNewFundForm = () => {
    setNewFundName("");
    setNewFundAmount("");
    setNewFundDescription("");
    setNewFundAcademicYear("");
    setNewFundPeriod("");
  };

  const handleAllocateFund = () => {
    if (!selectedFund) return;
    
    const bursaryAmountNum = parseFloat(bursaryAmount);
    const scholarshipAmountNum = parseFloat(scholarshipAmount);
    
    if (isNaN(bursaryAmountNum) || isNaN(scholarshipAmountNum)) {
      toast.error("Please enter valid amounts");
      return;
    }
    
    const totalAllocation = bursaryAmountNum + scholarshipAmountNum;
    if (totalAllocation > selectedFund.remainingAmount) {
      toast.error("Total allocation exceeds remaining fund amount");
      return;
    }
    
    // Create bursary category
    const bursaryCategory: FundCategory = {
      id: `cat-${Date.now()}-bursary`,
      floatId: selectedFund.id,
      name: "Bursary",
      description: `Bursary allocation from ${selectedFund.name}`,
      amount: bursaryAmountNum,
      allocatedAmount: 0,
      disbursedAmount: 0,
      remainingAmount: bursaryAmountNum,
      academicYear: selectedFund.academicYear,
      createdAt: new Date().toISOString(),
      createdBy: "Michael Johnson" // Would come from auth context in real app
    };
    
    // Create scholarship category
    const scholarshipCategory: FundCategory = {
      id: `cat-${Date.now()}-scholarship`,
      floatId: selectedFund.id,
      name: "Scholarship",
      description: `Scholarship allocation from ${selectedFund.name}`,
      amount: scholarshipAmountNum,
      allocatedAmount: 0,
      disbursedAmount: 0,
      remainingAmount: scholarshipAmountNum,
      academicYear: selectedFund.academicYear,
      createdAt: new Date().toISOString(),
      createdBy: "Michael Johnson" // Would come from auth context in real app
    };
    
    // Update fund float
    const updatedFundFloats = fundFloats.map(fund => {
      if (fund.id === selectedFund.id) {
        return {
          ...fund,
          allocatedAmount: fund.allocatedAmount + totalAllocation,
          remainingAmount: fund.remainingAmount - totalAllocation
        };
      }
      return fund;
    });
    
    setFundFloats(updatedFundFloats);
    setFundCategories([...fundCategories, bursaryCategory, scholarshipCategory]);
    setIsAllocateOpen(false);
    setBursaryAmount("");
    setScholarshipAmount("");
    toast.success("Fund categories created successfully");
  };

  const getFundCategoriesByFloatId = (floatId: string) => {
    return fundCategories.filter(category => category.floatId === floatId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout title="Funds Management Dashboard">
      <div className="space-y-6 lg:-mx-[80px] mt-[-4rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-l-4 border-l-blue-500 h-20 rounded-none border-b-2">
          <div className="pl-4 -mt-5">
            <h1 className="text-xl font-bold text-blue-800">Funds Management</h1>
            <p className="text-muted-foreground text-sm -mt-1">
              Create | Manage | Approve & Allocate Funds for Bursaries and Scholarships
            </p>
          </div>
          <Button onClick={() => setIsCreateFundOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Load New Fund (Float)
          </Button>
        </div>

        {/* Fund Overview */}
        <Card>
          <CardHeader className="border-l-4 border-l-lime-500 rounded border-b-2 mx-0 mb-4 ">
            <CardTitle className="text-xl font-bold -my-2 text-blue-800">Funds Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Summary of all Available Funds Allocations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
              <Card className="bg-primary-50 border-primary-100 border-l-4 border-l-blue-500 h-28 ">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Funds</p>
                      <p className="text-xl font-bold text-primary-700">
                        {formatCurrency(fundFloats.reduce((sum, fund) => sum + fund.amount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-100 border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Allocated</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(fundFloats.reduce((sum, fund) => sum + fund.allocatedAmount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Banknote className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-100 border-l-4 border-l-cyan-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Disbursed</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(fundFloats.reduce((sum, fund) => sum + fund.disbursedAmount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-100 border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Remaining (Balance)</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {formatCurrency(fundFloats.reduce((sum, fund) => sum + fund.remainingAmount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <BadgeCent className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Budget Utilization</span>
                  <span>
                    {Math.round((fundFloats.reduce((sum, fund) => sum + fund.allocatedAmount, 0) / 
                      fundFloats.reduce((sum, fund) => sum + fund.amount, 0)) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={Math.round((fundFloats.reduce((sum, fund) => sum + fund.allocatedAmount, 0) / 
                    fundFloats.reduce((sum, fund) => sum + fund.amount, 0)) * 100)}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fund Floats */}
        <Tabs defaultValue="active">
          <div className="flex items-center justify-between mb-4 ">
            <TabsList>
              <TabsTrigger value="active">Active Funds</TabsTrigger>
              <TabsTrigger value="closed">Closed Funds</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="space-y-4">
            {fundFloats.filter(fund => fund.status === "active").length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No active funds found</p>
                </CardContent>
              </Card>
            ) : (
              fundFloats.filter(fund => fund.status === "active").map(fund => (
                <Card key={fund.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-lg text-blue-800 font-bold">{fund.name}</h3>
                          <p className="text-gray-500 text-sm">{fund.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs bg-primary-100 text-primary-800 rounded-full px-2 py-0.5 mr-2">
                              {fund.academicYear} Academic Year
                            </span>
                            <span className="text-xs text-gray-500">
                              Created on {formatDate(fund.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-4 md:mt-0">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mr-2"
                            onClick={() => {
                              navigate("/FAO/allocation-management", { state: { fundId: fund.id } });
                            }}
                          >
                            Manage Allocations
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedFund(fund);
                              setIsAllocateOpen(true);
                            }}
                          >
                            Create Categories
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="border-l-4 pl-2 border-l-yellow-500 rounded">
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="text-xl text-yellow-600 font-bold">{formatCurrency(fund.amount)}</p>
                        </div>
                        <div className="border-l-4 border-l-blue-500 pl-2 rounded">
                          <p className="text-sm text-gray-500">Total Allocated</p>
                          <div className="flex items-center">
                            <p className="text-xl text-blue-500 font-bold">{formatCurrency(fund.allocatedAmount)}</p>
                            <ArrowUpRight className="h-4 w-4 text-green-500 ml-1" />
                          </div>
                        </div>
                        <div className="border-l-4 border-l-green-500 pl-2 rounded">
                          <p className="text-sm text-gray-500">Total Disbursed</p>
                          <div className="flex items-center">
                            <p className="text-xl text-green-500 font-bold">{formatCurrency(fund.disbursedAmount)}</p>
                            <ArrowDownRight className="h-4 w-4 text-blue-500 ml-1" />
                          </div>
                        </div>
                        <div className="border-l-4 border-l-amber-500 pl-2 rounded">
                          <p className="text-sm text-gray-500">Total Remaining (Balance)</p>
                          <p className="text-xl text-amber-500 font-bold">{formatCurrency(fund.remainingAmount)}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Utilization</span>
                            <span>{Math.round((fund.allocatedAmount / fund.amount) * 100)}%</span>
                          </div>
                          <Progress value={Math.round((fund.allocatedAmount / fund.amount) * 100)} className="h-2" />
                        </div>
                      </div>
                    </div>

                    {/* Fund Categories */}
                    {getFundCategoriesByFloatId(fund.id).length > 0 && (
                      <div className="border-t bg-gray-50 p-4">
                        <h4 className="text-lg font-medium text-gray-700 mb-4">Fund Categories</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getFundCategoriesByFloatId(fund.id).map(category => (
                            <Card key={category.id} className="border bg-white">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium text-orange-500">{category.name}</h5>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    category.name === "Bursary" 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-green-100 text-green-800"
                                  }`}>
                                    {category.name}
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-4">
                                  <div>
                                    <p className="text-xs text-gray-500">Amount</p>
                                    <p className="font-medium">{formatCurrency(category.amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Allocated</p>
                                    <p className="font-medium">{formatCurrency(category.allocatedAmount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Remaining</p>
                                    <p className="font-medium">{formatCurrency(category.remainingAmount)}</p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <div className="space-y-1">
                                    <Progress 
                                      value={Math.round((category.allocatedAmount / category.amount) * 100)} 
                                      className="h-1.5" 
                                    />
                                    <div className="flex justify-between text-xs text-gray-500">
                                      <span>Utilization</span>
                                      <span>{Math.round((category.allocatedAmount / category.amount) * 100)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4">
            {fundFloats.filter(fund => fund.status === "closed").length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No closed funds found</p>
                </CardContent>
              </Card>
            ) : (
              fundFloats.filter(fund => fund.status === "closed").map(fund => (
                <Card key={fund.id}>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{fund.name}</h3>
                    <p className="text-gray-500 text-sm">{fund.description}</p>
                    {/* Additional details for closed funds */}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Fund Dialog */}
      <Dialog open={isCreateFundOpen} onOpenChange={setIsCreateFundOpen}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-lime-500 pl-2 rounded h-16 border-b-2">
            <DialogTitle className="text-lg font-bold text-blue-800 -mb-2">Load New Fund (Float)</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new Fund Allocation that can be Distributed to Bursaries and Scholarships.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Fund Name</Label>
              <Input
                id="name"
                placeholder="e.g., Annual Education Fund 2025"
                value={newFundName}
                onChange={(e) => setNewFundName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount</Label>
              <Input
                id="amount"
                placeholder="e.g., 5000000"
                type="number"
                value={newFundAmount}
                onChange={(e) => setNewFundAmount(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={newFundAcademicYear}
                  onValueChange={setNewFundAcademicYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024 - 2025</SelectItem>
                    <SelectItem value="2025-2026">2025 - 2026</SelectItem>
                    <SelectItem value="2026-2027">2026 - 2027</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period">Financial Period</Label>
                <Select
                  value={newFundPeriod}
                  onValueChange={setNewFundPeriod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2025-2026">2025-2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter fund description..."
                value={newFundDescription}
                onChange={(e) => setNewFundDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFundOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateFund}>Create Fund</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Fund Dialog */}
      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
        <DialogContent className=" lg:max-w-5xl md:max-w-3xl sm:max-w-2xl">
          <DialogHeader className="border-l-4 border-l-cyan-500 rounded pl-2 h-14">
            <DialogTitle className="font-bold text-blue-800 -mb-1">Create Fund Categories</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Divide the Funds into Bursary and Scholarship Categories.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded mb-4">
              <p className="text-sm font-medium">Fund Details</p>
              <p className="text-lg font-bold mt-0 text-blue-800">{selectedFund?.name}</p>
              <div className="flex justify-between mt-2">
                <div className="border-l-4 border-l-blue-500 pl-2">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium text-blue-500">{selectedFund ? formatCurrency(selectedFund.amount) : "-"}</p>
                </div>
                <div className="border-l-4 border-l-orange-500 pl-2">
                  <p className="text-sm text-gray-500">Remaining (Available Balance)</p>
                  <p className="font-medium text-orange-500">{selectedFund ? formatCurrency(selectedFund.remainingAmount) : "-"}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bursary">Bursary Amount</Label>
              <Input
                id="bursary"
                placeholder="e.g., 3000000"
                type="number"
                value={bursaryAmount}
                onChange={(e) => setBursaryAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scholarship">Scholarship Amount</Label>
              <Input
                id="scholarship"
                placeholder="e.g., 2000000"
                type="number"
                value={scholarshipAmount}
                onChange={(e) => setScholarshipAmount(e.target.value)}
              />
            </div>
            
            {(bursaryAmount || scholarshipAmount) && (
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm font-medium text-blue-800">Allocation Summary</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Bursary</p>
                    <p className="font-medium">{formatCurrency(parseFloat(bursaryAmount) || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Scholarship</p>
                    <p className="font-medium">{formatCurrency(parseFloat(scholarshipAmount) || 0)}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Total Allocation</p>
                  <p className="font-medium">
                    {formatCurrency((parseFloat(bursaryAmount) || 0) + (parseFloat(scholarshipAmount) || 0))}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Remaining After Allocation</p>
                  <p className="font-medium">
                    {formatCurrency((selectedFund?.remainingAmount || 0) - 
                      ((parseFloat(bursaryAmount) || 0) + (parseFloat(scholarshipAmount) || 0)))}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAllocateFund}
              disabled={!bursaryAmount && !scholarshipAmount}
            >
              Create Categories
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FundManagement;
