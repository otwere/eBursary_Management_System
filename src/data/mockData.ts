import { Application, FinancialStatement, User, UserRole, OrphanDetail, ApplicationStatus } from "@/types/auth";

// Status colors for applications
export const APPLICATION_STATUS_COLORS: Record<string, string> = {
  "draft": "bg-gray-100 text-gray-800",
  "submitted": "bg-blue-100 text-blue-800",
  "under-review": "bg-amber-100 text-amber-800",
  "corrections-needed": "bg-yellow-100 text-yellow-800",
  "approved": "bg-green-100 text-green-800",
  "allocated": "bg-emerald-100 text-emerald-800",
  "disbursed": "bg-teal-100 text-teal-800",
  "rejected": "bg-red-100 text-red-800"
};

// Status labels for applications
export const STATUS_LABELS: Record<string, string> = {
  "draft": "Draft",
  "submitted": "Submitted",
  "under-review": "Under Review",
  "corrections-needed": "Corrections Needed",
  "approved": "Approved",
  "allocated": "Allocated",
  "disbursed": "Disbursed",
  "rejected": "Rejected"
};

// Mock users
export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Pauline Mercy",
    email: "student@example.com",
    role: "student",
    institutionType: "University",
    orphanStatus: {
      id: "orphan1",
      studentId: "STD12345",
      orphanType: "double",
      verified: true,
      status: "total-orphan",
      paternalStatus: "deceased",
      maternalStatus: "deceased",
      yearOfParentalLoss: "2019",
      hasLegalGuardian: true,
      guardianRelationship: "aunt",
      supportDocuments: [
        "Death Certificate - Father.pdf",
        "Death Certificate - Mother.pdf",
        "Guardian Appointment Letter.pdf"
      ]
    },
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
    studentId: "STD12345"
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "aro@example.com",
    role: "ARO",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "user3",
    name: "Michael Johnson",
    email: "fao@example.com",
    role: "FAO",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "user4",
    name: "Otwere Evans",
    email: "fdo@example.com",
    role: "FDO",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  },
  {
    id: "user5",
    name: "Admin User",
    email: "admin@example.com",
    role: "superadmin",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z"
  }
];

// Mock applications
export const mockApplications: Application[] = [
  {
    id: "APP1001",
    userId: "user1",
    studentId: "user1",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    institutionType: "University",
    courseOfStudy: "Bachelor of Computer Science",
    applicationDate: "2023-09-15T08:00:00.000Z",
    lastUpdated: "2023-09-20T10:30:00.000Z",
    requestedAmount: 50000,
    status: "approved",
    fundCategory: "Undergraduate Bursary",
    academicYear: "2023/2024",
    academicRecords: [
      {
        term: "Fall",
        year: "2023",
        gpa: 3.7,
        status: "completed",
        credits: 15,
        totalCredits: 15
      },
      {
        term: "Spring",
        year: "2024",
        gpa: 3.8,
        status: "in-progress",
        credits: 12,
        totalCredits: 18
      }
    ],
    submittedAt: "2023-09-15T08:00:00.000Z",
    createdAt: "2023-09-10T08:00:00.000Z",
    reviewDate: "2023-09-18T10:30:00.000Z",
    approvalDate: "2023-09-20T10:30:00.000Z",
    reviewedBy: "Jane Smith",
    approvedAmount: 45000,
    allocationAmount: 45000
  },
  {
    id: "APP1002",
    userId: "user1",
    studentId: "user1",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    institutionType: "University",
    courseOfStudy: "Bachelor of Computer Science",
    applicationDate: "2023-06-10T09:15:00.000Z",
    requestedAmount: 35000,
    disbursedAmount: 30000,
    status: "disbursed",
    fundCategory: "Undergraduate Scholarship",
    academicYear: "2023/2024",
    reviewComments: "Application approved with reduced allocation based on funding constraints.",
    submittedAt: "2023-06-10T09:15:00.000Z",
    createdAt: "2023-06-05T09:15:00.000Z",
    reviewDate: "2023-06-15T09:15:00.000Z",
    approvalDate: "2023-06-20T09:15:00.000Z",
    reviewedBy: "Kevin mwangi",
    approvedAmount: 30000,
    allocationAmount: 30000,
    allocationDate: "2023-06-25T09:15:00.000Z",
    allocatedBy: "Michael Johnson",
    disbursementDate: "2023-06-30T09:15:00.000Z",
    disbursedBy: "Otwere Evans"
  },
  {
    id: "APP1003",
    userId: "user1",
    studentId: "user1",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    institutionType: "University",
    courseOfStudy: "Bachelor of Computer Science",
    applicationDate: "2024-01-20T14:30:00.000Z",
    lastUpdated: "2024-01-25T11:45:00.000Z",
    requestedAmount: 25000,
    status: "under-review",
    fundCategory: "Research Grant",
    academicYear: "2023/2024",
    submittedAt: "2024-01-20T14:30:00.000Z",
    createdAt: "2024-01-15T14:30:00.000Z",
    reviewDate: "2024-01-25T11:45:00.000Z",
    reviewedBy: "Kevin mwangi"
  },
  {
    id: "APP1004",
    userId: "user1",
    studentId: "user1",
    institutionId: "INST001",
    institutionName: "University of Nairobi",
    institutionType: "University",
    courseOfStudy: "Bachelor of Computer Science",
    applicationDate: "2023-03-05T10:00:00.000Z",
    lastUpdated: "2023-03-20T16:15:00.000Z",
    requestedAmount: 40000,
    status: "rejected",
    academicYear: "2022/2023",
    reviewComments: "Incomplete documentation provided. Please reapply with all required documents.",
    submittedAt: "2023-03-05T10:00:00.000Z",
    createdAt: "2023-03-01T10:00:00.000Z",
    reviewDate: "2023-03-15T10:00:00.000Z",
    reviewedBy: "Kevin Mwangi"
  }
];

