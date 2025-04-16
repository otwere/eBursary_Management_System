export type UserRole = "student" | "ARO" | "FAO" | "FDO" | "superadmin";

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  profilePicture?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  name?: string;
  institutionType?: InstitutionType;
  // Additional properties
  studentId?: string;
  institutionName?: string;
  createdAt?: string;
  updatedAt?: string;
  orphanStatus?: OrphanDetail;
}

export type ApplicationStatus = 
  | "draft" 
  | "submitted" 
  | "under-review" 
  | "corrections-needed" 
  | "approved" 
  | "pending-allocation" 
  | "allocated" 
  | "pending-disbursement"
  | "disbursed" 
  | "rejected";

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
}

export interface Institution {
  id: string;
  name: string;
  institutionId: string;
  address: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
}

export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'verified';

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  required: boolean;
  status: DocumentStatus;
  uploadedDate?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName?: string;
  institutionId: string;
  institutionName: string;
  applicationDate: string;
  status: ApplicationStatus;
  courseOfStudy?: string;
  academicYear?: string;
  requestedAmount: number;
  approvedAmount?: number;
  disbursedAmount?: number;
  lastUpdated?: string;
  documentsVerified?: boolean;
  reviewComments?: string;
  fundCategory?: string;
  submittedToFAO?: boolean;
  // Removed duplicate allocatedBy properties
  yearOfStudy?: string | number;
  reviewDate?: string;
  approvalDate?: string;
  disbursementDate?: string;
  documents?: StudentDocument[];
  userId?: string;
  studentEmail?: string;
  phoneNumber?: string;
  email?: string;
  institutionType?: string;
  allocationAmount?: number;
  allocationDate?: string;
  educationLevel?: string;
  familyInfo?: {
    incomeLevel?: string;
    familySize?: number;
    guardianOccupation?: string;
    residenceType?: string;
    dependentsCount?: number;
    specialCircumstances?: string;
    guardianName?: string;
    relationshipToApplicant?: string;
    occupation?: string;
    monthlyIncome?: number | string;
    dependents?: number;
  };
  // Additional properties for tracking
  submittedAt?: string;
  createdAt?: string;
  // Keep only one allocatedBy property
  reviewedBy?: string;
  allocatedBy?: string;
  disbursedBy?: string;
  academicRecords?: any[];
  financialInfo?: any;
  applicationType?: string;
  // FAO specific fields
  needStatement?: string;
  fundSource?: string;
  allocationNotes?: string;
  disbursementMethod?: string;
  referenceNumber?: string;
  // New fields for enhanced allocation functionality
  priorityScore?: number;
  allocationStatus?: "pending" | "in-progress" | "completed";
  allocatedFundId?: string;
  disbursementSchedule?: {
    scheduledDate: string;
    amount: number;
    status: "pending" | "completed" | "failed";
  }[];
}

// Additional types needed by components
export type InstitutionType = "Secondary" | "TVET" | "College" | "University";

export interface ApplicationDeadline {
  id: string;
  institutionType: InstitutionType;
  academicYear: string;
  closingDate: string;
  description?: string;
  isActive: boolean;
  // Additional properties
  openingDate?: string;
  fundCategory?: string;
}

export interface AcademicRecord {
  id?: string;
  studentId?: string;
  semester?: string;
  year: string;
  term?: string;
  gpa?: number;
  status?: "completed" | "in-progress" | "upcoming";
  credits?: number;
  totalCredits?: number;
  courses?: {
    code: string;
    name: string;
    grade: string;
    credits: number;
  }[];
  institutionName?: string;
  programName?: string;
  transcript?: string;
}

export interface FinancialStatement {
  id: string;
  studentId: string;
  studentName?: string;
  userId?: string;
  type: "disbursement" | "allocation" | "invoice" | "receipt";
  amount: number;
  date: string;
  description: string;
  reference: string;
  status: "pending" | "processed" | "cancelled" | "paid";
  attachmentUrl?: string;
  relatedApplicationId?: string;
  applicationId?: string;
  institutionName?: string;
  academicYear?: string;
  additionalItems?: Array<{ name: string; amount: number; description?: string }>;
  notes?: string;
  // Additional properties
  term?: string;
}

export type GuardianType = "relative" | "foster" | "institution" | "self" | "both-parents" | "single-parent" | "guardian" | "total-orphan";

export interface OrphanDetail {
  id: string;
  studentId: string;
  orphanType: "single" | "double";
  certificateUrl?: string;
  verified: boolean;
  guardianType?: GuardianType;
  guardianName?: string;
  guardianContact?: string;
  guardianRelationship?: string;
  // Additional properties for the OrphanStatusCard
  status?: GuardianType;
  paternalStatus?: string;
  maternalStatus?: string;
  yearOfParentalLoss?: string;
  hasLegalGuardian?: boolean;
  supportDocuments?: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  action?: {
    type: string;
    link: string;
  };
}
