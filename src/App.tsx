import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentApplications from "./pages/student/StudentApplications";
import NewApplication from "./pages/student/NewApplication";
import ApplicationDetail from "./pages/student/ApplicationDetail";
import StudentProfile from "./pages/student/StudentProfile";
import StudentStatements from "./pages/student/StudentStatements";
import StudentNotifications from "./pages/student/StudentNotifications";

// ARO Pages
import ARODashboard from "./pages/ARO/ARODashboard";
import ApplicationsReview from "./pages/ARO/ApplicationsReview";
import AROStudentApplications from "./pages/ARO/StudentApplications";
import AROApplicationDetail from "./pages/ARO/ApplicationDetail";
import PendingFAO from "./pages/ARO/PendingFAO"; // Added new import

// FAO Pages
import FAODashboard from "./pages/FAO/FAODashboard";
import FundManagement from "./pages/FAO/FundManagement";
import AllocationManagement from "./pages/FAO/AllocationManagement";
import DisbursementTracking from "./pages/FAO/DisbursementTracking";
import FinancialReports from "./pages/FAO/FinancialReports";
import TransactionHistory from "./pages/FAO/TransactionHistory";
import PendingAllocations from "./pages/FAO/PendingAllocations"; // New import
import AllocationsQueue from "./pages/FAO/AllocationsQueue"; // New import
import ClosedFunds from "./pages/FAO/ClosedFunds"; // New import
import FAOApplicationsReview from "./pages/FAO/ApplicationsReview"; // New import

// FDO Pages
import FDODashboard from "./pages/FDO/FDODashboard";

// SuperAdmin Pages
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import DeadlineManagement from "./pages/superadmin/DeadlineManagement";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Student Routes */}
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications/new"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <NewApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications/:id"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ApplicationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/statements"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentStatements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentNotifications />
                </ProtectedRoute>
              }
            />
            
            {/* ARO Routes */}
            <Route 
              path="/ARO" 
              element={
                <ProtectedRoute allowedRoles={["ARO", "superadmin"]}>
                  <ARODashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ARO/applications" 
              element={
                <ProtectedRoute allowedRoles={["ARO", "superadmin"]}>
                  <ApplicationsReview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ARO/applications/:id" 
              element={
                <ProtectedRoute allowedRoles={["ARO", "superadmin"]}>
                  <AROApplicationDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ARO/student-applications" 
              element={
                <ProtectedRoute allowedRoles={["ARO", "superadmin"]}>
                  <AROStudentApplications />
                </ProtectedRoute>
              } 
            />
            {/* New Route for Pending FAO Applications */}
            <Route 
              path="/ARO/pending-fao" 
              element={
                <ProtectedRoute allowedRoles={["ARO", "superadmin"]}>
                  <PendingFAO />
                </ProtectedRoute>
              } 
            />
            
            {/* FAO Routes */}
            <Route 
              path="/FAO" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <FAODashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/fund-management" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <FundManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/allocation-management" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <AllocationManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/disbursement-tracking" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <DisbursementTracking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/financial-reports" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <FinancialReports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/transaction-history" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <TransactionHistory />
                </ProtectedRoute>
              } 
            />
            {/* New Routes for Pending Allocations, Allocations Queue and Closed Funds */}
            <Route 
              path="/FAO/pending-allocations" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <PendingAllocations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/allocations-queue" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <AllocationsQueue />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/closed-funds" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <ClosedFunds />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/FAO/applications-review" 
              element={
                <ProtectedRoute allowedRoles={["FAO", "superadmin"]}>
                  <FAOApplicationsReview />
                </ProtectedRoute>
              } 
            />
            
            {/* FDO Routes */}
            <Route 
              path="/FDO" 
              element={
                <ProtectedRoute allowedRoles={["FDO", "superadmin"]}>
                  <FDODashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* SuperAdmin Routes */}
            <Route 
              path="/superadmin" 
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/superadmin/deadlines" 
              element={
                <ProtectedRoute allowedRoles={["superadmin"]}>
                  <DeadlineManagement />
                </ProtectedRoute>
              } 
            />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