// Mock financial statements
export const mockFinancialStatements: FinancialStatement[] = [
  {
    id: "FS1001",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2023-001",
    date: "2023-09-25T12:00:00.000Z",
    amount: 30000,
    description: "Tuition fee disbursement for Fall semester 2023",
    institutionName: "University of Nairobi",
    type: "disbursement",
    status: "processed",
    applicationId: "APP1001",
    academicYear: "2023/2024",
    term: "Fall"
  },
  {
    id: "FS1002",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2023-002",
    date: "2023-10-15T12:00:00.000Z",
    amount: 15000,
    description: "Books and learning materials allowance disbursement",
    institutionName: "University of Nairobi",
    type: "disbursement",
    status: "processed",
    applicationId: "APP1001",
    academicYear: "2023/2024",
    term: "Fall"
  },
  {
    id: "FS1003",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2024-001",
    date: "2024-01-30T12:00:00.000Z",
    amount: 35000,
    description: "Tuition fee disbursement for Spring semester 2024",
    institutionName: "University of Nairobi",
    type: "disbursement",
    status: "pending",
    applicationId: "APP1002",
    academicYear: "2023/2024",
    term: "Spring"
  },
  {
    id: "FS1004",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2023-003",
    date: "2023-11-05T12:00:00.000Z",
    amount: 10000,
    description: "Accommodation allowance disbursement",
    institutionName: "University of Nairobi",
    type: "disbursement",
    status: "processed",
    applicationId: "APP1002",
    academicYear: "2023/2024",
    term: "Fall"
  },
  {
    id: "FS1005",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2024-002",
    date: "2024-02-20T12:00:00.000Z",
    amount: 8000,
    description: "Research material funding allocation",
    institutionName: "University of Nairobi",
    type: "allocation",
    status: "pending",
    applicationId: "APP1003",
    academicYear: "2023/2024",
    term: "Spring"
  },
  {
    id: "FS1006",
    userId: "user1",
    studentId: "STD12345",
    reference: "BUR-2023-004",
    date: "2023-08-15T12:00:00.000Z",
    amount: 5000,
    description: "Special equipment funding for Computer Science project",
    institutionName: "University of Nairobi",
    type: "allocation",
    status: "cancelled",
    applicationId: "APP1003",
    academicYear: "2023/2024",
    term: "Fall"
  }
];

// Mock notifications
export const mockNotifications = [
  {
    id: "n1",
    title: "Application Status Updated",
    message: "Your application APP1001 has been approved!",
    date: new Date("2023-09-20T10:30:00.000Z"),
    isRead: false,
    action: {
      type: "application",
      link: "/student/applications/APP1001"
    }
  },
  {
    id: "n2",
    title: "Disbursement Completed",
    message: "Funds for application APP1002 have been successfully disbursed.",
    date: new Date("2023-06-25T15:45:00.000Z"),
    isRead: true,
    action: {
      type: "statement",
      link: "/student/statements"
    }
  },
  {
    id: "n3",
    title: "Application Under Review",
    message: "Your application APP1003 is now being reviewed by the ARO team.",
    date: new Date("2024-01-25T11:45:00.000Z"),
    isRead: false,
    action: {
      type: "application",
      link: "/student/applications/APP1003"
    }
  },
  {
    id: "n4",
    title: "New Statement Available",
    message: "A new financial statement BUR-2024-001 is available for viewing.",
    date: new Date("2024-01-30T12:00:00.000Z"),
    isRead: false,
    action: {
      type: "statement",
      link: "/student/statements"
    }
  },
  {
    id: "n5",
    title: "System Maintenance",
    message: "The system will be undergoing maintenance this weekend. Some features may be temporarily unavailable.",
    date: new Date("2024-02-15T09:00:00.000Z"),
    isRead: true
  }
];

// Deadline mock data for student dashboard
export const mockDeadlines = [
  {
    id: "d1",
    academicYear: "2023/2024",
    institutionType: "University",
    openingDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    closingDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    description: "University Bursary Applications for the 2023/2024 Academic Year",
    isActive: true
  },
  {
    id: "d2",
    academicYear: "2023/2024",
    institutionType: "College",
    openingDate: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    closingDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    description: "College Bursary Applications for the 2023/2024 Academic Year",
    isActive: true
  },
  {
    id: "d3",
    academicYear: "2023/2024",
    institutionType: "Secondary",
    openingDate: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    closingDate: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    description: "Secondary school Bursary Applications for the 2023/2024 Academic Year",
    isActive: false
  },
  {
    id: "d4",
    academicYear: "2023/2024",
    institutionType: "TVET",
    openingDate: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    closingDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    description: "TVET Bursary Applications for the 2023/2024 Academic Year",
    isActive: true
  }
];

