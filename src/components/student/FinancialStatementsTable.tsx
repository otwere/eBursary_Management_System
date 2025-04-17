
import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Filter, Eye, Printer, Search } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { FinancialStatement } from "@/types/auth";
import StatementViewModal from "./StatementViewModal";
import { useToast } from "@/components/ui/use-toast";
import { generateStatementPDF } from "@/utils/pdfGenerator";
import { useAuth } from "@/contexts/AuthContext";

interface FinancialStatementsTableProps {
  statements: FinancialStatement[];
}

const FinancialStatementsTable: React.FC<FinancialStatementsTableProps> = ({ statements }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedStatement, setSelectedStatement] = useState<FinancialStatement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const { authState } = useAuth();
  
  // Filter statements based on search term
  const filteredStatements = statements.filter((statement) =>
    statement.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    statement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredStatements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentStatements = filteredStatements.slice(startIndex, endIndex);

  // Handle view statement
  const handleViewStatement = (statement: FinancialStatement) => {
    setSelectedStatement(statement);
    setIsModalOpen(true);
  };

  // Handle print statement
  const handlePrintStatement = () => {
    if (!selectedStatement) return;
    
    // Generate and download PDF
    handleDownloadPDF(selectedStatement);
  };

  // Handle download PDF
  const handleDownloadPDF = async (statement: FinancialStatement) => {
    if (!authState.user) return;
    
    setIsDownloading(true);
    try {
      const pdfBlob = await generateStatementPDF(statement, authState.user.name);
      
      // Create download link and trigger download
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Statement_${statement.reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Statement Downloaded",
        description: "Your financial statement has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your financial statement PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Generate page numbers to display
  const generatePaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;
    
    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Calculate start and end of pagination links
    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
    
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4 p-0 ">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Financial Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search statements by institution or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
          
          {filteredStatements.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStatements.map((statement) => (
                      <TableRow key={statement.id}>
                        <TableCell className="font-medium">{statement.reference}</TableCell>
                        <TableCell>{formatDate(new Date(statement.date))}</TableCell>
                        <TableCell>{statement.institutionName}</TableCell>
                        <TableCell>{formatCurrency(statement.amount)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statement.status === "paid"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : statement.status === "pending"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {statement.status.charAt(0).toUpperCase() + statement.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewStatement(statement)}
                            title="View Statement"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPDF(statement)}
                            disabled={isDownloading}
                            title="Download Statement"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {generatePaginationItems()}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No statements found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "No statements match your search criteria." : "You don't have any financial statements yet."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Statement View Modal */}
      {selectedStatement && (
        <StatementViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          statement={selectedStatement}
          onPrint={handlePrintStatement}
          onDownload={() => handleDownloadPDF(selectedStatement)}
        />
      )}
    </div>
  );
};

export default FinancialStatementsTable;
