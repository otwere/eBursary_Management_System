import { useState, useEffect } from "react";
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
import { EducationLevelType, FundCategory, FundAllocation, AllocationStatus } from "@/types/funds";
import { PlusCircle, Layers, FileText, ArrowUp, ArrowDown, Filter, ArrowRight, Search, Check, X, ChevronDown, ChevronUp, Clock, User, Calendar, BookOpen, Percent, Wallet, Trash2, Edit, Archive, RefreshCw, Download, Upload, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Complete Mock Data
const mockFundCategories: FundCategory[] = [
  {
    id: "cat-1",
    floatId: "float-1",
    name: "Bursary",
    description: "Need-based financial assistance for students",
    amount: 5000000,
    allocatedAmount: 3000000,
    disbursedAmount: 2000000,
    remainingAmount: 2000000,
    academicYear: "2024/2025",
    createdAt: "2024-01-15T09:00:00.000Z",
    createdBy: "Admin User",
    updatedAt: "2024-06-01T14:30:00.000Z",
    updatedBy: "Finance Officer"
  },
  {
    id: "cat-2",
    floatId: "float-1",
    name: "Scholarship",
    description: "Merit-based financial awards",
    amount: 3000000,
    allocatedAmount: 1800000,
    disbursedAmount: 1200000,
    remainingAmount: 1200000,
    academicYear: "2024/2025",
    createdAt: "2024-01-15T10:15:00.000Z",
    createdBy: "Admin User",
    updatedAt: "2024-05-20T11:45:00.000Z",
    updatedBy: "Finance Officer"
  },
  {
    id: "cat-3",
    floatId: "float-1",
    name: "Emergency Fund",
    description: "Urgent financial support for students in crisis",
    amount: 1000000,
    allocatedAmount: 400000,
    disbursedAmount: 250000,
    remainingAmount: 600000,
    academicYear: "2024/2025",
    createdAt: "2024-02-10T14:00:00.000Z",
    createdBy: "Admin User",
    updatedAt: "2024-06-10T09:15:00.000Z",
    updatedBy: "Finance Officer"
  },
  {
    id: "cat-4",
    floatId: "float-2",
    name: "Research Grant",
    description: "Funding for student research projects",
    amount: 2000000,
    allocatedAmount: 800000,
    disbursedAmount: 500000,
    remainingAmount: 1200000,
    academicYear: "2024/2025",
    createdAt: "2024-03-05T11:30:00.000Z",
    createdBy: "Research Coordinator",
    updatedAt: "2024-06-15T16:20:00.000Z",
    updatedBy: "Research Officer"
  }
];

const mockFundAllocations: FundAllocation[] = [
  {
    id: "alloc-1",
    categoryId: "cat-1",
    educationLevel: "University",
    description: "Undergraduate bursaries for main campus",
    amount: 2000000,
    allocatedAmount: 1500000,
    disbursedAmount: 1200000,
    remainingAmount: 800000,
    academicYear: "2024/2025",
    createdAt: "2024-01-20T10:00:00.000Z",
    createdBy: "Finance Officer",
    updatedAt: "2024-06-01T15:45:00.000Z",
    updatedBy: "Disbursement Officer",
    status: "active",
    beneficiaries: 320,
    applications: 450,
    approvalRate: 71,
    averageAward: 3750,
    notes: "High demand from second-year students"
  },
  {
    id: "alloc-2",
    categoryId: "cat-1",
    educationLevel: "College",
    description: "Diploma program bursaries",
    amount: 800000,
    allocatedAmount: 600000,
    disbursedAmount: 450000,
    remainingAmount: 350000,
    academicYear: "2024/2025",
    createdAt: "2024-01-22T14:30:00.000Z",
    createdBy: "Finance Officer",
    updatedAt: "2024-05-15T11:20:00.000Z",
    updatedBy: "Disbursement Officer",
    status: "active",
    beneficiaries: 120,
    applications: 180,
    approvalRate: 67,
    averageAward: 3750,
    notes: "Includes technical college programs"
  },
  {
    id: "alloc-3",
    categoryId: "cat-1",
    educationLevel: "TVET",
    description: "Vocational training support",
    amount: 500000,
    allocatedAmount: 300000,
    disbursedAmount: 200000,
    remainingAmount: 300000,
    academicYear: "2024/2025",
    createdAt: "2024-02-05T09:15:00.000Z",
    createdBy: "Finance Officer",
    updatedAt: "2024-05-20T14:00:00.000Z",
    updatedBy: "Disbursement Officer",
    status: "active",
    beneficiaries: 80,
    applications: 150,
    approvalRate: 53,
    averageAward: 2500,
    notes: "Focus on trades programs"
  },
  {
    id: "alloc-4",
    categoryId: "cat-1",
    educationLevel: "Secondary",
    description: "High school bursary program",
    amount: 300000,
    allocatedAmount: 200000,
    disbursedAmount: 150000,
    remainingAmount: 150000,
    academicYear: "2024/2025",
    createdAt: "2024-02-10T11:45:00.000Z",
    createdBy: "Finance Officer",
    updatedAt: "2024-05-10T10:30:00.000Z",
    updatedBy: "Disbursement Officer",
    status: "active",
    beneficiaries: 60,
    applications: 120,
    approvalRate: 50,
    averageAward: 2500,
    notes: "For county schools only"
  },
  {
    id: "alloc-5",
    categoryId: "cat-2",
    educationLevel: "University",
    description: "Academic excellence scholarships",
    amount: 1500000,
    allocatedAmount: 1200000,
    disbursedAmount: 900000,
    remainingAmount: 600000,
    academicYear: "2024/2025",
    createdAt: "2024-01-25T13:00:00.000Z",
    createdBy: "Scholarship Committee",
    updatedAt: "2024-06-05T16:15:00.000Z",
    updatedBy: "Scholarship Officer",
    status: "active",
    beneficiaries: 90,
    applications: 300,
    approvalRate: 30,
    averageAward: 10000,
    notes: "Minimum GPA 3.7 requirement"
  },
  {
    id: "alloc-6",
    categoryId: "cat-2",
    educationLevel: "College",
    description: "Merit-based diploma awards",
    amount: 600000,
    allocatedAmount: 400000,
    disbursedAmount: 300000,
    remainingAmount: 300000,
    academicYear: "2024/2025",
    createdAt: "2024-02-01T10:30:00.000Z",
    createdBy: "Scholarship Committee",
    updatedAt: "2024-05-25T14:45:00.000Z",
    updatedBy: "Scholarship Officer",
    status: "active",
    beneficiaries: 40,
    applications: 150,
    approvalRate: 27,
    averageAward: 7500,
    notes: "Includes leadership criteria"
  },
  {
    id: "alloc-7",
    categoryId: "cat-2",
    educationLevel: "TVET",
    description: "Skills competition winners",
    amount: 400000,
    allocatedAmount: 200000,
    disbursedAmount: 150000,
    remainingAmount: 250000,
    academicYear: "2024/2025",
    createdAt: "2024-02-15T14:00:00.000Z",
    createdBy: "Scholarship Committee",
    updatedAt: "2024-05-15T12:30:00.000Z",
    updatedBy: "Scholarship Officer",
    status: "active",
    beneficiaries: 20,
    applications: 80,
    approvalRate: 25,
    averageAward: 7500,
    notes: "Annual skills competition awards"
  },
  {
    id: "alloc-8",
    categoryId: "cat-3",
    educationLevel: "University",
    description: "Crisis support for university students",
    amount: 300000,
    allocatedAmount: 200000,
    disbursedAmount: 150000,
    remainingAmount: 150000,
    academicYear: "2024/2025",
    createdAt: "2024-03-01T09:00:00.000Z",
    createdBy: "Student Affairs",
    updatedAt: "2024-06-10T11:00:00.000Z",
    updatedBy: "Counseling Office",
    status: "active",
    beneficiaries: 45,
    applications: 90,
    approvalRate: 50,
    averageAward: 3333,
    notes: "Documented emergencies only"
  },
  {
    id: "alloc-9",
    categoryId: "cat-3",
    educationLevel: "College",
    description: "Emergency loans for college students",
    amount: 150000,
    allocatedAmount: 100000,
    disbursedAmount: 75000,
    remainingAmount: 75000,
    academicYear: "2024/2025",
    createdAt: "2024-03-10T11:30:00.000Z",
    createdBy: "Student Affairs",
    updatedAt: "2024-05-30T10:15:00.000Z",
    updatedBy: "Counseling Office",
    status: "active",
    beneficiaries: 25,
    applications: 60,
    approvalRate: 42,
    averageAward: 3000,
    notes: "Repayable within 12 months"
  },
  {
    id: "alloc-10",
    categoryId: "cat-4",
    educationLevel: "University",
    description: "Undergraduate research grants",
    amount: 1200000,
    allocatedAmount: 600000,
    disbursedAmount: 400000,
    remainingAmount: 800000,
    academicYear: "2024/2025",
    createdAt: "2024-03-15T13:45:00.000Z",
    createdBy: "Research Office",
    updatedAt: "2024-06-12T14:30:00.000Z",
    updatedBy: "Research Coordinator",
    status: "active",
    beneficiaries: 60,
    applications: 200,
    approvalRate: 30,
    averageAward: 6667,
    notes: "Faculty-supervised projects"
  },
  {
    id: "alloc-11",
    categoryId: "cat-4",
    educationLevel: "College",
    description: "Applied research funding",
    amount: 500000,
    allocatedAmount: 200000,
    disbursedAmount: 100000,
    remainingAmount: 400000,
    academicYear: "2024/2025",
    createdAt: "2024-04-01T10:15:00.000Z",
    createdBy: "Research Office",
    updatedAt: "2024-06-05T15:00:00.000Z",
    updatedBy: "Research Coordinator",
    status: "active",
    beneficiaries: 20,
    applications: 80,
    approvalRate: 25,
    averageAward: 5000,
    notes: "Industry collaboration focus"
  },
  {
    id: "alloc-12",
    categoryId: "cat-2",
    educationLevel: "Secondary",
    description: "High school merit scholarships",
    amount: 200000,
    allocatedAmount: 0,
    disbursedAmount: 0,
    remainingAmount: 200000,
    academicYear: "2024/2025",
    createdAt: "2024-04-10T14:00:00.000Z",
    createdBy: "Scholarship Committee",
    updatedAt: "2024-04-10T14:00:00.000Z",
    updatedBy: "Scholarship Committee",
    status: "pending",
    beneficiaries: 0,
    applications: 0,
    approvalRate: 0,
    averageAward: 0,
    notes: "Launching in term 3"
  },
  {
    id: "alloc-13",
    categoryId: "cat-1",
    educationLevel: "University",
    description: "Postgraduate bursaries",
    amount: 600000,
    allocatedAmount: 400000,
    disbursedAmount: 200000,
    remainingAmount: 400000,
    academicYear: "2024/2025",
    createdAt: "2024-05-01T09:30:00.000Z",
    createdBy: "Graduate School",
    updatedAt: "2024-06-15T10:45:00.000Z",
    updatedBy: "Graduate Officer",
    status: "active",
    beneficiaries: 40,
    applications: 120,
    approvalRate: 33,
    averageAward: 5000,
    notes: "Masters and PhD candidates"
  },
  {
    id: "alloc-14",
    categoryId: "cat-3",
    educationLevel: "TVET",
    description: "Equipment replacement fund",
    amount: 200000,
    allocatedAmount: 0,
    disbursedAmount: 0,
    remainingAmount: 200000,
    academicYear: "2024/2025",
    createdAt: "2024-05-15T11:00:00.000Z",
    createdBy: "Vocational Director",
    updatedAt: "2024-05-15T11:00:00.000Z",
    updatedBy: "Vocational Director",
    status: "pending",
    beneficiaries: 0,
    applications: 0,
    approvalRate: 0,
    averageAward: 0,
    notes: "For workshop equipment damage"
  },
  {
    id: "alloc-15",
    categoryId: "cat-4",
    educationLevel: "TVET",
    description: "Innovation challenge fund",
    amount: 300000,
    allocatedAmount: 0,
    disbursedAmount: 0,
    remainingAmount: 300000,
    academicYear: "2024/2025",
    createdAt: "2024-06-01T14:20:00.000Z",
    createdBy: "Innovation Hub",
    updatedAt: "2024-06-01T14:20:00.000Z",
    updatedBy: "Innovation Hub",
    status: "pending",
    beneficiaries: 0,
    applications: 0,
    approvalRate: 0,
    averageAward: 0,
    notes: "Student innovation competition"
  }
];

// Mock API calls
const fetchFundAllocations = async (): Promise<FundAllocation[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFundAllocations);
    }, 500);
  });
};

