"use client";
import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { getNavItems, getRoleDisplayName } from "@/utils/rbac"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LogOut,
  Menu,
  User,
  Bell,
  X,
  ChevronRight,
  Home,
  FileText,
  UserCheck,
  PieChart,
  Users,
  Shield,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  notificationBadge?: React.ReactNode
  countyName?: string
  constituencyName?: string
  applicationCount?: number
  totalFunds?: number
}

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <Home className="h-5 w-5" />,
  Profile: <User className="h-5 w-5" />,
  Applications: <FileText className="h-5 w-5" />,
  Statements: <FileText className="h-5 w-5" />,
  "Review Applications": <UserCheck className="h-5 w-5" />,
  "Fund Allocation": <FileText className="h-5 w-5" />,
  Disbursements: <FileText className="h-5 w-5" />,
  "User Management": <Users className="h-5 w-5" />,
  "Roles & Permissions": <Shield className="h-5 w-5" />,
  Reports: <PieChart className="h-5 w-5" />,
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  notificationBadge,
  countyName = "Nairobi",
  constituencyName = "Westlands",
}) => {
  const { authState, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!authState.user) {
    return null
  }

  const navItems = getNavItems(authState.user.role)
  const roleDisplayName = getRoleDisplayName(authState.user.role)

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1 mx-4">
          <h1 className="text-sm font-semibold text-center">{title || "Dashboard"}</h1>
          <div className="text-xs text-gray-500 text-center">
            {countyName} : {constituencyName}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notificationBadge}
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-none transform transition-transform duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <div className="font-bold text-xl text-primary-500">eBursary Portal</div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
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
                className={`w-full justify-start mb-1 ${window.location.pathname === item.href ? "bg-primary-50 text-primary-600" : ""}`}
                onClick={() => {
                  navigate(item.href)
                  setSidebarOpen(false)
                }}
              >
                {iconMap[item.label] || <ChevronRight className="mr-2 h-4 w-4" />}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}

            <Separator className="my-4" />

            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              <span className="ml-2">Log Out</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-none">
          <div className="p-4 border-b">
            <div className="font-bold text-xl text-primary-500">eBursary Portal</div>
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
                className={`w-full justify-start mb-1 ${window.location.pathname === item.href ? "bg-primary-50 text-primary-600" : ""}`}
                onClick={() => navigate(item.href)}
              >
                {iconMap[item.label] || <ChevronRight className="mr-2 h-4 w-4" />}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}

            <Separator className="my-4" />

            <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
              <LogOut className="mr-2 h-5 w-5" />
              <span className="ml-2">Log Out</span>
            </Button>
          </nav>
        </div>

        <div className="fixed top-0 left-64 right-0 z-10 bg-white border-b">
          <div className="px-6 py-[10px]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl text-primary-800 font-bold">{title || "Dashboard"}</h1>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <div className="flex flex-wrap justify-end gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">County :</span>
                      <span>{countyName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Constituency :</span>
                      <span>{constituencyName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    <span>Last updated : {formatDateTime(currentDateTime)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {notificationBadge || (
                    <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-[60px] lg:pt-[120px] min-h-screen">
        <main className="p-4 md:p-4 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}

export { DashboardLayout }
export default DashboardLayout
