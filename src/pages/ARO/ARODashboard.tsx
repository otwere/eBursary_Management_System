
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApplications, getApplicationsByStatus } from "@/data/mockData";
import StatCard from "@/components/common/StatCard";
import ApplicationCard from "@/components/common/ApplicationCard";
import {
  BarChart,
  CheckCircle,
  Clock,
  FileCheck,
  FileClock,
  FileX,
  RefreshCcw,
  Users,
  School,
} from "lucide-react";

const ARODashboard = () => {
  const navigate = useNavigate();
  
  // Get applications by status
  const submittedApplications = getApplicationsByStatus("submitted");
  const underReviewApplications = getApplicationsByStatus("under-review");
  const recentApplications = [...submittedApplications, ...underReviewApplications]
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 3);
  
  return (
    <DashboardLayout title="Application & Documents Review Officer (ADRO) Dashboard">
      <div className="space-y-6 -mx-[70px]">
        {/* Overview section */}
        <div className="bg-amber-50 p-4 rounded-lg border border-l-4 border-green-500">
          <h1 className="text-xl text-blue-800 font-semibold">Application Review Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review and manage Bursary Applications.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            className="h-auto py-6 flex flex-col gap-2 border border-primary/20 bg-cyan-50 border-l-4 rounded-xl hover:bg-cyan-100"
            onClick={() => navigate("/ARO/applications")}
          >
            <FileCheck className="h-8 w-8 text-blue-800" />
            <span className="font-medium text-gray-600">Review Applications</span>
            <span className="text-sm opacity-80 text-gray-600">Process New Applications</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2 bg-green-50 border-l-4 border-green-500 hover:bg-green-100 rounded-xl"
            onClick={() => navigate("/ARO/student-applications")}
          >
            <Users className="h-8 w-8 text-primary" />
            <span className="font-medium text-gray-800">Student Applications</span>
            <span className="text-sm opacity-80 text-gray-800">View all Applications</span>
          </Button>
          
          <Button 
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2 bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100 rounded-xl"
            onClick={() => navigate("/ARO/reports")}
          >
            <BarChart className="h-8 w-8 text-primary" />
            <span className="font-medium text-gray-800">Reports</span>
            <span className="text-sm opacity-80 text-800">Generate and view reports</span>
          </Button>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Pending Review" 
            value={submittedApplications.length}
            icon={<FileClock className="h-6 w-6" />}
            description="Applications awaiting initial review"
            trend={{ value: 12, isPositive: false }}
            className="bg-gray-50 hover:bg-gray-100 border-l-4 border-red-500"
          />
          <StatCard 
            title="Under Review" 
            value={underReviewApplications.length}
            icon={<Clock className="h-6 w-6" />}
            description="Applications in Progress"
            className="bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500"
          />
          <StatCard 
            title="Reviewed This Month" 
            value={getApplicationsByStatus("approved").length}
            icon={<FileCheck className="h-6 w-6" />}
            description="Successfully Processed Applications"
            trend={{ value: 8, isPositive: true }}
            className="bg-cyan-50 hover:bg-cyan-100 border-l-4 border-cyan-500"
          />
        </div>

        {/* Quick filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Applications Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 bg-yellow-50 hover:bg-yellow-100 border-l-4 border-yellow-500 rounded-xl"
              onClick={() => navigate("/ARO/applications?status=submitted")}
            >
              <Clock className="h-6 w-6 mb-2 text-yellow-500" />
              <span className="text-sm">Awaiting Review</span>
              <span className="text-lg font-semibold mt-1">{submittedApplications.length}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500 rounded-xl"
              onClick={() => navigate("/ARO/applications?status=under-review")}
            >
              <RefreshCcw className="h-6 w-6 mb-2 text-blue-500" />
              <span className="text-sm">In Progress</span>
              <span className="text-lg font-semibold mt-1">{underReviewApplications.length}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 bg-green-50 hover:bg-green-100 border-l-4 border-green-500 rounded-xl"
              onClick={() => navigate("/ARO/applications?status=approved")}
            >
              <CheckCircle className="h-6 w-6 mb-2 text-green-500" />
              <span className="text-sm">Approved</span>
              <span className="text-lg font-semibold mt-1">{getApplicationsByStatus("approved").length}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-500 rounded-xl"
              onClick={() => navigate("/ARO/applications?status=corrections-needed")}
            >
              <FileX className="h-6 w-6 mb-2 text-orange-500" />
              <span className="text-sm">Needs Corrections</span>
              <span className="text-lg font-semibold mt-1">{getApplicationsByStatus("corrections-needed").length}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Applications section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Recent Applications</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/ARO/applications")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentApplications.map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    application={app}
                    viewPath={`/ARO/applications/${app.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications to review at the moment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institution types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Applications by Institution Type</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <School className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Universities</h3>
                    <p className="text-sm text-gray-600">Higher education</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {mockApplications.filter(app => app.institutionType === "University").length}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <School className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Colleges</h3>
                    <p className="text-sm text-gray-600">Diploma programs</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {mockApplications.filter(app => app.institutionType === "College").length}
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 rounded-full p-2">
                    <School className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">TVETs</h3>
                    <p className="text-sm text-gray-600">Technical training</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-amber-700">
                  {mockApplications.filter(app => app.institutionType === "TVET").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ARODashboard;
