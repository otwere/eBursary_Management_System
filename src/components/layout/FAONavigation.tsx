
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  DollarSign,
  Building,
  Clock,
  CreditCard,
  History,
  FileSpreadsheet,
  ArchiveX,
  Users,
  CheckCircle,
  Wallet,
  Send,
  ClipboardList,
  FileCheck,
  ListFilter,
  LayoutDashboard,
  BookOpen,
  Banknote,
  BadgePercent,
  CalendarClock
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
};

// Group navigation by categories for better organization
type NavGroup = {
  name: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    name: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/FAO/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        description: "Overview of fund allocation activities"
      },
    ]
  },
  {
    name: "Applications",
    items: [
      {
        title: "Applications Review",
        href: "/FAO/applications-review",
        icon: <BookOpen className="h-5 w-5" />,
        description: "Review pending applications"
      },
      {
        title: "Pending Allocations",
        href: "/FAO/pending-allocations",
        icon: <Clock className="h-5 w-5" />,
        description: "Applications awaiting fund allocation"
      },
      {
        title: "Allocations Queue",
        href: "/FAO/allocations-queue",
        icon: <ListFilter className="h-5 w-5" />,
        description: "Manage application fund allocation queue"
      },
      {
        title: "Allocation Management",
        href: "/FAO/allocation-management",
        icon: <CheckCircle className="h-5 w-5" />,
        description: "Manage approved fund allocations"
      }
    ]
  },
  {
    name: "Fund Management",
    items: [
      {
        title: "Fund Management",
        href: "/FAO/fund-management",
        icon: <DollarSign className="h-5 w-5" />,
        description: "Manage active fund sources"
      },
      {
        title: "Disbursement Tracking",
        href: "/FAO/disbursement-tracking",
        icon: <Send className="h-5 w-5" />,
        description: "Track fund disbursements to institutions"
      },
      {
        title: "Closed Funds",
        href: "/FAO/closed-funds",
        icon: <ArchiveX className="h-5 w-5" />,
        description: "View and manage closed funds"
      },
      {
        title: "Transaction History",
        href: "/FAO/transaction-history",
        icon: <History className="h-5 w-5" />,
        description: "View transaction records"
      }
    ]
  },
  {
    name: "Reports",
    items: [
      {
        title: "Financial Reports",
        href: "/FAO/financial-reports",
        icon: <FileSpreadsheet className="h-5 w-5" />,
        description: "Generate and view financial reports"
      }
    ]
  }
];

const FAONavigation = () => {
  const location = useLocation();

  // Flatten navGroups for mobile view
  const allNavItems = navGroups.flatMap(group => group.items);

  return (
    <div className="space-y-6">
      {navGroups.map((group, index) => (
        <div key={group.name} className="space-y-1">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {group.name}
          </h3>
          <nav className="space-y-1">
            {group.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  title={item.description}
                >
                  {item.icon}
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
};

export default FAONavigation;
