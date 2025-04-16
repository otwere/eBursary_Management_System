
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Application } from "@/types/auth";
import { mockApplications } from "@/data/mockData";
import ApplicationCard from "@/components/common/ApplicationCard";
import { formatCurrency } from "@/utils/format";
import { Search, Filter, FileCheck, AlertCircle, Clock, CheckCircle, ArrowRight, BarChart4 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ApplicationsReview = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all");
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>("all");
  
  useEffect(() => {
    // Filter applications that are ready for FAO review (approved by ARO)
    const faoApplications = mockApplications.filter(
      (app) => app.status === "approved" || app.status === "pending-allocation"
    );
    setApplications(faoApplications);
    setFilteredApplications(faoApplications);
  }, []);

  useEffect(() => {
    let filtered = [...applications];

    if (searchQuery) {
      filtered = filtered.filter(
        (app) =>
          app.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.courseOfStudy?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    if (selectedInstitution !== "all") {
      filtered = filtered.filter((app) => app.institutionName === selectedInstitution);
    }

    if (selectedEducationLevel !== "all") {
      filtered = filtered.filter((app) => app.educationLevel === selectedEducationLevel);
    }

    setFilteredApplications(filtered);
  }, [searchQuery, selectedStatus, selectedInstitution, selectedEducationLevel, applications]);

  const institutions = Array.from(new Set(applications.map((app) => app.institutionName)));
  const educationLevels = Array.from(new Set(applications.map((app) => app.educationLevel).filter(Boolean)));

  const statusCounts = {
    all: applications.length,
    approved: applications.filter((app) => app.status === "approved").length,
    "pending-allocation": applications.filter((app) => app.status === "pending-allocation").length,
  };

  const totalAmount = applications.reduce((sum, app) => sum + app.requestedAmount, 0);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Applications Awaiting Allocation</h1>
            <p className="text-gray-500">Review and manage applications submitted by ARO for fund allocation</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/FAO/allocations-queue")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Allocations Queue
            </Button>
            <Button
              onClick={() => navigate("/FAO/fund-management")}
            >
              <BarChart4 className="mr-2 h-4 w-4" />
              Manage Funds
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.all}</div>
              <p className="text-xs text-gray-500">Awaiting allocation decision</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Approved by ARO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.approved}</div>
              <p className="text-xs text-gray-500">Ready for allocation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts["pending-allocation"]}</div>
              <p className="text-xs text-gray-500">In allocation queue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-gray-500">Requested funding</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by student name, institution or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedStatus}>
            <TabsList>
              <TabsTrigger value="all" className="flex items-center">
                <FileCheck className="h-4 w-4 mr-2" />
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approved ({statusCounts.approved})
              </TabsTrigger>
              <TabsTrigger value="pending-allocation" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Pending ({statusCounts["pending-allocation"]})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Select
                    value={selectedInstitution}
                    onValueChange={setSelectedInstitution}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by institution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Institutions</SelectItem>
                      {institutions.map((institution) => (
                        <SelectItem key={institution} value={institution}>
                          {institution}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select
                    value={selectedEducationLevel}
                    onValueChange={setSelectedEducationLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {educationLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {filteredApplications.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
            <p className="text-gray-500 mb-4">
              There are no applications matching your filter criteria.
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedStatus("all");
              setSelectedInstitution("all");
              setSelectedEducationLevel("all");
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                viewPath={`/FAO/applications/${application.id}`}
                onAction={(action) => {
                  if (action === "view") {
                    navigate(`/FAO/applications/${application.id}`);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicationsReview;