// Recent activity mock data for student dashboard
export const mockActivities = [
  {
    id: "a1",
    type: "application",
    action: "submitted",
    date: new Date("2024-01-20T14:30:00.000Z"),
    details: "Application APP1003 submitted for processing",
    applicationId: "APP1003"
  },
  {
    id: "a2",
    type: "profile",
    action: "updated",
    date: new Date("2024-01-15T11:20:00.000Z"),
    details: "Contact information updated"
  },
  {
    id: "a3",
    type: "document",
    action: "uploaded",
    date: new Date("2024-01-12T09:45:00.000Z"),
    details: "Transcript uploaded for application APP1003",
    applicationId: "APP1003"
  },
  {
    id: "a4",
    type: "statement",
    action: "viewed",
    date: new Date("2024-01-05T16:30:00.000Z"),
    details: "Financial statement BUR-2023-002 viewed",
    statementId: "FS1002"
  },
  {
    id: "a5",
    type: "application",
    action: "viewed",
    date: new Date("2023-12-28T10:15:00.000Z"),
    details: "Application APP1002 details viewed",
    applicationId: "APP1002"
  }
];

// Helper function to get navigation items based on user role
export const getNavItems = (role: UserRole) => {
  const navItems: { label: string; href: string }[] = [];

  switch (role) {
    case "student":
      navItems.push(
        { label: "Dashboard", href: "/student" },
        { label: "Applications", href: "/student/applications" },
        { label: "Statements", href: "/student/statements" },
        { label: "Profile", href: "/student/profile" },
        { label: "Notifications", href: "/student/notifications" }
      );
      break;
    case "ARO":
      navItems.push(
        { label: "Dashboard", href: "/ARO" },
        { label: "Review Applications", href: "/ARO/review" },
        { label: "Reports", href: "/ARO/reports" }
      );
      break;
    case "FAO":
      navItems.push(
        { label: "Dashboard", href: "/FAO" },
        { label: "Fund Allocation", href: "/FAO/allocate" },
        { label: "Reports", href: "/FAO/reports" }
      );
      break;
    case "FDO":
      navItems.push(
        { label: "Dashboard", href: "/FDO" },
        { label: "Disbursements", href: "/FDO/disburse" },
        { label: "Reports", href: "/FDO/reports" }
      );
      break;
    case "superadmin":
      navItems.push(
        { label: "Dashboard", href: "/superadmin" },
        { label: "User Management", href: "/superadmin/users" },
        { label: "Roles & Permissions", href: "/superadmin/roles" },
        { label: "Reports", href: "/superadmin/reports" },
        { label: "Deadlines", href: "/superadmin/deadlines" }
      );
      break;
  }

  return navItems;
};

// Helper function to get role display name
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case "student":
      return "Student";
    case "ARO":
      return "Academic Review Officer";
    case "FAO":
      return "Financial Allocation Officer";
    case "FDO":
      return "Fund Disbursement Officer";
    case "superadmin":
      return "System Administrator";
    default:
      return role;
  }
};

// New helper functions

// Filter applications by status
export const getApplicationsByStatus = (status: ApplicationStatus): Application[] => {
  return mockApplications.filter(app => app.status === status);
};

// Get application by ID
export const getApplicationById = (id: string): Application | null => {
  return mockApplications.find(app => app.id === id) || null;
};

// Get applications by student ID
export const getApplicationsByStudentId = (studentId: string): Application[] => {
  return mockApplications.filter(app => app.studentId === studentId);
};

// Get applications for the current Academic Year
export const getCurrentYearApplications = (studentId: string): Application[] => {
  const currentYear = new Date().getFullYear();
  return getApplicationsByStudentId(studentId).filter(app => {
    const appDate = new Date(app.applicationDate);
    return appDate.getFullYear() === currentYear;
  });
};

// Get active applications (not completed or rejected)
export const getActiveApplications = (studentId: string): Application[] => {
  return getApplicationsByStudentId(studentId).filter(app => 
    !["disbursed", "rejected"].includes(app.status)
  );
};

// Get completed applications (disbursed or rejected)
export const getCompletedApplications = (studentId: string): Application[] => {
  return getApplicationsByStudentId(studentId).filter(app => 
    ["disbursed", "rejected"].includes(app.status)
  );
};

// Get total requested amount for a student
export const getTotalRequestedAmount = (studentId: string): number => {
  return getApplicationsByStudentId(studentId)
    .reduce((total, app) => total + app.requestedAmount, 0);
};

// Get total disbursed amount for a student
export const getTotalDisbursedAmount = (studentId: string): number => {
  return getApplicationsByStudentId(studentId)
    .reduce((total, app) => total + (app.disbursedAmount || 0), 0);
};