const fetchFundCategories = async (): Promise<FundCategory[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockFundCategories);
    }, 500);
  });
};

const createAllocationAPI = async (allocation: Omit<FundAllocation, 'id'>): Promise<FundAllocation> => {
  // this would be an actual API call
  return new Promise(resolve => {
    setTimeout(() => {
      const newAllocation: FundAllocation = {
        ...allocation,
        id: `alloc-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "active"
      };
      resolve(newAllocation);
    }, 800);
  });
};

const updateAllocationAPI = async (id: string, updates: Partial<FundAllocation>): Promise<FundAllocation> => {
  // In a real app, this would be an actual API call
  return new Promise(resolve => {
    setTimeout(() => {
      const updatedAllocation = {
        ...mockFundAllocations.find(a => a.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      resolve(updatedAllocation);
    }, 800);
  });
};

const deleteAllocationAPI = async (id: string): Promise<void> => {
  // In a real app, this would be an actual API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};



const AllocationManagement = () => {
  const location = useLocation();
  const [isCreateAllocationOpen, setIsCreateAllocationOpen] = useState(false);
  const [isEditAllocationOpen, setIsEditAllocationOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FundCategory | null>(null);
  const [fundAllocations, setFundAllocations] = useState<FundAllocation[]>([]);
  const [fundCategories, setFundCategories] = useState<FundCategory[]>([]);
  const [filteredLevel, setFilteredLevel] = useState<EducationLevelType | "all">("all");
  const [filteredCategory, setFilteredCategory] = useState<string>("all");
  const [expandedAllocationId, setExpandedAllocationId] = useState<string | null>(null);
  const [selectedAllocation, setSelectedAllocation] = useState<FundAllocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state for new allocation
  const [newAllocation, setNewAllocation] = useState({
    categoryId: "",
    educationLevel: "" as EducationLevelType | "",
    amount: "",
    description: "",
    academicYear: "2024"
  });

  // Form state for edit allocation
  const [editAllocation, setEditAllocation] = useState({
    id: "",
    description: "",
    amount: "",
    status: "active" as AllocationStatus
  });

  // Check if a fundId was passed in the location state
  const fundId = location.state?.fundId;

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

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [allocations, categories] = await Promise.all([
          fetchFundAllocations(),
          fetchFundCategories()
        ]);
        setFundAllocations(allocations);
        setFundCategories(categories);
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle allocation details
  const toggleAllocationDetails = (allocationId: string) => {
    setExpandedAllocationId(expandedAllocationId === allocationId ? null : allocationId);
  };

  // Get filtered allocations based on filters and search
  const getFilteredAllocations = () => {
    return fundAllocations.filter(allocation => {
      const categoryMatch = filteredCategory === "all" || allocation.categoryId === filteredCategory;
      const levelMatch = filteredLevel === "all" || allocation.educationLevel === filteredLevel;
      
      // Search matches description or education level
      const searchMatch = searchQuery === "" || 
        allocation.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
        allocation.educationLevel.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && levelMatch && searchMatch;
    });
  };

  // Get category by ID
  const getCategoryById = (categoryId: string) => {
    return fundCategories.find(category => category.id === categoryId);
  };

  // Handle create allocation form changes
  const handleNewAllocationChange = (field: keyof typeof newAllocation, value: string) => {
    setNewAllocation(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'categoryId') {
      const category = fundCategories.find(cat => cat.id === value);
      setSelectedCategory(category || null);
    }
  };

  // Handle edit allocation form changes
  const handleEditAllocationChange = (field: keyof typeof editAllocation, value: string) => {
    setEditAllocation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle create allocation submission
  const handleCreateAllocation = async () => {
    if (!newAllocation.categoryId || !newAllocation.educationLevel || !newAllocation.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(newAllocation.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const category = fundCategories.find(cat => cat.id === newAllocation.categoryId);
    if (!category) {
      toast.error("Selected category not found");
      return;
    }

    // Check if allocation for this category and level already exists
    const existingAllocation = fundAllocations.find(
      alloc => alloc.categoryId === newAllocation.categoryId && 
              alloc.educationLevel === newAllocation.educationLevel
    );
    
    if (existingAllocation) {
      toast.error(`An allocation for ${newAllocation.educationLevel} ${category.name} already exists`);
      return;
    }

    // Check if amount exceeds category remaining amount
    if (amount > category.remainingAmount) {
      toast.error(`The amount exceeds the remaining amount in the ${category.name} category`);
      return;
    }

    try {
      setIsLoading(true);
      const createdAllocation = await createAllocationAPI({
        categoryId: newAllocation.categoryId,
        educationLevel: newAllocation.educationLevel as EducationLevelType,
        description: newAllocation.description,
        amount,
        allocatedAmount: 0,
        disbursedAmount: 0,
        remainingAmount: amount,
        academicYear: newAllocation.academicYear,
        createdAt: new Date().toISOString(),
        createdBy: "Current User", // Would come from auth context in real app
        status: "active",
        beneficiaries: 0,
        applications: 0,
        approvalRate: 0,
        averageAward: 0
      });

      // Update the category's remaining amount
      const updatedCategories = fundCategories.map(cat => {
        if (cat.id === newAllocation.categoryId) {
          return {
            ...cat,
            remainingAmount: cat.remainingAmount - amount
          };
        }
        return cat;
      });

      setFundAllocations([...fundAllocations, createdAllocation]);
      setFundCategories(updatedCategories);
      setIsCreateAllocationOpen(false);
      resetAllocationForm();
      toast.success(`New Allocation for ${newAllocation.educationLevel} ${category.name} created successfully`);
    } catch (error) {
      toast.error("Failed to create allocation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit allocation submission
  const handleEditAllocation = async () => {
    if (!editAllocation.description || !editAllocation.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(editAllocation.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const updatedAllocation = await updateAllocationAPI(editAllocation.id, {
        description: editAllocation.description,
        amount,
        status: editAllocation.status
      });

      setFundAllocations(fundAllocations.map(alloc => 
        alloc.id === updatedAllocation.id ? updatedAllocation : alloc
      ));

      setIsEditAllocationOpen(false);
      setSelectedAllocation(null);
      toast.success("Allocation updated successfully");
    } catch (error) {
      toast.error("Failed to update allocation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete allocation
  const handleDeleteAllocation = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteAllocationAPI(id);
      
      const deletedAllocation = fundAllocations.find(a => a.id === id);
      if (deletedAllocation) {
        // Return the amount to the category's remaining amount
        const updatedCategories = fundCategories.map(cat => {
          if (cat.id === deletedAllocation.categoryId) {
            return {
              ...cat,
              remainingAmount: cat.remainingAmount + deletedAllocation.amount
            };
          }
          return cat;
        });

        setFundCategories(updatedCategories);
      }

      setFundAllocations(fundAllocations.filter(alloc => alloc.id !== id));
      toast.success("Allocation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete allocation");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle archive allocation
  const handleArchiveAllocation = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedAllocation = await updateAllocationAPI(id, { status: "archived" });
      
      setFundAllocations(fundAllocations.map(alloc => 
        alloc.id === id ? updatedAllocation : alloc
      ));
      
      toast.success("Allocation archived successfully");
    } catch (error) {
      toast.error("Failed to archive allocation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle activate allocation
  const handleActivateAllocation = async (id: string) => {
    try {
      setIsLoading(true);
      const updatedAllocation = await updateAllocationAPI(id, { status: "active" });
      
      setFundAllocations(fundAllocations.map(alloc => 
        alloc.id === id ? updatedAllocation : alloc
      ));
      
      toast.success("Allocation activated successfully");
    } catch (error) {
      toast.error("Failed to activate allocation");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset allocation form
  const resetAllocationForm = () => {
    setNewAllocation({
      categoryId: "",
      educationLevel: "",
      amount: "",
      description: "",
      academicYear: "2024"
    });
    setSelectedCategory(null);
  };

  // Open edit dialog
  const openEditDialog = (allocation: FundAllocation) => {
    setSelectedAllocation(allocation);
    setEditAllocation({
      id: allocation.id,
      description: allocation.description,
      amount: allocation.amount.toString(),
      status: allocation.status
    });
    setIsEditAllocationOpen(true);
  };

  // Calculate utilization percentage
  const calculateUtilizationPercentage = (allocation: FundAllocation) => {
    if (allocation.amount === 0) return 0;
    return Math.round((allocation.disbursedAmount / allocation.amount) * 100);
  };

  // Calculate allocation percentage
  const calculateAllocationPercentage = (allocation: FundAllocation) => {
    if (allocation.amount === 0) return 0;
    return Math.round((allocation.allocatedAmount / allocation.amount) * 100);
  };

  // Calculate disbursement percentage
  const calculateDisbursementPercentage = (allocation: FundAllocation) => {
    if (allocation.allocatedAmount === 0) return 0;
    return Math.round((allocation.disbursedAmount / allocation.allocatedAmount) * 100);
  };

  // Export allocations to CSV
  const exportToCSV = () => {
    const headers = [
      "Education Level",
      "Category",
      "Amount",
      "Allocated",
      "Disbursed",
      "Remaining",
      "Status",
      "Created At",
      "Description"
    ].join(',');

    const rows = fundAllocations.map(allocation => {
      const category = getCategoryById(allocation.categoryId);
      return [
        allocation.educationLevel,
        category?.name || "Unknown",
        allocation.amount,
        allocation.allocatedAmount,
        allocation.disbursedAmount,
        allocation.remainingAmount,
        allocation.status,
        formatDate(allocation.createdAt),
        allocation.description
      ].join(',');
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `allocations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [allocations, categories] = await Promise.all([
        fetchFundAllocations(),
        fetchFundCategories()
      ]);
      setFundAllocations(allocations);
      setFundCategories(categories);
      toast.success("Data refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Allocation Management">
      <div className="space-y-6 lg:-mx-[80px] mt-[-4rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-l-4 border-l-green-500 pl-2 rounded-none h-20 border-b-2">
          <div className="-mt-5">
            <h1 className="text-xl font-bold text-blue-800">Funds Allocation Management</h1>
            <p className="text-muted-foreground  text-sm -mt-1">
              Manage and track Fund Allocations by Education Level
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateAllocationOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Allocation
            </Button>
          </div>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader className="border-l-4 border-l-lime-500 rounded-none border-b-2 mb-6 ">
            <CardTitle className="text-xl text-blue-800 font-bold -mb-2">Allocation Overview</CardTitle>
            <CardDescription>
              Summary of Fund Allocations by Category & Education Level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-blue-50 border-blue-100 border-l-4 border-l-blue-500 hover:bg-blue-100 h-28">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Allocated</p>
                      <p className="text-xl font-bold text-blue-700">
                        {formatCurrency(fundAllocations.reduce((sum, allocation) => sum + allocation.amount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Layers className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-100 border-l-4 border-l-green-500 hover:bg-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Disbursed</p>
                      <p className="text-xl font-bold text-green-700">
                        {formatCurrency(fundAllocations.reduce((sum, allocation) => sum + allocation.disbursedAmount, 0))}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowDown className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-100 border-l-4 border-l-purple-500 hover:bg-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Bursary Allocated</p>
                      <p className="text-xl font-bold text-purple-700">
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

              <Card className="bg-amber-50 border-amber-100 border-l-4 border-l-amber-500 hover:bg-amber-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Scholarship Allocated</p>
                      <p className="text-xl font-bold text-amber-700">
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
              <h3 className="text-xl font-bold mb-2 text-black">Allocation by Education Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bursary Distribution */}
                <Card className="bg-gray-50">
                  <CardHeader className=" border-l-4 border-l-blue-500 pl-2 border-b-2 mb-4 rounded-none">
                    <CardTitle className="text-lg text-blue-800  font-bold">Bursary Distribution</CardTitle>
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
                <Card className="bg-gray-50">
                  <CardHeader className=" text-green-600 border-l-4 border-l-green-500 pl-2 border-b-2 mb-4 rounded-none">
                    <CardTitle className="text-lg font-bold">Scholarship Distribution</CardTitle>
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
          <CardHeader className="border-l-4 border-l-lime-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold text-blue-800 -mb-1">Fund Allocations | FY-2024-2025-ALLOC-0011</CardTitle>
                <CardDescription>
                  View and manage all Funds Allocations
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Allocations"
                    className="pl-9 w-[400px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
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
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader className="border-t-2">
                  <TableRow>
                    <TableHead className="text-nowrap">Education Level</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Allocated</TableHead>
                    <TableHead>Disbursed</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredAllocations().map(allocation => {
                    const category = getCategoryById(allocation.categoryId);
                    const isExpanded = expandedAllocationId === allocation.id;
                    
                    return (
                      <>
                        <TableRow key={allocation.id}>
                          <TableCell>
                            <div className="font-medium">{allocation.educationLevel}</div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">{allocation.description}</div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <Badge variant="outline" className={
                              category?.name === "Bursary" ? "border-blue-200 text-blue-800 bg-blue-100" : 
                              category?.name === "Scholarship" ? "border-green-200 text-green-800 bg-green-100" :
                              "border-gray-200 text-gray-800 bg-gray-100"
                            }>
                              {category?.name || "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(allocation.amount)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-2">{formatCurrency(allocation.allocatedAmount)}</span>
                              {allocation.allocatedAmount > 0 && (
                                <Badge className="text-xs bg-green-200 text-green-700" variant="outline">
                                  {calculateAllocationPercentage(allocation)}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="mr-2">{formatCurrency(allocation.disbursedAmount)}</span>
                              {allocation.disbursedAmount > 0 && (
                                <Badge className="text-xs bg-blue-200 text-blue-700" variant="outline">
                                  {calculateDisbursementPercentage(allocation)}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(allocation.remainingAmount)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                allocation.status === "active" ? "default" : 
                                allocation.status === "archived" ? "secondary" : "destructive"
                              } 
                              className="capitalize"
                            >
                              {allocation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-nowrap">{formatDate(allocation.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleAllocationDetails(allocation.id)}
                              >
                                <Search className="h-4 w-4 mr-1" />
                            {isExpanded ? "Hide Details" : "View Details"}
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDown className="h-4 w-4 ml-1" />
                            )}
                          </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditDialog(allocation)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  {allocation.status === "active" ? (
                                    <DropdownMenuItem onClick={() => handleArchiveAllocation(allocation.id)}>
                                      <Archive className="h-4 w-4 mr-2" />
                                      Archive
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleActivateAllocation(allocation.id)}>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Activate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => handleDeleteAllocation(allocation.id)}
                                    disabled={isDeleting}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                        </TableCell>
                      </TableRow>
                      
                      {isExpanded && (
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableCell colSpan={9} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* Allocation Details */}
                              <Card className="border-l-4 border-l-blue-500">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex items-center">
                                    <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                                    Allocation Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Academic Year</span>
                                      <span className="font-medium">{allocation.academicYear}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Created By</span>
                                      <span className="font-medium">{allocation.createdBy}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Created On</span>
                                      <span className="font-medium">{formatDate(allocation.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Description</span>
                                      <span className="font-medium text-right max-w-[200px]">{allocation.description}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Financial Summary */}
                              <Card className="border-l-4 border-l-green-500">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex items-center">
                                    <Wallet className="h-5 w-5 mr-2 text-green-500" />
                                    Financial Summary
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Total Amount</span>
                                      <span className="font-medium">{formatCurrency(allocation.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Allocated</span>
                                      <span className="font-medium">
                                        {formatCurrency(allocation.allocatedAmount)} ({Math.round((allocation.allocatedAmount / allocation.amount) * 100)}%)
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Disbursed</span>
                                      <span className="font-medium">
                                        {formatCurrency(allocation.disbursedAmount)} ({Math.round((allocation.disbursedAmount / allocation.amount) * 100)}%)
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Remaining</span>
                                      <span className="font-medium">
                                        {formatCurrency(allocation.remainingAmount)} ({Math.round((allocation.remainingAmount / allocation.amount) * 100)}%)
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Beneficiary Stats */}
                              <Card className="border-l-4 border-l-purple-500">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex items-center">
                                    <User className="h-5 w-5 mr-2 text-purple-500" />
                                    Beneficiary Stats
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Total Beneficiaries</span>
                                      <span className="font-medium">{allocation.beneficiaries}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Applications Received</span>
                                      <span className="font-medium">{allocation.applications}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Approval Rate</span>
                                      <span className="font-medium">{allocation.approvalRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-500">Average Award</span>
                                      <span className="font-medium">{formatCurrency(allocation.averageAward)}</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              {/* Utilization Metrics */}
                              <Card className="border-l-4 border-l-amber-500">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg flex items-center">
                                    <Percent className="h-5 w-5 mr-2 text-amber-500" />
                                    Utilization Metrics
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Allocation Utilization</span>
                                        <span>{Math.round((allocation.allocatedAmount / allocation.amount) * 100)}%</span>
                                      </div>
                                      <Progress value={(allocation.allocatedAmount / allocation.amount) * 100} className="h-2" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Disbursement Rate</span>
                                        <span>{Math.round((allocation.disbursedAmount / allocation.allocatedAmount) * 100)}%</span>
                                      </div>
                                      <Progress value={(allocation.disbursedAmount / allocation.allocatedAmount) * 100} className="h-2" />
                                    </div>
                                    <div>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Funds Utilization</span>
                                        <span>{Math.round((allocation.disbursedAmount / allocation.amount) * 100)}%</span>
                                      </div>
                                      <Progress value={(allocation.disbursedAmount / allocation.amount) * 100} className="h-2" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Allocation Dialog */}
      <Dialog open={isCreateAllocationOpen} onOpenChange={setIsCreateAllocationOpen}>
        <DialogContent className="lg:max-w-6xl sm:max-w-3xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-red-500 pl-2 rounded h-16 border-b-2">
            <DialogTitle className="text-blue-800 font-bold -mb-1 mt-2">Create Fund Allocation</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Allocate Funds to Specific Education Levels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Fund Category *</Label>
              <Select
                value={newAllocation.categoryId}
                onValueChange={(value) => handleNewAllocationChange('categoryId', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {fundCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} - {formatCurrency(category.remainingAmount)} remaining (Balance)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-lg font-bold text-blue-800 mb-4">Category Details</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="border-l-4 border-l-blue-500 pl-2">
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="font-medium text-blue-500">{formatCurrency(selectedCategory.amount)}</p>
                  </div>
                  <div className="border-l-4 border-l-orange-500 pl-2">
                    <p className="text-xs text-gray-500">Remaining</p>
                    <p className="font-medium text-orange-500">{formatCurrency(selectedCategory.remainingAmount)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="level">Education Level *</Label>
              <Select
                value={newAllocation.educationLevel}
                onValueChange={(value) => handleNewAllocationChange('educationLevel', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Education Level for Allocation" />
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
              <Label htmlFor="amount">Allocation Amount (KES) *</Label>
              <Input
                id="amount"
                placeholder="e.g., 1000000"
                type="number"
                value={newAllocation.amount}
                onChange={(e) => handleNewAllocationChange('amount', e.target.value)}
                disabled={isLoading}
              />
              {selectedCategory && newAllocation.amount && !isNaN(parseFloat(newAllocation.amount)) && (
                <div className="text-xs flex justify-between mt-1">
                  <span>
                    {parseFloat(newAllocation.amount) > selectedCategory.remainingAmount ? (
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
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={newAllocation.academicYear}
                onChange={(e) => handleNewAllocationChange('academicYear', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter allocation description..."
                value={newAllocation.description}
                onChange={(e) => handleNewAllocationChange('description', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateAllocationOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAllocation}
              disabled={
                !newAllocation.categoryId || 
                !newAllocation.educationLevel || 
                !newAllocation.amount ||
                isLoading
              }
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              Create Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Allocation Dialog */}
      <Dialog open={isEditAllocationOpen} onOpenChange={setIsEditAllocationOpen}>
        <DialogContent className="lg:max-w-6xl sm:max-w-3xl bg-gray-50">
          <DialogHeader className="border-l-4 border-l-blue-500 pl-2 rounded h-16 border-b-2">
            <DialogTitle className="text-blue-800 font-bold -mb-1 mt-2">
              Edit Allocation: {selectedAllocation?.educationLevel} {selectedAllocation && getCategoryById(selectedAllocation.categoryId)?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update allocation details and status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount (KES) *</Label>
                <Input
                  id="edit-amount"
                  placeholder="e.g., 1000000"
                  type="number"
                  value={editAllocation.amount}
                  onChange={(e) => handleEditAllocationChange('amount', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={editAllocation.status}
                  onValueChange={(value) => handleEditAllocationChange('status', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter allocation description..."
                value={editAllocation.description}
                onChange={(e) => handleEditAllocationChange('description', e.target.value)}
                disabled={isLoading}
              />
            </div>

            {selectedAllocation && (
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-lg font-bold text-blue-800 mb-4">Current Utilization</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 border-l-4 border-l-blue-500 pl-2">
                    <p className="text-sm text-gray-500 -mb-1">Allocated Amount</p>
                    <p className="font-medium">
                      {formatCurrency(selectedAllocation.allocatedAmount)} ({calculateAllocationPercentage(selectedAllocation)}%)
                    </p>
                    <Progress value={calculateAllocationPercentage(selectedAllocation)} className="h-2" />
                  </div>
                  <div className="space-y-2 border-l-4 border-l-green-500 pl-2">
                    <p className="text-sm text-gray-500">Disbursed Amount</p>
                    <p className="font-medium text-green-600">
                      {formatCurrency(selectedAllocation.disbursedAmount)} ({calculateDisbursementPercentage(selectedAllocation)}%)
                    </p>
                    <Progress value={calculateDisbursementPercentage(selectedAllocation)} className="h-2" />
                  </div>
                  <div className="space-y-2 border-l-4  border-l-cyan-500 pl-2">
                    <p className="text-sm text-gray-500">Funds Utilization</p>
                    <p className="font-medium text-cyan-700">
                      {formatCurrency(selectedAllocation.disbursedAmount)} ({calculateUtilizationPercentage(selectedAllocation)}%)
                    </p>
                    <Progress value={calculateUtilizationPercentage(selectedAllocation)} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditAllocationOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditAllocation}
              disabled={
                !editAllocation.description || 
                !editAllocation.amount ||
                isLoading
              }
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Edit className="h-4 w-4 mr-2" />
              )}
              Update Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AllocationManagement;