
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Application, ApplicationStatus } from "@/types/auth";
import { mockApplications } from "@/data/mockData";

export interface ApplicationStats {
  total: number;
  pendingAllocation: number;
  allocatedToday: number;
  totalAmount: number;
}

export const useAllocationsQueue = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [isBulkAllocateDialogOpen, setIsBulkAllocateDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [allocationAmount, setAllocationAmount] = useState<number>(0);
  const [allocationNotes, setAllocationNotes] = useState("");
  const [allocatedFundSource, setAllocatedFundSource] = useState("Regular");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>("all");
  const [selectedFundCategory, setSelectedFundCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("applicationDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [applicationsStats, setApplicationsStats] = useState<ApplicationStats>({
    total: 0,
    pendingAllocation: 0,
    allocatedToday: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const pendingAllocations = mockApplications.filter(
      (app) => app.status === "pending-allocation" || app.status === "approved"
    );
    setApplications(pendingAllocations);
    setFilteredApplications(pendingAllocations);

    const stats = {
      total: pendingAllocations.length,
      pendingAllocation: pendingAllocations.filter(app => app.status === "pending-allocation").length,
      allocatedToday: 0,
      totalAmount: pendingAllocations.reduce((sum, app) => sum + app.requestedAmount, 0),
    };
    setApplicationsStats(stats);
  }, []);

  useEffect(() => {
    let filtered = [...applications];

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.courseOfStudy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedInstitution !== "all") {
      filtered = filtered.filter((app) => app.institutionName === selectedInstitution);
    }

    if (selectedEducationLevel !== "all") {
      filtered = filtered.filter((app) => app.educationLevel === selectedEducationLevel);
    }

    if (selectedFundCategory !== "all") {
      filtered = filtered.filter((app) => app.fundCategory === selectedFundCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === "applicationDate") {
        const dateA = new Date(a.applicationDate).getTime();
        const dateB = new Date(b.applicationDate).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "requestedAmount") {
        return sortDirection === "asc" 
          ? a.requestedAmount - b.requestedAmount 
          : b.requestedAmount - a.requestedAmount;
      } else if (sortBy === "studentName") {
        const nameA = a.studentName || "";
        const nameB = b.studentName || "";
        return sortDirection === "asc" 
          ? nameA.localeCompare(nameB) 
          : nameB.localeCompare(nameA);
      } else if (sortBy === "institutionName") {
        return sortDirection === "asc" 
          ? a.institutionName.localeCompare(b.institutionName) 
          : b.institutionName.localeCompare(a.institutionName);
      }
      return 0;
    });

    setFilteredApplications(filtered);
  }, [
    searchQuery, 
    applications, 
    selectedInstitution, 
    selectedEducationLevel, 
    selectedFundCategory,
    sortBy,
    sortDirection
  ]);

  const handleAllocate = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map((app) => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          status: "allocated" as ApplicationStatus,
          allocationAmount: allocationAmount,
          allocationDate: new Date().toISOString(),
          allocatedBy: "FAO User",
          fundCategory: allocatedFundSource,
          approvedAmount: allocationAmount,
          lastUpdated: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    setFilteredApplications(updatedApplications.filter(app => app.status === "pending-allocation" || app.status === "approved"));
    setSelectedApplication(null);
    setAllocationAmount(0);
    setAllocationNotes("");
    setIsAllocateDialogOpen(false);

    toast.success("Funds Allocated Successfully");
  };

  const handleBulkAllocate = () => {
    const updatedApplications = applications.map((app) => {
      if (selectedApplications.includes(app.id)) {
        return {
          ...app,
          status: "allocated" as ApplicationStatus,
          allocationAmount: app.requestedAmount,
          allocationDate: new Date().toISOString(),
          allocatedBy: "FAO User",
          fundCategory: allocatedFundSource,
          approvedAmount: app.requestedAmount,
          lastUpdated: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    setFilteredApplications(updatedApplications.filter(app => app.status === "pending-allocation" || app.status === "approved"));
    setSelectedApplications([]);
    setAllocationNotes("");
    setIsBulkAllocateDialogOpen(false);

    toast.success(`Bulk allocation completed for ${selectedApplications.length} applications`);
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    }
  };

  const openAllocateDialog = (application: Application) => {
    setSelectedApplication(application);
    setAllocationAmount(application.requestedAmount);
    setIsAllocateDialogOpen(true);
  };

  // Derive metadata from applications
  const institutions = Array.from(new Set(applications.map((app) => app.institutionName)));
  const educationLevels = Array.from(new Set(applications.map((app) => app.educationLevel).filter(Boolean)));
  const fundCategories = Array.from(new Set(applications.map((app) => app.fundCategory).filter(Boolean)));

  return {
    applications,
    filteredApplications,
    selectedApplications,
    searchQuery,
    setSearchQuery,
    isAllocateDialogOpen,
    setIsAllocateDialogOpen,
    isBulkAllocateDialogOpen,
    setIsBulkAllocateDialogOpen,
    selectedApplication,
    allocationAmount,
    setAllocationAmount,
    allocationNotes,
    setAllocationNotes,
    allocatedFundSource,
    setAllocatedFundSource,
    selectedInstitution,
    setSelectedInstitution,
    selectedEducationLevel,
    setSelectedEducationLevel,
    selectedFundCategory,
    setSelectedFundCategory,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    applicationsStats,
    institutions,
    educationLevels,
    fundCategories,
    handleAllocate,
    handleBulkAllocate,
    handleSelectApplication,
    handleSelectAll,
    openAllocateDialog
  };
};
