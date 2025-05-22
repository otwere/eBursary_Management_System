import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, CalendarDays, GraduationCap, Bell, Clock, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockApplications } from "@/data/mockData";
import { formatCurrency } from "@/utils/format";
import StatCard from "@/components/common/StatCard";
import ApplicationDeadlineCard from "@/components/student/ApplicationDeadlineCard";
import DeadlineDetailsModal from "@/components/student/DeadlineDetailsModal";
import AcademicRecordsCard from "@/components/student/AcademicRecordsCard";
import { ApplicationDeadline } from "@/types/auth";
import EducationLevelToggle, { EducationLevel } from "@/components/student/EducationLevelToggle";

// Mock data for deadlines
const mockDeadlines: ApplicationDeadline[] = [
  {
    id: "1",
    institutionType: "University",
    academicYear: "2023/2024",
    openingDate: "2023-05-01T00:00:00Z",
    closingDate: "2023-11-30T23:59:59Z",
    description: "University bursary applications for the 2023/2024 academic year",
    isActive: true
  },
  {
    id: "2",
    institutionType: "College",
    academicYear: "2023/2024",
    openingDate: "2023-05-15T00:00:00Z",
    closingDate: "2023-12-15T23:59:59Z",
    description: "College bursary applications for the 2023/2024 academic year",
    isActive: true
  },
  {
    id: "3",
    institutionType: "TVET",
    academicYear: "2023/2024",
    openingDate: "2023-06-01T00:00:00Z",
    closingDate: "2023-12-31T23:59:59Z",
    description: "TVET bursary applications for the 2023/2024 academic year",
    isActive: true
  },
  {
    id: "4",
    institutionType: "Secondary",
    academicYear: "2024",
    openingDate: "2023-11-01T00:00:00Z",
    closingDate: "2024-01-31T23:59:59Z",
    description: "Secondary school bursary applications for the 2024 academic year",
    isActive: false
  }
];

// Mock notifications for student
const mockNotifications = [
  {
    id: "notif-1",
    title: "Application Update",
    message: "Your application #APP-2023-001 has been reviewed and is pending approval.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false
  },
  {
    id: "notif-2",
    title: "Document Request",
    message: "Please upload your latest academic transcript for application #APP-2023-003.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: true
  }
];

// Mock academic records by education level
const mockAcademicRecordsByLevel = {
  primary: [
    {
      term: "Year 8",
      year: "2016",
      gpa: 4.0,
      status: "completed" as const,
      credits: 6,
      totalCredits: 6
    },
    {
      term: "Year 7",
      year: "2015",
      gpa: 3.9,
      status: "completed" as const,
      credits: 6,
      totalCredits: 6
    },
    {
      term: "Year 6",
      year: "2014",
      gpa: 3.7,
      status: "completed" as const,
      credits: 6,
      totalCredits: 6
    }
  ],
  secondary: [
    {
      term: "Form 4",
      year: "2020",
      gpa: 3.8,
      status: "completed" as const,
      credits: 8,
      totalCredits: 8
    },
    {
      term: "Form 3",
      year: "2019",
      gpa: 3.6,
      status: "completed" as const,
      credits: 8,
      totalCredits: 8
    },
    {
      term: "Form 2",
      year: "2018",
      gpa: 3.7,
      status: "completed" as const,
      credits: 8,
      totalCredits: 8
    },
    {
      term: "Form 1",
      year: "2017",
      gpa: 3.5,
      status: "completed" as const,
      credits: 8,
      totalCredits: 8
    }
  ],
  college: [
    {
      term: "Year 2",
      year: "2022",
      gpa: 3.9,
      status: "completed" as const,
      credits: 30,
      totalCredits: 30
    },
    {
      term: "Year 1",
      year: "2021",
      gpa: 3.7,
      status: "completed" as const,
      credits: 30,
      totalCredits: 30
    }
  ],
  university: [
    {
      term: "Fall",
      year: "2024",
      gpa: 3.7,
      status: "completed" as const,
      credits: 15,
      totalCredits: 15
    },
    {
      term: "Spring",
      year: "2025",
      gpa: 3.8,
      status: "in-progress" as const,
      credits: 9,
      totalCredits: 15
    },
    {
      term: "Summer",
      year: "2025",
      status: "upcoming" as const,
      credits: 0,
      totalCredits: 6
    }
  ]
};

