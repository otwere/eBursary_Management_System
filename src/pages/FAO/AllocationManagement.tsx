
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EducationLevelType, FundCategory, FundAllocation } from "@/types/funds";
import { PlusCircle, Layers, FileText, ArrowUp, ArrowDown, Filter, ArrowRight, Search, Check, X } from "lucide-react";
import { toast } from "sonner";

// Mock fund allocations
const mockFundAllocations: FundAllocation[] = [
  {
    id: "alloc-1",
    categoryId: "cat-1", // Bursary
    educationLevel: "University",
    description: "University bursary allocation for 2025",
    amount: 1500000,
    allocatedAmount: 700000,
    disbursedAmount: 500000,
    remainingAmount: 800000,
    academicYear: "2025",
    createdAt: "2024-03-20T09:00:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-2",
    categoryId: "cat-1", // Bursary
    educationLevel: "College",
    description: "College bursary allocation for 2025",
    amount: 800000,
    allocatedAmount: 300000,
    disbursedAmount: 200000,
    remainingAmount: 500000,
    academicYear: "2025",
    createdAt: "2024-03-20T09:15:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-3",
    categoryId: "cat-1", // Bursary
    educationLevel: "TVET",
    description: "TVET bursary allocation for 2025",
    amount: 500000,
    allocatedAmount: 150000,
    disbursedAmount: 100000,
    remainingAmount: 350000,
    academicYear: "2025",
    createdAt: "2024-03-20T09:30:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-4",
    categoryId: "cat-1", // Bursary
    educationLevel: "Secondary",
    description: "Secondary bursary allocation for 2025",
    amount: 200000,
    allocatedAmount: 50000,
    disbursedAmount: 30000,
    remainingAmount: 150000,
    academicYear: "2025",
    createdAt: "2024-03-20T09:45:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-5",
    categoryId: "cat-2", // Scholarship
    educationLevel: "University",
    description: "University scholarship allocation for 2025",
    amount: 1000000,
    allocatedAmount: 500000,
    disbursedAmount: 400000,
    remainingAmount: 500000,
    academicYear: "2025",
    createdAt: "2024-03-21T10:00:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-6",
    categoryId: "cat-2", // Scholarship
    educationLevel: "College",
    description: "College scholarship allocation for 2025",
    amount: 500000,
    allocatedAmount: 200000,
    disbursedAmount: 150000,
    remainingAmount: 300000,
    academicYear: "2025",
    createdAt: "2024-03-21T10:15:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-7",
    categoryId: "cat-2", // Scholarship
    educationLevel: "TVET",
    description: "TVET scholarship allocation for 2025",
    amount: 300000,
    allocatedAmount: 100000,
    disbursedAmount: 50000,
    remainingAmount: 200000,
    academicYear: "2025",
    createdAt: "2024-03-21T10:30:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  },
  {
    id: "alloc-8",
    categoryId: "cat-2", // Scholarship
    educationLevel: "Secondary",
    description: "Secondary scholarship allocation for 2025",
    amount: 200000,
    allocatedAmount: 0,
    disbursedAmount: 0,
    remainingAmount: 200000,
    academicYear: "2025",
    createdAt: "2024-03-21T10:45:00.000Z",
    createdBy: "Michael Johnson",
    status: "active"
  }
];

// Mock fund categories
const mockFundCategories: FundCategory[] = [
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
];

const AllocationManagement = () => {
  const location = useLocation();
  const [isCreateAllocationOpen, setIsCreateAllocationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FundCategory | null>(null);
  const [fundAllocations, setFundAllocations] = useState<FundAllocation[]>(mockFundAllocations);
  const [fundCategories, setFundCategories] = useState<FundCategory[]>(mockFundCategories);
  const [filteredLevel, setFilteredLevel] = useState<EducationLevelType | "all">("all");
  const [filteredCategory, setFilteredCategory] = useState<string>("all");
  
  // Form state for new allocation
  const [newAllocationCategory, setNewAllocationCategory] = useState("");
  const [newAllocationLevel, setNewAllocationLevel] = useState<EducationLevelType | "">("");
  const [newAllocationAmount, setNewAllocationAmount] = useState("");
  const [newAllocationDescription, setNewAllocationDescription] = useState("");

  // Check if a fundId was passed in the location state
  const fundId = location.state?.fundId;

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
      day: 'numeric'
    });
  };

  // Get allocations by category and level
  const getFilteredAllocations = () => {
    return fundAllocations.filter(allocation => {
      const categoryMatch = filteredCategory === "all" || allocation.categoryId === filteredCategory;
      const levelMatch = filteredLevel === "all" || allocation.educationLevel === filteredLevel;
      return categoryMatch && levelMatch;
    });
  };

  // Get category by ID
  const getCategoryById = (categoryId: string) => {
    return fundCategories.find(category => category.id === categoryId);
  };

  // Handle create allocation
  const handleCreateAllocation = () => {
    if (!newAllocationCategory || !newAllocationLevel || !newAllocationAmount) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(newAllocationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const category = fundCategories.find(cat => cat.id === newAllocationCategory);
    if (!category) {
      toast.error("Selected category not found");
      return;
    }

    // Check if allocation for this category and level already exists
    const existingAllocation = fundAllocations.find(
      alloc => alloc.categoryId === newAllocationCategory && alloc.educationLevel === newAllocationLevel
    );
    
    if (existingAllocation) {
      toast.error(`An allocation for ${newAllocationLevel} ${category.name} already exists`);
      return;
    }

    // Check if amount exceeds category remaining amount
    if (amount > category.remainingAmount) {
      toast.error(`The amount exceeds the remaining amount in the ${category.name} category`);
      return;
    }

    const newAllocation: FundAllocation = {
      id: `alloc-${Date.now()}`,
      categoryId: newAllocationCategory,
      educationLevel: newAllocationLevel as EducationLevelType,
      description: newAllocationDescription,
      amount,
      allocatedAmount: 0,
      disbursedAmount: 0,
      remainingAmount: amount,
      academicYear: category.academicYear,
      createdAt: new Date().toISOString(),
      createdBy: "Michael Johnson", // Would come from auth context in real app
      status: "active"
    };

    // Update the category's allocated amount
    const updatedCategories = fundCategories.map(cat => {
      if (cat.id === newAllocationCategory) {
        return {
          ...cat,
          remainingAmount: cat.remainingAmount - amount
        };
      }
      return cat;
    });

    setFundAllocations([...fundAllocations, newAllocation]);
    setFundCategories(updatedCategories);
    setIsCreateAllocationOpen(false);
    resetAllocationForm();
    toast.success(`New allocation for ${newAllocationLevel} ${category.name} created successfully`);
  };

  // Reset allocation form
  const resetAllocationForm = () => {
    setNewAllocationCategory("");
    setNewAllocationLevel("");
    setNewAllocationAmount("");
    setNewAllocationDescription("");
  };

  return (
    <DashboardLayout title="Allocation Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fund Allocation Management</h1>
            <p className="text-gray-500 mt-0">
              Manage and track Fund Allocations by Education level
            </p>
          </div>
          <Button onClick={() => setIsCreateAllocationOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Allocation
          </Button>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Allocation Overview</CardTitle>
            <CardDescription>
              Summary of Fund Allocations by Category & Education level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Allocated</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(fundAllocations.reduce((sum, allocation) => sum + allocation.amount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Disbursed</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(fundAllocations.reduce((sum, allocation) => sum + allocation.disbursedAmount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowDown className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bursary Allocated</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {formatCurrency(fundAllocations
                          .filter(allocation => {
                            const category = getCategoryById(allocation.categoryId);
                            return category?.name === "Bursary";
                          })
                          .reduce((sum, allocation) => sum + allocation.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Scholarship Allocated</p>
                      <p className="text-2xl font-bold text-amber-700">
                        {formatCurrency(fundAllocations
                          .filter(allocation => {
                            const category = getCategoryById(allocation.categoryId);
                            return category?.name === "Scholarship";
                          })
                          .reduce((sum, allocation) => sum + allocation.amount, 0)
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <ArrowUp className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Allocation Distribution by Education Level */}
            <div>
              <h3 className="text-lg font-medium mb-4">Allocation by Education Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bursary Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Bursary Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["University", "College", "TVET", "Secondary"].map((level) => {
                        // Get bursary allocations for this level
                        const levelAllocations = fundAllocations.filter(allocation => {
                          const category = getCategoryById(allocation.categoryId);
                          return category?.name === "Bursary" && allocation.educationLevel === level;
                        });
                        
                        // Calculate total amount for this level
                        const totalAmount = levelAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
                        const disbursedAmount = levelAllocations.reduce((sum, allocation) => sum + allocation.disbursedAmount, 0);
                        
                        // Calculate percentage of total bursary funds
                        const totalBursaryAmount = fundAllocations
                          .filter(allocation => {
                            const category = getCategoryById(allocation.categoryId);
                            return category?.name === "Bursary";
                          })
                          .reduce((sum, allocation) => sum + allocation.amount, 0);
                        
                        const percentage = totalBursaryAmount > 0 ? (totalAmount / totalBursaryAmount) * 100 : 0;
                        
                        return (
                          <div key={`bursary-${level}`} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{level}</span>
                              <span className="text-gray-500">{formatCurrency(totalAmount)}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{Math.round(percentage)}% of total</span>
                              <span>Disbursed : {formatCurrency(disbursedAmount)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Scholarship Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Scholarship Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["University", "College", "TVET", "Secondary"].map((level) => {
                        // Get scholarship allocations for this level
                        const levelAllocations = fundAllocations.filter(allocation => {
                          const category = getCategoryById(allocation.categoryId);
                          return category?.name === "Scholarship" && allocation.educationLevel === level;
                        });
                        
                        // Calculate total amount for this level
                        const totalAmount = levelAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
                        const disbursedAmount = levelAllocations.reduce((sum, allocation) => sum + allocation.disbursedAmount, 0);
                        
                        // Calculate percentage of total scholarship funds
                        const totalScholarshipAmount = fundAllocations
                          .filter(allocation => {
                            const category = getCategoryById(allocation.categoryId);
                            return category?.name === "Scholarship";
                          })
                          .reduce((sum, allocation) => sum + allocation.amount, 0);
                        
                        const percentage = totalScholarshipAmount > 0 ? (totalAmount / totalScholarshipAmount) * 100 : 0;
                        
                        return (
                          <div key={`scholarship-${level}`} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{level}</span>
                              <span className="text-gray-500">{formatCurrency(totalAmount)}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{Math.round(percentage)}% of total</span>
                              <span>Disbursed : {formatCurrency(disbursedAmount)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allocations Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Fund Allocations</CardTitle>
                <CardDescription>
                  View and manage all fund allocations
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={filteredCategory}
                  onValueChange={setFilteredCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Category</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {fundCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filteredLevel}
                  onValueChange={(value) => setFilteredLevel(value as EducationLevelType | "all")}
                >
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Education Level</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="TVET">TVET</SelectItem>
                    <SelectItem value="Secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Education Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Disbursed</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredAllocations().map(allocation => {
                  const category = getCategoryById(allocation.categoryId);
                  return (
                    <TableRow key={allocation.id}>
                      <TableCell>
                        <div className="font-medium">{allocation.educationLevel}</div>
                        <div className="text-sm text-gray-500">{allocation.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          category?.name === "Bursary" ? "border-blue-200 text-blue-800 bg-blue-50" : "border-green-200 text-green-800 bg-green-50"
                        }>
                          {category?.name || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(allocation.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="mr-2">{formatCurrency(allocation.allocatedAmount)}</span>
                          {allocation.allocatedAmount > 0 && (
                            <Badge className="text-xs" variant="outline">
                              {Math.round((allocation.allocatedAmount / allocation.amount) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(allocation.disbursedAmount)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(allocation.remainingAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={allocation.status === "active" ? "default" : "secondary"} className="capitalize">
                          {allocation.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(allocation.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Search className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {getFilteredAllocations().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                      No allocations found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create Allocation Dialog */}
      <Dialog open={isCreateAllocationOpen} onOpenChange={setIsCreateAllocationOpen}>
        <DialogContent className="sm:max-w-3xl bg-gray-50">
          <DialogHeader>
            <DialogTitle>Create Fund Allocation</DialogTitle>
            <DialogDescription>
              Allocate Funds to Specific Education levels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Fund Category</Label>
              <Select
                value={newAllocationCategory}
                onValueChange={(value) => {
                  setNewAllocationCategory(value);
                  const category = fundCategories.find(cat => cat.id === value);
                  setSelectedCategory(category || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {fundCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} - {formatCurrency(category.remainingAmount)} remaining
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm font-medium text-blue-800">Category Details</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-medium">{formatCurrency(selectedCategory.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className="font-medium">{formatCurrency(selectedCategory.remainingAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="level">Education Level</Label>
              <Select
                value={newAllocationLevel}
                onValueChange={(value) => setNewAllocationLevel(value as EducationLevelType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="University">University</SelectItem>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="TVET">TVET</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Allocation Amount</Label>
              <Input
                id="amount"
                placeholder="e.g., 1000000"
                type="number"
                value={newAllocationAmount}
                onChange={(e) => setNewAllocationAmount(e.target.value)}
              />
              {selectedCategory && newAllocationAmount && !isNaN(parseFloat(newAllocationAmount)) && (
                <div className="text-xs flex justify-between mt-1">
                  <span>
                    {parseFloat(newAllocationAmount) > selectedCategory.remainingAmount ? (
                      <span className="text-red-500 flex items-center">
                        <X className="h-3 w-3 mr-1" />
                        Exceeds available amount
                      </span>
                    ) : (
                      <span className="text-green-500 flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        Amount available
                      </span>
                    )}
                  </span>
                  <span className="text-gray-500">
                    Maximum: {formatCurrency(selectedCategory.remainingAmount)}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter allocation description..."
                value={newAllocationDescription}
                onChange={(e) => setNewAllocationDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAllocationOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateAllocation}
              disabled={!newAllocationCategory || !newAllocationLevel || !newAllocationAmount}
            >
              Create Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AllocationManagement;
