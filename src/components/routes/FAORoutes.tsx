
import React from "react";
import { Route, Routes } from "react-router-dom";
import FAODashboard from "@/pages/FAO/FAODashboard";
import PendingAllocations from "@/pages/FAO/PendingAllocations";
import AllocationsQueue from "@/pages/FAO/AllocationsQueue";
import FundManagement from "@/pages/FAO/FundManagement";
import ClosedFunds from "@/pages/FAO/ClosedFunds";
import DisbursementTracking from "@/pages/FAO/DisbursementTracking";
import FinancialReports from "@/pages/FAO/FinancialReports";
import TransactionHistory from "@/pages/FAO/TransactionHistory";
import AllocationManagement from "@/pages/FAO/AllocationManagement";
import ApplicationsReview from "@/pages/FAO/ApplicationsReview";
import ApplicationDetail from "@/pages/FAO/ApplicationDetail";

const FAORoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<FAODashboard />} />
      <Route path="pending-allocations" element={<PendingAllocations />} />
      <Route path="allocations-queue" element={<AllocationsQueue />} />
      <Route path="fund-management" element={<FundManagement />} />
      <Route path="closed-funds" element={<ClosedFunds />} />
      <Route path="disbursement-tracking" element={<DisbursementTracking />} />
      <Route path="financial-reports" element={<FinancialReports />} />
      <Route path="transaction-history" element={<TransactionHistory />} />
      <Route path="allocation-management" element={<AllocationManagement />} />
      <Route path="applications-review" element={<ApplicationsReview />} />
      <Route path="applications/:id" element={<ApplicationDetail />} />
    </Routes>
  );
};

export default FAORoutes;
