import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, CheckCircle2, Banknote, Eye, MoreHorizontal, User, School, BookOpen, Calendar } from "lucide-react";
import { Application } from "@/types/auth";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/format";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ApplicationsTableProps {
  applications: Application[];
  selectedApplications: string[];
  handleSelectApplication: (id: string) => void;
  handleSelectAll: () => void;
  openAllocateDialog: (application: Application) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  selectedApplications,
  handleSelectApplication,
  handleSelectAll,
  openAllocateDialog,
}) => {
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={selectedApplications.length === applications.length && applications.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Allocated</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Allocated On</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedApplications.includes(application.id)}
                  onCheckedChange={() => handleSelectApplication(application.id)}
                  aria-label={`Select application ${application.id}`}
                />
              </TableCell>
              <TableCell className="font-medium">#{application.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{application.studentName}</div>
                    <div className="text-xs text-gray-500">{application.studentId}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-gray-500" />
                  <span>{application.institutionName}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{formatCurrency(application.requestedAmount)}</span>
                  <span className="text-xs text-gray-500">Requested</span>
                </div>
              </TableCell>
              <TableCell>
                {application.allocatedAmount ? (
                  <div className="flex flex-col">
                    <span className="font-medium text-green-600">
                      {formatCurrency(application.allocatedAmount)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {application.allocationDate ? `on ${formatDate(application.allocationDate)}` : ''}
                    </span>
                  </div>
                ) : (
                  <Badge variant="outline">Not allocated</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDate(application.applicationDate)}</span>
                </div>
              </TableCell>
              <TableCell>
                {application.allocationDate ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>{formatDate(application.allocationDate)}</span>
                  </div>
                ) : (
                  <Badge variant="outline">Pending</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={application.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/FAO/applications/${application.id}`)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openAllocateDialog(application)}
                    disabled={application.status !== 'approved'}
                    className="gap-1"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Allocate
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default ApplicationsTable;