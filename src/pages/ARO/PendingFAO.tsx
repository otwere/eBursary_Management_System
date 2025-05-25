
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { Application } from "@/types/auth";
import { Search, Send, Info, Eye, Clock } from "lucide-react";
import { mockApplications } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { formatDate, formatCurrency } from "@/utils/format";

const PendingFAO = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);

  // Fetch applications on component mount
  useEffect(() => {
    // In a real app, we would fetch from an API
    const fetchedApplications = mockApplications.filter(
      app => app.status === "pending-allocation"
    );
    setApplications(fetchedApplications);
    setFilteredApplications(fetchedApplications);
  }, []);

  // Filter applications when search query changes
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = applications.filter(app => 
        app.studentName?.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query) ||
        app.institutionName.toLowerCase().includes(query)
      );
      setFilteredApplications(filtered);
    } else {
      setFilteredApplications(applications);
    }
  }, [applications, searchQuery]);

  return (
    <DashboardLayout title="Pending FAO Review">
      <div className="space-y-6 lg:-mx-[85px]">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-l-blue-500 rounded-md">
              <div className="pl-3">
                <CardTitle className="text-xl text-blue-800">Applications Pending FAO Review</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track applications that have been submitted to Financial Allocation Officers
                </CardDescription>
              </div>
              <StatusBadge status="pending-allocation" /> 
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search applications..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-medium">Student</th>
                      <th className="p-3 font-medium">Institution</th>
                      <th className="p-3 font-medium">Requested Amount</th>
                      <th className="p-3 font-medium">Approved Amount</th>
                      <th className="p-3 font-medium">Submitted Date</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="p-3">{application.studentName || "Unknown"}</td>
                        <td className="p-3">{application.institutionName}</td>
                        <td className="p-3">{formatCurrency(application.requestedAmount)}</td>
                        <td className="p-3">{formatCurrency(application.approvedAmount || 0)}</td>
                        <td className="p-3">{formatDate(new Date(application.lastUpdated || application.applicationDate))}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1" 
                              onClick={() => navigate(`/ARO/applications/${application.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100" 
                              onClick={() => window.open(`mailto:fao@example.com?subject=Application%20${application.id}%20Follow%20Up&body=This%20is%20regarding%20application%20${application.id}%20pending%20FAO%20review.`)}
                            >
                              <Clock className="h-4 w-4" />
                              Follow Up
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No pending applications"
                description="There are no applications waiting for FAO review at the moment."
                icon={<Info className="h-12 w-12 text-gray-400" />}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PendingFAO;
