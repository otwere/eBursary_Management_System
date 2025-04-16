
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Application } from "@/types/auth";
import { formatCurrency } from "@/utils/format";

interface BulkAllocateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedApplications: string[];
  applications: Application[];
  allocationNotes: string;
  setAllocationNotes: (notes: string) => void;
  allocatedFundSource: string;
  setAllocatedFundSource: (source: string) => void;
  handleBulkAllocate: () => void;
}

const BulkAllocateDialog: React.FC<BulkAllocateDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedApplications,
  applications,
  allocationNotes,
  setAllocationNotes,
  allocatedFundSource,
  setAllocatedFundSource,
  handleBulkAllocate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Allocate Funds</DialogTitle>
          <DialogDescription>
            Allocate funds for {selectedApplications.length} selected applications
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Selected Applications</Label>
            <ScrollArea className="h-40 border rounded-md p-2">
              <div className="space-y-2">
                {selectedApplications.map((appId) => {
                  const app = applications.find((a) => a.id === appId);
                  return app ? (
                    <div key={app.id} className="flex justify-between text-sm">
                      <span>{app.studentName}</span>
                      <span className="font-medium">{formatCurrency(app.requestedAmount)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-amount">Total Amount</Label>
            <Input
              id="total-amount"
              value={formatCurrency(
                applications
                  .filter((app) => selectedApplications.includes(app.id))
                  .reduce((sum, app) => sum + app.requestedAmount, 0)
              )}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-fund-source">Fund Source</Label>
            <Select
              value={allocatedFundSource}
              onValueChange={setAllocatedFundSource}
            >
              <SelectTrigger id="bulk-fund-source">
                <SelectValue placeholder="Select fund source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular Fund</SelectItem>
                <SelectItem value="Special Needs">Special Needs Fund</SelectItem>
                <SelectItem value="Emergency">Emergency Fund</SelectItem>
                <SelectItem value="Scholarship">Scholarship Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-allocation-notes">Notes</Label>
            <Textarea
              id="bulk-allocation-notes"
              placeholder="Add any notes about this bulk allocation"
              value={allocationNotes}
              onChange={(e) => setAllocationNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleBulkAllocate}>Allocate Funds</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAllocateDialog;
