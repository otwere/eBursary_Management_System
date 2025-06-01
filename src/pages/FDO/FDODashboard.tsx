
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getApplicationsByStatus } from "@/data/mockData";
import StatCard from "@/components/common/StatCard";
import ApplicationCard from "@/components/common/ApplicationCard";
import { Calendar, CreditCard, DollarSign, FileArchive, LineChart, PiggyBank } from "lucide-react";

const FDODashboard = () => {
  const navigate = useNavigate();
  
  // Get applications for disbursement (already allocated)
  const allocatedApplications = getApplicationsByStatus("allocated");
  const disbursedApplications = getApplicationsByStatus("disbursed");
  
  // Calculate disbursement metrics
  const totalAllocated = allocatedApplications.reduce(
    (sum, app) => sum + (app.allocationAmount || 0), 0
  );
  
  const totalDisbursed = disbursedApplications.reduce(
    (sum, app) => sum + (app.allocationAmount || 0), 0
  );
  
  const pendingDisbursement = totalAllocated;
  const percentageDisbursed = totalDisbursed / (totalAllocated + totalDisbursed) * 100;

  // Get recently allocated applications
  const recentAllocations = [...allocatedApplications].sort(
    (a, b) => new Date(b.allocationDate || 0).getTime() - new Date(a.allocationDate || 0).getTime()
  ).slice(0, 3);

  return (
    <DashboardLayout title="Funds Disbursement Officer Officer - Dashboard">
      <div className="space-y-6 lg:mx-[-82px]">
        {/* Overview section */}
        <div className=" border-b-2 p-4 rounded border-l-lime-500 border-l-4 h-20">
          <h1 className="text-xl font-bold text-blue-800 my-[-0.5rem]">Fund Disbursement  Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Process and track Disbursement of Allocated Funds to Students.
          </p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Pending Disbursements" 
            value={allocatedApplications.length}
            icon={<CreditCard className="h-6 w-6" />}
            description="Applications awaiting Funds Disbursement"
            className="border-l-4 border-l-amber-500 bg-amber-50 hover:bg-amber-100"
          />
          <StatCard 
            title="Total Disbursements" 
            value={disbursedApplications.length}
            icon={<DollarSign className="h-6 w-6" />}
            description="Successfully Processed Disbursements"
            trend={{ value: 23, isPositive: true }}
            className="border-l-4 border-l-green-500 bg-green-50 hover:bg-green-100"
          />
          <StatCard 
            title="Amount to Disburse" 
            value={`KES ${pendingDisbursement.toLocaleString()}`}
            icon={<PiggyBank className="h-6 w-6" />}
            description="Total Funds Pending Disbursement"
            className="border-l-4 border-l-blue-500 bg-blue-50 hover:bg-blue-100"
          />
        </div>

        {/* Disbursement overview */}
        <Card>
          <CardHeader className="border-l-4 border-l-blue-500 border-b-2 mb-4">
            <CardTitle className="text-xl text-blue-800 font-bold">Disbursement Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 hover:bg-green-100 rounded p-4 border border-green-100">
                <p className="text-sm font-medium text-green-700">Total Disbursed</p>
                <p className="text-xl font-bold">KES {totalDisbursed.toLocaleString()}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-green-700">{disbursedApplications.length} Applications</p>
                    <p className="text-green-700">Complete</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 hover:bg-blue-100 rounded p-4 border border-blue-100">
                <p className="text-sm font-medium text-blue-700">Pending Disbursement</p>
                <p className="text-xl font-bold">KES {pendingDisbursement.toLocaleString()}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-blue-700">{allocatedApplications.length} Applications</p>
                    <p className="text-blue-700">In Queue</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p>Disbursement Progress</p>
                <p>{isNaN(percentageDisbursed) ? 0 : percentageDisbursed.toFixed(1)}%</p>
              </div>
              <Progress value={percentageDisbursed} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader className="border-l-4 border-l-blue-500 rounded mb-4 border-b-2">
            <CardTitle className="text-blue-800 text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 bg-orange-50 border-l-4 border-l-amber-500"
              onClick={() => navigate("/FDO/disbursements")}
            >
              <DollarSign className="h-6 w-6 mb-2" />
              <span className="text-sm">Process Disbursements</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 border-l-4 border-l-blue-500 bg-blue-50"
              onClick={() => navigate("/FDO/schedule")}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Disbursement Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto flex flex-col items-center justify-center py-4 px-2 border-l-4 border-l-green-500 bg-green-50"
              onClick={() => navigate("/FDO/history")}
            >
              <FileArchive className="h-6 w-6 mb-2" />
              <span className="text-sm">Disbursement History</span>
            </Button>
          </CardContent>
        </Card>

        {/* Pending disbursements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-blue-800 text-xl font-bold mt-[-1rem]">Ready for Disbursement</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate("/FDO/disbursements")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {recentAllocations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAllocations.map((app) => (
                  <ApplicationCard 
                    key={app.id} 
                    application={app}
                    viewPath={`/FDO/disbursements/${app.id}`}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No applications ready for disbursement at the moment.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disbursement trends */}
        <Card> 
          <CardHeader className="border-l-4 border-l-blue-500 border-b-2">
            <CardTitle className="text-xl text-blue-800 font-bold">Disbursement Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center space-y-2">
              <LineChart className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500 text-lg">Disbursement trends visualization would be here</p>
              <p className="text-sm text-gray-400">Shows monthly disbursement patterns and comparisons</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FDODashboard;
