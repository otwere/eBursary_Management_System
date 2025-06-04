
import { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Get navigation items based on user role
 */
export const getNavItems = (role: UserRole): NavItem[] => {
  switch (role) {
    case "student":
      return [
        { label: "Dashboard", href: "/student" },
        { label: "Applications", href: "/student/applications" },
        { label: "Statements", href: "/student/statements" },
        { label: "Notifications", href: "/student/notifications" },
        { label: "Profile", href: "/student/profile" },
      ];
    case "ARO":
      return [
        { label: "Dashboard", href: "/ARO" },
        { label: "Review Applications", href: "/ARO/applications" },
        { label: "Student Applications", href: "/ARO/student-applications" },
        { label: "Pending FAO Review", href: "/ARO/pending-fao" },
        { label: "Reports", href: "/ARO/reports" },
        { label: "Profile", href: "/ARO/profile" },
      ];
    case "FAO":
      return [
        { label: "Dashboard", href: "/FAO" },
        { label: "Fund Management", href: "/FAO/fund-management" },
        { label: "Allocation Management", href: "/FAO/allocation-management" },
        { label: "Disbursement Tracking", href: "/FAO/disbursement-tracking" },
        { label: "Financial Reports", href: "/FAO/financial-reports" },
        { label: "Transaction History", href: "/FAO/transaction-history" },
        { label: "Profile", href: "/FAO/profile" },
      ];
    case "FDO":
      return [
        { label: "Dashboard", href: "/FDO" },
        { label: "Disbursements", href: "/FDO/disbursements" },
        { label: "Student Applications", href: "/FDO/student-applications" },
        { label: "Reports", href: "/FDO/reports" },
        { label: "Profile", href: "/FDO/profile" },
      ];
    case "superadmin":
      return [
        { label: "Dashboard", href: "/superadmin" },
        { label: "User Management", href: "/superadmin/users" },
        { label: "Application Deadlines", href: "/superadmin/deadlines" },
        { label: "Student Applications", href: "/superadmin/student-applications" },
        { label: "Roles & Permissions", href: "/superadmin/roles" },
        { label: "Reports", href: "/superadmin/reports" },
        { label: "System Settings", href: "/superadmin/settings" },
      ];
    default:
      return [];
  }
};

/**
 * Get user friendly role name
 */
export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case "student":
      return "Student";
    case "ARO":
      return "Applications Review Officer";
    case "FAO":
      return "Funds Manager Officer";
    case "FDO":
      return "Fund Disbursement Officer";
    case "superadmin":
      return "System Administrator";
    default:
      return role;
  }
};

/**
 * Check if a user role has access to student applications section
 */
export const canAccessStudentApplications = (role: UserRole): boolean => {
  return ["ARO", "FAO", "FDO", "superadmin"].includes(role);
};

/**
 * Get application review permissions based on role
 */
export const getApplicationPermissions = (role: UserRole): { 
  canReview: boolean; 
  canAllocate: boolean; 
  canDisburse: boolean; 
  canApprove: boolean;
  canSubmitToFAO: boolean;
  canEditAllocationAmount: boolean;
} => {
  switch (role) {
    case "ARO":
      return { 
        canReview: true, 
        canAllocate: false, 
        canDisburse: false, 
        canApprove: true, 
        canSubmitToFAO: true,
        canEditAllocationAmount: false
      };
    case "FAO":
      return { 
        canReview: true, 
        canAllocate: true, 
        canDisburse: false, 
        canApprove: false,
        canSubmitToFAO: false,
        canEditAllocationAmount: true
      };
    case "FDO":
      return { 
        canReview: true, 
        canAllocate: false, 
        canDisburse: true, 
        canApprove: false,
        canSubmitToFAO: false,
        canEditAllocationAmount: false
      };
    case "superadmin":
      return { 
        canReview: true, 
        canAllocate: true, 
        canDisburse: true, 
        canApprove: true,
        canSubmitToFAO: true,
        canEditAllocationAmount: true
      };
    default:
      return { 
        canReview: false, 
        canAllocate: false, 
        canDisburse: false, 
        canApprove: false,
        canSubmitToFAO: false,
        canEditAllocationAmount: false
      };
  }
};

/**
 * Check if a user can edit the allocation amount
 * Only FAO and superadmin can edit allocation amounts
 */
export const canEditAllocationAmount = (role: UserRole): boolean => {
  return ["FAO", "superadmin"].includes(role);
};

/**
 * Get workflow status transition options based on role
 */
export const getAllowedStatusTransitions = (role: UserRole, currentStatus: string): string[] => {
  switch (role) {
    case "ARO":
      if (currentStatus === "submitted") {
        return ["under-review", "corrections-needed", "approved", "rejected"];
      } else if (currentStatus === "under-review") {
        return ["corrections-needed", "approved", "rejected"];
      } else if (currentStatus === "corrections-needed") {
        return ["under-review", "approved", "rejected"];
      }
      return [];
    
    case "FAO":
      if (currentStatus === "approved" || currentStatus === "pending-allocation") {
        return ["allocated", "rejected"];
      }
      return [];
    
    case "FDO":
      if (currentStatus === "allocated") {
        return ["disbursed", "rejected"];
      }
      return [];
    
    case "superadmin":
      return [
        "submitted", "under-review", "corrections-needed", 
        "approved", "pending-allocation", "allocated", 
        "disbursed", "rejected"
      ];
    
    default:
      return [];
  }
};
