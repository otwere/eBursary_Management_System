
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Import refactored components
import StatCards from "@/components/FAO/AllocationsQueue/StatCards";
import FilterControls from "@/components/FAO/AllocationsQueue/FilterControls";
import ApplicationsTable from "@/components/FAO/AllocationsQueue/ApplicationsTable";
import AllocateDialog from "@/components/FAO/AllocationsQueue/AllocateDialog";
import BulkAllocateDialog from "@/components/FAO/AllocationsQueue/BulkAllocateDialog";
import { useAllocationsQueue } from "@/components/FAO/AllocationsQueue/hooks/useAllocationsQueue";

const AllocationsQueue = () => {
  const {
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
    applications,
    institutions,
    educationLevels,
    fundCategories,
    handleAllocate,
    handleBulkAllocate,
    handleSelectApplication,
    handleSelectAll,
    openAllocateDialog
  } = useAllocationsQueue();

  return (
    <DashboardLayout title="Funds Approval & Allocation - Dashboard">
      <div className="p-1 lg:-mx-[85px] -mt-[4rem]">
        <div className="flex justify-between items-center mb-10 border-b-2">
          <div className="border-l-4 border-l-green-500 pl-2 rounded mb-4 h-16 w-full">
            <h1 className="text-xl font-bold text-blue-800 mt-1 -mb-1">Allocations Queue</h1>
            <p className="text-muted-foreground text-sm">Manage Approve & Allocate Funds for Applicants</p>
          </div>
          {selectedApplications.length > 0 && (
            <Button onClick={() => setIsBulkAllocateDialogOpen(true)}>
              <Check className="h-4 w-4 mr-2" />
              Allocate Selected ({selectedApplications.length})
            </Button>
          )}
        </div>

        <StatCards stats={applicationsStats} />

        <FilterControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedInstitution={selectedInstitution}
          setSelectedInstitution={setSelectedInstitution}
          selectedEducationLevel={selectedEducationLevel}
          setSelectedEducationLevel={setSelectedEducationLevel}
          selectedFundCategory={selectedFundCategory}
          setSelectedFundCategory={setSelectedFundCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          institutions={institutions}
          educationLevels={educationLevels}
          fundCategories={fundCategories}
        />

        <Card>
          <CardHeader className="border-l-4 border-l-green-500 rounded mb-2">
            <CardTitle className="text-xl font-bold text-blue-800 -mb-2">Applications for Approval & Allocation</CardTitle>
            <CardDescription>
              {filteredApplications.length} Applications found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationsTable 
              applications={filteredApplications}
              selectedApplications={selectedApplications}
              handleSelectApplication={handleSelectApplication}
              handleSelectAll={handleSelectAll}
              openAllocateDialog={openAllocateDialog}
            />
          </CardContent>
        </Card>

        <AllocateDialog 
          isOpen={isAllocateDialogOpen}
          setIsOpen={setIsAllocateDialogOpen}
          selectedApplication={selectedApplication}
          allocationAmount={allocationAmount}
          setAllocationAmount={setAllocationAmount}
          allocationNotes={allocationNotes}
          setAllocationNotes={setAllocationNotes}
          allocatedFundSource={allocatedFundSource}
          setAllocatedFundSource={setAllocatedFundSource}
          handleAllocate={handleAllocate}
        />

        <BulkAllocateDialog 
          isOpen={isBulkAllocateDialogOpen}
          setIsOpen={setIsBulkAllocateDialogOpen}
          selectedApplications={selectedApplications}
          applications={applications}
          allocationNotes={allocationNotes}
          setAllocationNotes={setAllocationNotes}
          allocatedFundSource={allocatedFundSource}
          setAllocatedFundSource={setAllocatedFundSource}
          handleBulkAllocate={handleBulkAllocate}
        />
      </div>
    </DashboardLayout>
  );
};

export default AllocationsQueue;