// Education level metadata
const educationLevelMetadata = {
  primary: {
    program: "Primary Education",
    startDate: "2013-01-15",
    expectedGraduation: "2016-12-15",
    currentYear: 8,
    totalYears: 8
  },
  secondary: {
    program: "Secondary Education",
    startDate: "2017-01-15",
    expectedGraduation: "2020-12-15",
    currentYear: 4,
    totalYears: 4
  },
  college: {
    program: "Diploma in Information Technology",
    startDate: "2021-09-01",
    expectedGraduation: "2022-06-30",
    currentYear: 2,
    totalYears: 2
  },
  university: {
    program: "Bachelor of Science in Computer Science",
    startDate: "2023-09-01",
    expectedGraduation: "2026-06-30",
    currentYear: 2,
    totalYears: 4
  }
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDeadline, setSelectedDeadline] = useState<ApplicationDeadline | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("university");

  // Handle view details click
  const handleViewDetails = (deadline: ApplicationDeadline) => {
    setSelectedDeadline(deadline);
    setIsModalOpen(true);
  };

  // Handle education level selection
  const handleSelectEducationLevel = (level: EducationLevel) => {
    setEducationLevel(level);
  };

  // Get current education level metadata
  const currentLevelMetadata = educationLevelMetadata[educationLevel];

  // Mock data - replace with actual data fetching later
  const totalApplications = mockApplications.length;
  const submittedApplications = mockApplications.filter(app => app.status === "submitted").length;
  const approvedApplications = mockApplications.filter(app => app.status === "approved").length;
  const disbursedApplications = mockApplications.filter(app => app.status === "disbursed").length;
  const totalRequestedAmount = mockApplications.reduce((sum, app) => sum + app.requestedAmount, 0);
  const totalDisbursedAmount = mockApplications.reduce((sum, app) => sum + (app.disbursedAmount || 0), 0);

  return (
    <DashboardLayout title="Student Dashboard">
      <div className="space-y-4 -mx-[70px]">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-lg font-semibold text-blue-800">Welcome, {authState.user?.name}</h1>
              <p className="text-blue-600 mt-1 text-sm">
                {authState.user?.studentId && `Student ID : ${authState.user.studentId} | `}{authState.user?.institutionName}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-medium px-3 py-1">
                Academic Year 2025/2026
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Applications" 
            value={totalApplications.toString()}
            icon={<Book className="h-5 w-5" />}
            description={`${submittedApplications} Pending Review`}
            className="h-28 bg-red-50 hover:bg-red-100"
          />
          <StatCard 
            title="Total Requested" 
            value={formatCurrency(totalRequestedAmount)}
            icon={<Book className="h-5 w-5" />}
            description="Across all Applications"
            className="h-28 bg-blue-50 hover:bg-blue-100"
          />
          <StatCard 
            title="Total Disbursed" 
            value={formatCurrency(totalDisbursedAmount)}
            icon={<GraduationCap className="h-5 w-5" />}
            description={`${disbursedApplications} Funded Applications`}
            className="h-28 bg-green-50 hover:bg-green-100"
          />
          <StatCard 
            title="Academic Status" 
            value="Active"
            icon={<Book className="h-5 w-5" />}
            description={authState.user?.institutionType || "University"}
            trend={{ value: 100, isPositive: true }}
            className="h-28"
          />
        </div>

        {/* Upcoming Deadlines */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDeadlines.map((deadline) => (
              <ApplicationDeadlineCard 
                key={deadline.id} 
                deadline={deadline} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Quick Actions & Profile */}
          <div className="space-y-6 col-span-1 lg:col-span-3">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate("/student/applications/new")}
                >
                  <Book className="mr-2 h-4 w-4" />
                  New Application
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/student/statements")}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Financial Statements
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/student/profile")}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Academic Records
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start"
                  onClick={() => navigate("/student/notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                  {mockNotifications.filter(n => !n.isRead).length > 0 && (
                    <Badge className="ml-auto" variant="destructive">
                      {mockNotifications.filter(n => !n.isRead).length}
                    </Badge>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Student Profile */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {authState.user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-medium">{authState.user?.name}</div>
                  <div className="text-sm text-gray-500">{authState.user?.email}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {authState.user?.institutionName}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Academic Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Institution:</span>
                    <p className="font-medium">{authState.user?.institutionType || "University"}</p>
                  </div>
                  {authState.user?.studentId && (
                    <div>
                      <span className="text-gray-500">Student ID :</span>
                      <p className="font-medium">{authState.user.studentId}</p>
                    </div>
                  )}
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={() => navigate("/student/profile")}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
            
          {/* Academic Calendar */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CalendarDays className="h-5 w-5 mr-2" />
                Academic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-l-4 border-blue-400 pl-3 py-1">
                  <div>
                    <p className="font-medium">Start of Semester</p>
                    <p className="text-sm text-gray-500">September 1, 2025</p>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <div className="flex justify-between items-center border-l-4 border-green-400 pl-3 py-1">
                  <div>
                    <p className="font-medium">Midterm Exams</p>
                    <p className="text-sm text-gray-500">October 15-22, 2025</p>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
                <div className="flex justify-between items-center border-l-4 border-purple-400 pl-3 py-1">
                  <div>
                    <p className="font-medium">End of Semester</p>
                    <p className="text-sm text-gray-500">December 15, 2025</p>
                  </div>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Education Level Toggle and Academic Records Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Academic Records</h2>
            <EducationLevelToggle 
              selectedLevel={educationLevel}
              onSelectLevel={handleSelectEducationLevel}
            />
          </div>
          
          <AcademicRecordsCard
            studentId={authState.user?.studentId || ""}
            institutionName={authState.user?.institutionName || ""}
            institutionType={educationLevel === "university" ? "University" : 
                              educationLevel === "college" ? "College" :
                              educationLevel === "secondary" ? "Secondary School" : "Primary School"}
            program={currentLevelMetadata.program}
            startDate={currentLevelMetadata.startDate}
            expectedGraduation={currentLevelMetadata.expectedGraduation}
            currentYear={currentLevelMetadata.currentYear}
            totalYears={currentLevelMetadata.totalYears}
            records={mockAcademicRecordsByLevel[educationLevel]}
            educationLevel={educationLevel}
          />
        </div>
        
        {/* Modal for viewing deadline details */}
        <DeadlineDetailsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          deadline={selectedDeadline}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
