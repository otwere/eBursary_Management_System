// src/components/FAO/AllocationsQueue/ExportDialog.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Sheet, Download } from "lucide-react";

interface ExportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onExport: (format: 'csv' | 'excel' | 'pdf') => void;
}

export const ExportDialog = ({ isOpen, setIsOpen, onExport }: ExportDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Applications</DialogTitle>
          <DialogDescription>
            Select the format you want to export the applications data
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={() => onExport('csv')}
            className="flex flex-col items-center gap-2 h-24"
          >
            <FileText className="h-6 w-6" />
            <span>CSV</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onExport('excel')}
            className="flex flex-col items-center gap-2 h-24"
          >
            <Sheet className="h-6 w-6" />
            <span>Excel</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onExport('pdf')}
            className="flex flex-col items-center gap-2 h-24"
          >
            <Download className="h-6 w-6" />
            <span>PDF</span>
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};