
// Fund types for the FAO (Financial Accounting Officer) module

// Fund Category Types
export type FundCategoryType = "Bursary" | "Scholarship";

// Fund Subcategory Types
export type EducationLevelType = "University" | "College" | "TVET" | "Secondary";

// Disbursement Method Types 
export type DisbursementMethodType = "Cheque" | "BankTransfer" | "Mpesa";

// Fund Status Types
export type FundStatusType = "active" | "closed" | "pending" | "depleted";

// Fund Float represents the budget loaded by FAO for allocation
export interface FundFloat {
  id: string;
  name: string;
  description?: string;
  amount: number;
  academicYear: string;
  createdAt: string;
  createdBy: string;
  status: FundStatusType;
  allocatedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  notes?: string;
  financialPeriod?: string;
  closedAt?: string;
  closedBy?: string;
  closureReason?: string;
}

// Fund Category represents a major categorization (Bursary or Scholarship)
export interface FundCategory {
  id: string;
  floatId: string;
  name: FundCategoryType;
  description?: string;
  amount: number;
  allocatedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  academicYear: string;
  createdAt: string;
  createdBy: string;
}

// Fund Allocation represents the subdivision of funds to education levels
export interface FundAllocation {
  id: string;
  categoryId: string;
  educationLevel: EducationLevelType;
  description?: string;
  amount: number;
  allocatedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  academicYear: string;
  createdAt: string;
  createdBy: string;
  status: "active" | "depleted" | "closed";
}

// Batch Allocation type for bulk allocations
export interface BatchAllocation {
  id: string;
  institutionId: string;
  institutionName: string;
  applicationIds: string[];
  totalAmount: number;
  allocatedDate: string;
  allocatedBy: string;
  status: "pending" | "approved" | "disbursed" | "cancelled";
  academicYear: string;
  notes?: string;
  disbursedAmount?: number;
  disbursementMethod?: DisbursementMethodType;
  disbursementDate?: string;
}

// Allocations Queue for tracking pending applications for allocation
export interface AllocationQueue {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  institutionId: string;
  institutionName: string;
  educationLevel: EducationLevelType;
  requestedAmount: number;
  approvedAmount?: number;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "allocated" | "rejected" | "on-hold";
  allocatedAmount?: number;
  allocatedBy?: string;
  allocatedAt?: string;
  fundCategoryId?: string;
  fundAllocationId?: string;
  notes?: string;
  priority?: "high" | "medium" | "low";
  batchId?: string;
}

// Disbursement represents the actual payment of allocated funds
export interface Disbursement {
  id: string;
  applicationId: string;
  studentId: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  method: DisbursementMethodType;
  status: "pending" | "in-progress" | "completed" | "failed";
  reference?: string;
  transactionDate?: string;
  processedBy?: string;
  processedAt?: string;
  notes?: string;
  receiptNumber?: string;
  chequeNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  mpesaNumber?: string;
  mpesaName?: string;
  confirmationCode?: string;
  batchId?: string;
}

// Transaction Record for detailed transaction tracking
export interface TransactionRecord {
  id: string;
  disbursementId: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  institutionId: string;
  institutionName: string;
  amount: number;
  method: DisbursementMethodType;
  transactionDate: string;
  status: "successful" | "failed" | "reversed";
  reference: string;
  transactionType: "disbursement" | "refund" | "cancellation";
  processedBy: string;
  details: {
    chequeNumber?: string;
    bankName?: string;
    institutionName?: string;
    accountNumber?: string;
    accountName?: string;
    mpesaNumber?: string;
    mpesaName?: string;
    confirmationCode?: string;
    [key: string]: any;
  };
}

// Fund Utilization Summary for reporting
export interface FundUtilizationSummary {
  academicYear: string;
  totalBudget: number;
  allocatedAmount: number;
  disbursedAmount: number;
  remainingAmount: number;
  categoryBreakdown: {
    categoryType: FundCategoryType;
    allocatedAmount: number;
    disbursedAmount: number;
    percentage: number;
  }[];
  educationLevelBreakdown: {
    educationLevel: EducationLevelType;
    allocatedAmount: number;
    disbursedAmount: number;
    percentage: number;
  }[];
  institutionTypeBreakdown: {
    institutionType: string;
    allocatedAmount: number;
    disbursedAmount: number;
    count: number;
  }[];
  disbursementMethodBreakdown: {
    method: DisbursementMethodType;
    amount: number;
    count: number;
    percentage: number;
  }[];
}
