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
import { FundFloat, FundCategory, FundSource } from "@/types/funds";
import { PlusCircle, DollarSign, FileText, BadgeCent, PieChart, ArrowUpRight, ArrowDownRight, Wallet, Banknote, Upload, FileCheck, FileSearch } from "lucide-react";
import { toast } from "sonner";

// Types
type ProofOfFunds = {
  id: string;
  floatId: string;
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  verified: boolean;
};

// Mock fund data
const mockFundFloats: FundFloat[] = [
  {
    id: "FLT-2025-EDU-001",
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
    financialPeriod: "2024-2025",
    sourceId: "SRC-GOV-001",
    floatNumber: "FLT-2025-EDU-001"
  },
  {
    id: "FLT-2025-EMG-002",
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
    financialPeriod: "2024-2025",
    sourceId: "SRC-DON-001",
    floatNumber: "FLT-2025-EMG-002"
  }
];

// Mock fund categories
const mockFundCategories: FundCategory[] = [
  {
    id: "CAT-BUR-2025-001",
    floatId: "FLT-2025-EDU-001",
    name: "Bursary",
    description: "Need-based Financial assistance for Tuition and related Costs",
    amount: 3000000,
    allocatedAmount: 1200000,
    disbursedAmount: 900000,
    remainingAmount: 1800000,
    academicYear: "2025",
    createdAt: "2024-03-15T09:00:00.000Z",
    createdBy: "Michael Johnson",
    categoryNumber: "CAT-BUR-2025-001"
  },
  {
    id: "CAT-SCH-2025-002",
    floatId: "FLT-2025-EDU-001",
    name: "Scholarship",
    description: "Needy Merit-based Financial assistance for outstanding Academic Performance",
    amount: 2000000,
    allocatedAmount: 800000,
    disbursedAmount: 600000,
    remainingAmount: 1200000,
    academicYear: "2025",
    createdAt: "2024-03-15T09:15:00.000Z",
    createdBy: "Michael Johnson",
    categoryNumber: "CAT-SCH-2025-002"
  },
  {
    id: "CAT-BUR-2025-003",
    floatId: "FLT-2025-EMG-002",
    name: "Bursary",
    description: "Emergency Relief Bursary Fund",
    amount: 600000,
    allocatedAmount: 200000,
    disbursedAmount: 70000,
    remainingAmount: 400000,
    academicYear: "2025",
    createdAt: "2024-04-07T11:00:00.000Z",
    createdBy: "Michael Johnson",
    categoryNumber: "CAT-BUR-2025-003"
  },
  {
    id: "CAT-SCH-2025-004",
    floatId: "FLT-2025-EMG-002",
    name: "Scholarship",
    description: "Emergency Relief Scholarship Fund",
    amount: 400000,
    allocatedAmount: 100000,
    disbursedAmount: 30000,
    remainingAmount: 300000,
    academicYear: "2025",
    createdAt: "2024-04-07T11:30:00.000Z",
    createdBy: "Michael Johnson",
    categoryNumber: "CAT-SCH-2025-004"
  }
];

// Mock fund sources
const mockFundSources: FundSource[] = [
  {
    id: "SRC-GOV-001",
    name: "National Treasury",
    type: "Government Allocation",
    description: "Annual budget allocation from national government",
    contactPerson: "Dr. James Mwangi",
    contactEmail: "j.mwangi@treasury.go.ke",
    contactPhone: "+254722000000"
  },
  {
    id: "SRC-DON-001",
    name: "Global Education Fund",
    type: "Donor Funding",
    description: "International donor funding for education initiatives",
    contactPerson: "Sarah Johnson",
    contactEmail: "s.johnson@globaled.org",
    contactPhone: "+442071234567"
  },
  {
    id: "SRC-PVT-001",
    name: "Corporate Social Responsibility",
    type: "Private Sector",
    description: "Contributions from local businesses and corporations",
    contactPerson: "David Kamau",
    contactEmail: "d.kamau@csrke.org",
    contactPhone: "+254733000000"
  }
];

// Mock proof of funds documents
const mockProofOfFunds: ProofOfFunds[] = [
  {
    id: "DOC-001",
    floatId: "FLT-2025-EDU-001",
    documentName: "Treasury Allocation Letter",
    documentType: "Official Letter",
    fileUrl: "/documents/treasury-letter-2025.pdf",
    uploadedAt: "2024-03-10T09:15:00.000Z",
    uploadedBy: "Michael Johnson",
    verified: true
  },
  {
    id: "DOC-002",
    floatId: "FLT-2025-EMG-002",
    documentName: "Donor Agreement",
    documentType: "Contract",
    fileUrl: "/documents/donor-agreement-2025.pdf",
    uploadedAt: "2024-04-05T11:45:00.000Z",
    uploadedBy: "Michael Johnson",
    verified: true
  }
];

