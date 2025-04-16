
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, School, Clock, CalendarDays, BookOpen, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EducationLevel } from "./EducationLevelToggle";
import { AcademicRecord } from "@/types/auth";

interface AcademicRecordsCardProps {
  studentId: string;
  institutionName: string;
  institutionType: string;
  program: string;
  startDate?: string;
  expectedGraduation: string;
  currentYear?: number;
  totalYears?: number;
  records?: AcademicRecord[];
  educationLevel?: EducationLevel;
  semester?: string; // Added semester as an optional prop
}

const AcademicRecordsCard: React.FC<AcademicRecordsCardProps> = ({
  studentId,
  institutionName,
  institutionType,
  program,
  startDate = new Date().toISOString().split('T')[0], // Default to today
  expectedGraduation,
  currentYear = 3,
  totalYears = 4,
  records = [],
  educationLevel = "university",
  semester
}) => {
  // Calculate program completion percentage
  const completionPercentage = Math.round((currentYear / totalYears) * 100);
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "upcoming":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get icon based on education level
  const getLevelIcon = () => {
    switch (educationLevel) {
      case "primary":
        return <School className="h-5 w-5" />;
      case "secondary":
        return <BookOpen className="h-5 w-5" />;
      case "college":
        return <Award className="h-5 w-5" />;
      case "university":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  // Get education level title
  const getLevelTitle = () => {
    switch (educationLevel) {
      case "primary":
        return "Primary Education Records";
      case "secondary":
        return "Secondary Education Records";
      case "college":
        return "College Education Records";
      case "university":
        return "University Education Records";
      default:
        return "Academic Records";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getLevelIcon()}
          {getLevelTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Academic Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Student ID:</span>
              <span className="text-sm font-medium">{studentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Institution:</span>
              <div className="flex items-center">
                <School className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-sm font-medium">{institutionName}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Program:</span>
              <div className="flex items-center">
                <BookOpen className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-sm font-medium">{program}</span>
              </div>
            </div>
            {semester && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Semester:</span>
                <span className="text-sm font-medium">{semester}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Start Date:</span>
              <div className="flex items-center">
                <CalendarDays className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-sm font-medium">{formatDate(startDate)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Expected Graduation:</span>
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-gray-500" />
                <span className="text-sm font-medium">{formatDate(expectedGraduation)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Current Level:</span>
              <Badge variant="outline">Year {currentYear} of {totalYears}</Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Program Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Academic Records Table */}
        {records.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">{educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1)} Term Records:</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Term</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Year</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">GPA</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Credits</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2 text-sm">{record.term}</td>
                      <td className="px-4 py-2 text-sm">{record.year}</td>
                      <td className="px-4 py-2 text-sm">
                        {record.gpa !== undefined ? record.gpa.toFixed(2) : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {record.credits} / {record.totalCredits}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <Badge variant="outline" className={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AcademicRecordsCard;
