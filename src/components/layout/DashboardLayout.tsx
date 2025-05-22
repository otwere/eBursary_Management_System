import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getNavItems, getRoleDisplayName } from "@/utils/rbac";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut, Menu, User, Bell, X, ChevronRight, Home, 
  FileText, UserCheck, PieChart, Users, Shield 
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  notificationBadge?: React.ReactNode;
}

const iconMap: Record<string, React.ReactNode> = {
  "Dashboard": <Home className="h-5 w-5" />,
  "Profile": <User className="h-5 w-5" />,
  "Applications": <FileText className="h-5 w-5" />,
  "Statements": <FileText className="h-5 w-5" />,
  "Review Applications": <UserCheck className="h-5 w-5" />,
  "Fund Allocation": <FileText className="h-5 w-5" />,
  "Disbursements": <FileText className="h-5 w-5" />,
  "User Management": <Users className="h-5 w-5" />,
  "Roles & Permissions": <Shield className="h-5 w-5" />,
  "Reports": <PieChart className="h-5 w-5" />,
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title,
  notificationBadge 
}) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!authState.user) {
    return null;
  }

  const navItems = getNavItems(authState.user.role);
  const roleDisplayName = getRoleDisplayName(authState.user.role);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">
          {title || "Dashboard"}
        </h1>
        <div className="flex items-center gap-2">
          {notificationBadge}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
           onClick={() => setSidebarOpen(false)}>
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <div className="font-bold text-xl text-primary-500">
              eBursary  Portal
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-4 py-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${authState.user.name}`} />
                <AvatarFallback>{authState.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{authState.user.name}</p>
                <p className="text-sm text-gray-500">{roleDisplayName}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start mb-1 ${window.location.pathname === item.href ? 'bg-primary-50 text-primary-600' : ''}`}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
              >
                {iconMap[item.label] || <ChevronRight className="mr-2 h-4 w-4" />}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
            
            <Separator className="my-4" />
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="ml-2">Log Out</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm">
          <div className="p-4 border-b">
            <div className="font-bold text-xl text-primary-500">
              eBursary  Portal
            </div>
          </div>

          <div className="px-4 py-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${authState.user.name}`} />
                <AvatarFallback>{authState.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{authState.user.name}</p>
                <p className="text-sm text-gray-500">{roleDisplayName}</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start mb-1 ${window.location.pathname === item.href ? 'bg-primary-50 text-primary-600' : ''}`}
                onClick={() => navigate(item.href)}
              >
                {iconMap[item.label] || <ChevronRight className="mr-2 h-4 w-4" />}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
            
            <Separator className="my-4" />
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="ml-2">Log Out</span>
            </Button>
          </nav>
        </div>

        <div className="fixed top-0 left-64 right-0 z-10 bg-white border-b h-16 flex items-center px-6 justify-between">
          <h1 className="text-xl font-semibold">
            {title || "Dashboard"}
          </h1>
          
          <div className="flex items-center space-x-4">
            {notificationBadge || (
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-[60px] lg:pt-16 min-h-screen">
        <main className="p-4 md:p-4 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };  // Add named export alongside default export
export default DashboardLayout;
