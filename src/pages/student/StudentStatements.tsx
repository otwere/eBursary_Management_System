
import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import FinancialStatementsTable from "@/components/student/FinancialStatementsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialStatement } from "@/types/auth";
import { mockFinancialStatements } from "@/data/mockData";
import EmptyState from "@/components/common/EmptyState";
import { FileText } from "lucide-react";

const StudentStatements = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Modify the filter functions to handle "processed" status
  const getFilteredStatements = (): FinancialStatement[] => {
    switch (activeTab) {
      case "disbursement":
        return mockFinancialStatements.filter(s => s.type === "disbursement");
      case "allocation":
        return mockFinancialStatements.filter(s => s.type === "allocation");
      case "pending":
        return mockFinancialStatements.filter(s => s.status === "pending");
      case "processed":
        return mockFinancialStatements.filter(s => 
          s.status === "processed" || s.status === "paid"
        );
      default:
        return mockFinancialStatements;
    }
  };

  // Update the tab counts
  const tabCounts = {
    all: mockFinancialStatements.length,
    disbursement: mockFinancialStatements.filter(s => s.type === "disbursement").length,
    allocation: mockFinancialStatements.filter(s => s.type === "allocation").length,
    pending: mockFinancialStatements.filter(s => s.status === "pending").length,
    processed: mockFinancialStatements.filter(s => 
      s.status === "processed" || s.status === "paid"
    ).length
  };

  const filteredStatements = getFilteredStatements();

  return (
    <DashboardLayout title='eBursary Disbursement Statement'>
      <div className="lg:-mx-[80px] p-0 md:p-0">
       <div className="h-16 bg-gray-50 mb-2 px-2 rounded border-l-4 border-l-blue-500 border-b-2 mt-[-3rem]">
       <h1 className="text-xl text-blue-800 font-bold pt-2">Financial Statements</h1>
       <p className="text-sm text-muted-foreground -mt-1">Generate | View Funds Statements</p>
       </div>

        <div className="my-4">
          <Card>
            <CardContent className="space-y-6 p-0 ">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="border-b p-2">
                  <TabsList className="lg:space-x-52 space-x-0">
                    <TabsTrigger value="all">
                      All <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-1">{tabCounts.all}</span>
                    </TabsTrigger>
                    <TabsTrigger value="disbursement">
                      Disbursements <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-1">{tabCounts.disbursement}</span>
                    </TabsTrigger>
                    <TabsTrigger value="allocation">
                      Allocations <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-1">{tabCounts.allocation}</span>
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-1">{tabCounts.pending}</span>
                    </TabsTrigger>
                    <TabsTrigger value="processed">
                      Processed <span className="ml-1 text-xs rounded-full bg-gray-100 px-2 py-1">{tabCounts.processed}</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value={activeTab} className="p-0">
                  {filteredStatements.length > 0 ? (
                    <FinancialStatementsTable statements={filteredStatements} />
                  ) : (
                    <div className="p-4">
                      <EmptyState 
                        icon={<FileText className="h-10 w-10" />}
                        title="No statements found"
                        description="There are no financial statements matching your filter criteria."
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentStatements;
