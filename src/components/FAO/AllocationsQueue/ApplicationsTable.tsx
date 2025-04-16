
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, CheckCircle2, Download, Banknote, Eye, MoreHorizontal } from "lucide-react";
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

  const getPriorityBadge = (priorityScore: number) => {
    if (priorityScore >= 8) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
    } else if (priorityScore >= 5) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Medium</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Low</Badge>;
    }
  };

  const getEducationLevelBadge = (level: string) => {
    const badgeClasses: Record<string, string> = {
      'University': 'bg-purple-100 text-purple-800 border-purple-200',
      'College': 'bg-blue-100 text-blue-800 border-blue-200',
      'TVET': 'bg-green-100 text-green-800 border-green-200',
      'Secondary': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    
    return <Badge className={badgeClasses[level] || 'bg-gray-100 text-gray-800 border-gray-200'}>{level}</Badge>;
  };

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  selectedApplications.length === applications.length &&
                  applications.length > 0
                }
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Application ID</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Education Level</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                No applications found
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => (
              <TableRow key={application.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedApplications.includes(application.id)}
                    onCheckedChange={() => handleSelectApplication(application.id)}
                    aria-label={`Select application ${application.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{application.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{application.studentName}</div>
                  <div className="text-xs text-gray-500">{application.studentId || "No ID"}</div>
                </TableCell>
                <TableCell>{application.institutionName}</TableCell>
                <TableCell>
                  {getEducationLevelBadge(application.educationLevel)}
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate max-w-[120px]">{application.courseOfStudy}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{application.courseOfStudy}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>{formatCurrency(application.requestedAmount)}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>{formatDate(application.applicationDate)}</div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{new Date(application.applicationDate).toLocaleString()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <StatusBadge status={application.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/FAO/applications/${application.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAllocateDialog(application)}>
                          <Banknote className="h-4 w-4 mr-2" />
                          Allocate Funds
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/FAO/applications/${application.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button> */}
                    {/* <Button
                      variant="default"
                      size="sm"
                      onClick={() => openAllocateDialog(application)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Allocate
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  );
};

export default ApplicationsTable;
