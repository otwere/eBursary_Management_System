
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/common/StatCard";
import { mockApplications, mockDeadlines } from "@/data/mockData";
import {
  Users, UserCheck, FileText, Settings, Clock, CalendarDays,
  BarChart3, DollarSign, School, GraduationCap, UserPlus, ArrowRight
} from "lucide-react";

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Get application statistics
  const totalApplications = mockApplications.length;
  const pendingReview = mockApplications.filter(app => app.status === "submitted").length;
  const approvedApplications = mockApplications.filter(app => 
    app.status === "approved" || app.status === "allocated" || app.status === "disbursed"
  ).length;
  const rejectedApplications = mockApplications.filter(app => app.status === "rejected").length;
  
  // Get active deadlines
  const activeDeadlines = mockDeadlines.filter(deadline => {
    const closingDate = new Date(deadline.closingDate);
    const now = new Date();
    return closingDate > now && deadline.isActive;
  });
  
  // Calculate upcoming deadline
  const upcomingDeadline = activeDeadlines.sort((a, b) => {
    return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
  })[0];

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 lg:-mx-[80px] mt-[-4rem]">
        {/* Welcome message */}
        <div className="p-4 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h2 className="text-xl font-bold mb-0">Welcome, Super Admin</h2>
          <p className="text-muted text-sm">
            You have full access to Manage the eBursary  Portal Platform.
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500 bg-amber-50 hover:bg-amber-100 ">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-blue-800">Application Deadlines</CardTitle>
              <CardDescription>
                Manage Application opening and closing dates
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button 
                className="w-full" 
                onClick={() => navigate("/superadmin/deadlines")}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Manage Deadlines
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 bg-purple-50 hover:bg-purple-100"> 
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-blue-800 font-bold">User Management</CardTitle>
              <CardDescription>
                Add, edit, or deactivate system users
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">System Reports</CardTitle>
              <CardDescription>
                View financial reports and statistics
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <Button className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Applications"
            value={totalApplications.toString()}
            icon={<FileText className="h-5 w-5" />}
            className="border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100"
            trend={{
              value: 12,
              isPositive: true
            }}
          />
          <StatCard
            title="Pending Review"
            value={pendingReview.toString()}
            icon={<Clock className="h-5 w-5" />}
            className="border-l-4 border-l-orange-500 bg-orange-50 hover:bg-orange-100"
            trend={{
              value: 5,
              isPositive: false
            }}
          />
          <StatCard
            title="Approved"
            value={approvedApplications.toString()}
            icon={<UserCheck className="h-5 w-5" />}
            className="border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100"
            trend={{
              value: 8,
              isPositive: true
            }}
          />
          <StatCard
            title="Total Disbursed"
            value="KES 5,250,000.00"
            icon={<DollarSign className="h-5 w-5" />}
            className="border-l-4 border-l-lime-500 bg-lime-50 hover:bg-lime-100"
            trend={{
              value: 15,
              isPositive: true
            }}
          />
        </div>
        
        {/* Application Deadlines Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2  border-l-4 border-l-blue-500 border-b-2 mb-4 h-16 ">
              <div className="flex items-center justify-between -mx-4">
                <CardTitle className="text-xl text-blue-800 font-bold  pl-4 ">Application Deadlines</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/superadmin/deadlines")}
                  className="hover:underline border-none hover:text-blue-600 mr-3"
                >
                  Manage all Deadlines
                  {/* <ArrowRight className="ml-1 h-4 w-4" /> */}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="py-2 px-4 text-left font-medium">Type</th>
                      <th className="py-2 px-4 text-left font-medium">Academic Year</th>
                      <th className="py-2 px-4 text-left font-medium">Status</th>
                      <th className="py-2 px-4 text-right font-medium">Closing Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockDeadlines.map(deadline => {
                      const closingDate = new Date(deadline.closingDate);
                      const isExpired = closingDate <= new Date();
                      
                      return (
                        <tr key={deadline.id} className="hover:bg-muted/50">
                          <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                              <School className="h-4 w-4 text-primary-500" />
                              <span>{deadline.institutionType}</span>
                            </div>
                          </td>
                          <td className="py-2 px-4">{deadline.academicYear}</td>
                          <td className="py-2 px-4">
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              isExpired 
                                ? 'bg-red-100 text-red-800' 
                                : deadline.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {isExpired 
                                ? 'Expired' 
                                : deadline.isActive
                                ? 'Active'
                                : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-2 px-4 text-right">
                            {closingDate.toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="border-l-4 border-b-2 mb-2 border-l-purple-500">
              <CardTitle className="text-xl text-blue-800 font-bold">System Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-[15px]">Total Users</span>
                </div>
                <span className="font-semibold  hover:underline hover:text-blue-500">350</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <School className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-[15px]">Institutions</span>
                </div>
                <span className="font-semibold  hover:underline hover:text-blue-500">42</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-[15px]">Students</span>
                </div>
                <span className="font-semibold  hover:underline hover:text-blue-500">285</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-[15px]">Active Deadlines</span>
                </div>
                <span className="font-semibold  hover:underline hover:text-blue-500">{activeDeadlines.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-[15px]">Annual Budget</span>
                </div>
                <span className="font-semibold hover:underline hover:text-blue-500">KES 8,000,000.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick access cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto flex-col p-4 bg-blue-50 hover:bg-blue-100 border-blue-200">
            <UserPlus className="h-8 w-8 text-blue-500 mb-2" />
            <span className="text-base font-medium">Add User</span>
            <span className="text-xs text-gray-500 mt-1">Create new user accounts</span>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 bg-green-50 hover:bg-green-100 border-green-200">
            <School className="h-8 w-8 text-green-500 mb-2" />
            <span className="text-base font-medium">Institutions</span>
            <span className="text-xs text-gray-500 mt-1">Manage registered institutions</span>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 bg-purple-50 hover:bg-purple-100 border-purple-200">
            <Settings className="h-8 w-8 text-purple-500 mb-2" />
            <span className="text-base font-medium">System Settings</span>
            <span className="text-xs text-gray-500 mt-1">Configure platform settings</span>
          </Button>
          
          <Button variant="outline" className="h-auto flex-col p-4 bg-amber-50 hover:bg-amber-100 border-amber-200">
            <BarChart3 className="h-8 w-8 text-amber-500 mb-2" />
            <span className="text-base font-medium">Analytics</span>
            <span className="text-xs text-gray-500 mt-1">View detailed statistics</span>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