// Helper functions
const generateFloatNumber = (fundType: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FLT-${year}-${fundType.substring(0, 3).toUpperCase()}-${randomNum}`;
};

const generateCategoryNumber = (categoryType: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `CAT-${categoryType.substring(0, 3).toUpperCase()}-${year}-${randomNum}`;
};

const FundManagement = () => {
  const navigate = useNavigate();
  const [isCreateFundOpen, setIsCreateFundOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundFloat | null>(null);
  const [fundFloats, setFundFloats] = useState<FundFloat[]>(mockFundFloats);
  const [fundCategories, setFundCategories] = useState<FundCategory[]>(mockFundCategories);
  const [fundSources] = useState<FundSource[]>(mockFundSources);
  const [proofOfFunds] = useState<ProofOfFunds[]>(mockProofOfFunds);
  
  // Form state for new fund
  const [newFundName, setNewFundName] = useState("");
  const [newFundAmount, setNewFundAmount] = useState("");
  const [newFundDescription, setNewFundDescription] = useState("");
  const [newFundAcademicYear, setNewFundAcademicYear] = useState("");
  const [newFundPeriod, setNewFundPeriod] = useState("");
  const [newFundSource, setNewFundSource] = useState("");
  const [newFundType, setNewFundType] = useState("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  
  // Form state for fund allocation
  const [bursaryAmount, setBursaryAmount] = useState("");
  const [bursaryDescription, setBursaryDescription] = useState("");
  const [scholarshipAmount, setScholarshipAmount] = useState("");
  const [scholarshipDescription, setScholarshipDescription] = useState("");
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);

  const handleCreateFund = () => {
    if (!newFundName || !newFundAmount || !newFundAcademicYear || !newFundSource || !newFundType) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(newFundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const floatNumber = generateFloatNumber(newFundType);

    const newFund: FundFloat = {
      id: floatNumber,
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
      financialPeriod: newFundPeriod,
      sourceId: newFundSource,
      floatNumber
    };

    //  we would upload the document file here
    if (documentFile) {
      toast.success("Proof of funds document uploaded successfully");
      // Add to proofOfFunds array here
    }

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
    setNewFundSource("");
    setNewFundType("");
    setDocumentFile(null);
    setDocumentName("");
    setDocumentType("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      setDocumentName(file.name);
      toast.success("File selected: " + file.name);
    }
  };

  const handleAllocateFund = () => {
    if (!selectedFund) return;
    
    const bursaryAmountNum = parseFloat(bursaryAmount) || 0;
    const scholarshipAmountNum = parseFloat(scholarshipAmount) || 0;
    
    if (bursaryAmountNum <= 0 && scholarshipAmountNum <= 0) {
      toast.error("Please enter valid amounts for at least one category");
      return;
    }
    
    const totalAllocation = bursaryAmountNum + scholarshipAmountNum;
    if (totalAllocation > selectedFund.remainingAmount) {
      toast.error("Total allocation exceeds remaining fund amount");
      return;
    }
    
    const newCategories: FundCategory[] = [];
    
    // Create bursary category if amount is positive
    if (bursaryAmountNum > 0) {
      const bursaryCategory: FundCategory = {
        id: generateCategoryNumber("Bursary"),
        floatId: selectedFund.id,
        name: "Bursary",
        description: bursaryDescription || `Bursary allocation from ${selectedFund.name}`,
        amount: bursaryAmountNum,
        allocatedAmount: 0,
        disbursedAmount: 0,
        remainingAmount: bursaryAmountNum,
        academicYear: selectedFund.academicYear,
        createdAt: new Date().toISOString(),
        createdBy: "Michael Johnson",
        categoryNumber: generateCategoryNumber("Bursary")
      };
      newCategories.push(bursaryCategory);
    }
    
    // Create scholarship category if amount is positive
    if (scholarshipAmountNum > 0) {
      const scholarshipCategory: FundCategory = {
        id: generateCategoryNumber("Scholarship"),
        floatId: selectedFund.id,
        name: "Scholarship",
        description: scholarshipDescription || `Scholarship allocation from ${selectedFund.name}`,
        amount: scholarshipAmountNum,
        allocatedAmount: 0,
        disbursedAmount: 0,
        remainingAmount: scholarshipAmountNum,
        academicYear: selectedFund.academicYear,
        createdAt: new Date().toISOString(),
        createdBy: "Michael Johnson",
        categoryNumber: generateCategoryNumber("Scholarship")
      };
      newCategories.push(scholarshipCategory);
    }
    
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
    setFundCategories([...fundCategories, ...newCategories]);
    setIsAllocateOpen(false);
    setBursaryAmount("");
    setScholarshipAmount("");
    setBursaryDescription("");
    setScholarshipDescription("");
    toast.success("Fund categories created successfully");
  };

  const getFundCategoriesByFloatId = (floatId: string) => {
    return fundCategories.filter(category => category.floatId === floatId);
  };

  const getFundSourceById = (sourceId: string) => {
    return fundSources.find(source => source.id === sourceId);
  };

  const getProofOfFundsByFloatId = (floatId: string) => {
    return proofOfFunds.filter(doc => doc.floatId === floatId);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
              fundFloats.filter(fund => fund.status === "active").map(fund => {
                const source = getFundSourceById(fund.sourceId);
                const documents = getProofOfFundsByFloatId(fund.id);
                
                return (
                  <Card key={fund.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg text-blue-800 font-bold">{fund.name}</h3>
                            <p className="text-gray-500 text-sm">{fund.description}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className="text-xs bg-primary-100 text-primary-800 rounded-full px-2 py-0.5">
                                {fund.floatNumber}
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5">
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

                        {/* Source of Funds */}
                        <div className="mt-4 p-3 bg-white rounded border">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Source of Funds</h4>
                          {source ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Source Name</p>
                                <p className="text-sm font-medium">{source.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Type</p>
                                <p className="text-sm font-medium">{source.type}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Contact</p>
                                <p className="text-sm font-medium">{source.contactPerson}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No source information available</p>
                          )}
                        </div>

                        {/* Proof of Funds Documents */}
                        {documents.length > 0 && (
                          <div className="mt-4 p-3 bg-white rounded border">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Proof of Funds</h4>
                            <div className="space-y-2">
                              {documents.map(doc => (
                                <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div className="flex items-center">
                                    <FileCheck className="h-4 w-4 text-green-500 mr-2" />
                                    <div>
                                      <p className="text-sm font-medium">{doc.documentName}</p>
                                      <p className="text-xs text-gray-500">{doc.documentType}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-blue-600">
                                    <FileSearch className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

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
                          <h4 className="font-bold text-gray-600 mb-4">Fund Categories</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {getFundCategoriesByFloatId(fund.id).map(category => (
                              <Card key={category.id} className="border bg-white">
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h5 className="font-medium text-orange-500">{category.name}</h5>
                                      <p className="text-xs text-gray-500 mb-1">{category.categoryNumber}</p>
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
                );
              })
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Fund Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g., Annual Education Fund 2025"
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount (KES) <span className="text-red-500">*</span></Label>
                <Input
                  id="amount"
                  placeholder="e.g., 5000000"
                  type="number"
                  value={newFundAmount}
                  onChange={(e) => setNewFundAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year <span className="text-red-500">*</span></Label>
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
              <div className="space-y-2">
                <Label htmlFor="fundType">Fund Type <span className="text-red-500">*</span></Label>
                <Select
                  value={newFundType}
                  onValueChange={setNewFundType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source of Funds <span className="text-red-500">*</span></Label>
                <Select
                  value={newFundSource}
                  onValueChange={setNewFundSource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
  {fundSources.map(source => (
    <SelectItem key={source.id} value={source.id}>
      {source.name} ({source.type})
    </SelectItem>
  ))}
</SelectContent>           </Select>
              </div>
            </div>

            {/* Proof of Funds Document Upload */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Proof of Funds Document</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="documentName">Document Name</Label>
                  <Input
                    id="documentName"
                    placeholder="e.g., Treasury Allocation Letter"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Select
                    value={documentType}
                    onValueChange={setDocumentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Official Letter">Official Letter</SelectItem>
                      <SelectItem value="Bank Statement">Bank Statement</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Approval Notice">Approval Notice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentFile">Upload Document</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="documentFile"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Label
                      htmlFor="documentFile"
                      className="flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Label>
                    {documentFile && (
                      <span className="text-sm truncate max-w-[120px]">
                        {documentFile.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateFundOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFund}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Fund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Fund Dialog */}
      <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
        <DialogContent className="lg:max-w-4xl sm:max-w-xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-blue-500 pl-2 border-b-2 h-16">
            <DialogTitle className="text-blue-800 text-xl font-bold -mb-2">
              Allocate Funds to Categories
            </DialogTitle>
            <DialogDescription>
              Create Bursary and Scholarship categories from {selectedFund?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-0 border-l-4 border-l-orange-500 pl-2">
              <Label>Available (Balance) Fund Amount</Label>
              <p className="text-xl font-bold text-orange-600">
                {selectedFund ? formatCurrency(selectedFund.remainingAmount) : "N/A"}
              </p>
            </div>

            <div className="space-y-1 border-t pt-4">
              <h4 className="font-medium text-primary-700">Bursary Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bursaryAmount">Amount (KES)</Label>
                  <Input
                    id="bursaryAmount"
                    placeholder="Enter amount allocated for Bursary"
                    type="number"
                    value={bursaryAmount}
                    onChange={(e) => setBursaryAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bursaryDescription">Description</Label>
                  <Input
                    id="bursaryDescription"
                    placeholder="Bursary description"
                    value={bursaryDescription}
                    onChange={(e) => setBursaryDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 border-t pt-4">
              <h4 className="font-medium text-primary-700">Scholarship Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scholarshipAmount">Amount (KES)</Label>
                  <Input
                    id="scholarshipAmount"
                    placeholder="Enter amount allocated for Scholarship"
                    type="number"
                    value={scholarshipAmount}
                    onChange={(e) => setScholarshipAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scholarshipDescription">Description</Label>
                  <Input
                    id="scholarshipDescription"
                    placeholder="Scholarship description"
                    value={scholarshipDescription}
                    onChange={(e) => setScholarshipDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAllocateFund}>
              Create Categories
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default FundManagement;