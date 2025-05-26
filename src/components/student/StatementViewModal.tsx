
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { FinancialStatement } from "@/types/auth"; // Fixed import after adding to auth.ts

interface StatementViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement: FinancialStatement;
  onPrint: () => void;
  onDownload: () => void;
}

const StatementViewModal: React.FC<StatementViewModalProps> = ({
  isOpen,
  onClose,
  statement,
  onPrint,
  onDownload
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-blue-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Financial Statement
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border rounded bg-white space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">eBursary  Portal</h3>
              <p className="text-sm text-gray-500">Financial Statement Record</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{statement.reference}</p>
              <p className="text-sm text-gray-500">Date : {formatDate(new Date(statement.date))}</p>
            </div>
          </div>
          
          <div className="border-t border-b py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Student Information</h4>
              <p className="font-medium">{statement.studentName || "Student Name"}</p>
              <p className="text-sm text-gray-600">{statement.studentId || "Student ID"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Institution</h4>
              <p className="font-medium">{statement.institutionName}</p>
              <p className="text-sm text-gray-600">{statement.academicYear || "Academic Year"}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Financial Details</h4>
            <div className="border rounded overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {statement.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(statement.amount)}
                    </td>
                  </tr>
                  {statement.additionalItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Amount
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600 text-right">
                      {formatCurrency(statement.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 border rounded">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Status</h4>
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full h-3 w-3 ${
                statement.status === "paid" 
                  ? "bg-green-500" 
                  : statement.status === "pending" 
                  ? "bg-amber-500" 
                  : "bg-blue-500"
              }`}></span>
              <span className="text-sm font-medium">
                {statement.status === "paid" 
                  ? "Paid" 
                  : statement.status === "pending" 
                  ? "Pending" 
                  : "Processed"}
              </span>
            </div>
            {statement.notes && (
              <p className="mt-2 text-sm text-gray-600">{statement.notes}</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={onDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatementViewModal;
