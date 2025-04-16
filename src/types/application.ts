
import { ApplicationStatus } from "./auth";

export interface ApplicationWorkflow {
  previousStatus: ApplicationStatus | null;
  currentStatus: ApplicationStatus;
  nextStatus?: ApplicationStatus | null;
  canEdit: boolean;
  canApprove: boolean;
  canReject: boolean;
  canRequestCorrections: boolean;
  pendingOfficer: string;
  actionRequired?: string;
}

export interface AllocationDetails {
  applicationId: string;
  allocatedBy?: string;
  allocatedAmount: number;
  allocationDate?: string;
  allocationNotes?: string;
  fundSource?: string;
  disbursementSchedule?: DisbursementSchedule[];
}

export interface DisbursementSchedule {
  id: string;
  amount: number;
  scheduledDate: string;
  disbursed: boolean;
  disbursementDate?: string;
}

// Application status enumerations
export const APPLICATION_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under-review",
  CORRECTIONS_NEEDED: "corrections-needed",
  APPROVED: "approved",
  PENDING_ALLOCATION: "pending-allocation",
  ALLOCATED: "allocated",
  PENDING_DISBURSEMENT: "pending-disbursement",
  DISBURSED: "disbursed",
  REJECTED: "rejected"
};

// Application workflow - defines the flow of statuses and who can perform actions
export const APPLICATION_WORKFLOW = {
  [APPLICATION_STATUS.DRAFT]: {
    nextStatus: [APPLICATION_STATUS.SUBMITTED],
    actionBy: ["student"],
    actionName: "Submit"
  },
  [APPLICATION_STATUS.SUBMITTED]: {
    nextStatus: [APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.CORRECTIONS_NEEDED, APPLICATION_STATUS.REJECTED],
    actionBy: ["ARO", "superadmin"],
    actionName: "Review"
  },
  [APPLICATION_STATUS.UNDER_REVIEW]: {
    nextStatus: [APPLICATION_STATUS.CORRECTIONS_NEEDED, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED],
    actionBy: ["ARO", "superadmin"],
    actionName: "Complete Review"
  },
  [APPLICATION_STATUS.CORRECTIONS_NEEDED]: {
    nextStatus: [APPLICATION_STATUS.SUBMITTED],
    actionBy: ["student"],
    actionName: "Resubmit"
  },
  [APPLICATION_STATUS.APPROVED]: {
    nextStatus: [APPLICATION_STATUS.PENDING_ALLOCATION],
    actionBy: ["ARO", "superadmin"],
    actionName: "Submit to FAO"
  },
  [APPLICATION_STATUS.PENDING_ALLOCATION]: {
    nextStatus: [APPLICATION_STATUS.ALLOCATED, APPLICATION_STATUS.REJECTED],
    actionBy: ["FAO", "superadmin"],
    actionName: "Allocate Funds"
  },
  [APPLICATION_STATUS.ALLOCATED]: {
    nextStatus: [APPLICATION_STATUS.PENDING_DISBURSEMENT],
    actionBy: ["FAO", "superadmin"],
    actionName: "Submit for Disbursement"
  },
  [APPLICATION_STATUS.PENDING_DISBURSEMENT]: {
    nextStatus: [APPLICATION_STATUS.DISBURSED, APPLICATION_STATUS.REJECTED],
    actionBy: ["FDO", "superadmin"],
    actionName: "Disburse Funds"
  },
  [APPLICATION_STATUS.DISBURSED]: {
    nextStatus: [],
    actionBy: [],
    actionName: "Complete"
  },
  [APPLICATION_STATUS.REJECTED]: {
    nextStatus: [],
    actionBy: [],
    actionName: "Complete"
  }
};
