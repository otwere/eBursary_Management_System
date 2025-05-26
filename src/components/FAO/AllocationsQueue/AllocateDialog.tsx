
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Application } from "@/types/auth";
import { formatCurrency } from "@/utils/format";

interface AllocateDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedApplication: Application | null;
  allocationAmount: number;
  setAllocationAmount: (amount: number) => void;
  allocationNotes: string;
  setAllocationNotes: (notes: string) => void;
  allocatedFundSource: string;
  setAllocatedFundSource: (source: string) => void;
  handleAllocate: () => void;
}

const AllocateDialog: React.FC<AllocateDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedApplication,
  allocationAmount,
  setAllocationAmount,
  allocationNotes,
  setAllocationNotes,
  allocatedFundSource,
  setAllocatedFundSource,
  handleAllocate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="lg:max-w-5xl sm:max-w-2xl bg-gray-50">
        <DialogHeader className="border-l-4 border-l-lime-500 h-16 rounded pl-2 border-b-2">
          <DialogTitle className="text-blue-800 font-bold -mb-1 mt-2">Allocate Funds</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Allocate Funds for Application No : {selectedApplication?.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="student-name">Student</Label>
            <Input
              id="student-name"
              value={selectedApplication?.studentName || ""}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              value={selectedApplication?.institutionName || ""}
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requested-amount">Requested Amount</Label>
              <Input
                id="requested-amount"
                value={formatCurrency(selectedApplication?.requestedAmount || 0)}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allocation-amount">Allocation Amount</Label>
              <Input
                id="allocation-amount"
                type="number"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fund-source">Fund Source</Label>
            <Select
              value={allocatedFundSource}
              onValueChange={setAllocatedFundSource}
            >
              <SelectTrigger id="fund-source">
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
            <Label htmlFor="allocation-notes">Notes</Label>
            <Textarea
              id="allocation-notes"
              placeholder="Add any notes about this allocation"
              value={allocationNotes}
              onChange={(e) => setAllocationNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAllocate}>Allocate Funds</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllocateDialog;
