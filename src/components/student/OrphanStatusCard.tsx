
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Heart, Calendar, File, Users, Shield } from "lucide-react";
import { OrphanDetail, GuardianType } from "@/types/auth";

interface OrphanStatusCardProps {
  orphanStatus?: OrphanDetail;
}

const OrphanStatusCard: React.FC<OrphanStatusCardProps> = ({ orphanStatus }) => {
  // Use a default value if orphanStatus is not provided
  const defaultStatus: OrphanDetail = {
    id: 'default-id',
    studentId: 'default-student',
    orphanType: "single",
    verified: false,
    guardianType: "both-parents"
  };

  // Use the orphanStatus prop or the default value
  const statusData = orphanStatus || defaultStatus;

  const getStatusLabel = (status: GuardianType) => {
    switch (status) {
      case "both-parents":
        return "Living with Both Parents";
      case "single-parent":
        return "Single Parent";
      case "guardian":
        return "Living with Guardian";
      case "total-orphan":
        return "Total Orphan";
      default:
        return "Unknown Status";
    }
  };

  const getStatusBadgeColor = (status: GuardianType) => {
    switch (status) {
      case "both-parents":
        return "bg-green-100 text-green-800 border-green-200";
      case "single-parent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "guardian":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "total-orphan":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getParentStatusLabel = (status?: string) => {
    switch (status) {
      case "deceased":
        return "Deceased";
      case "unknown":
        return "Unknown";
      case "absent":
        return "Absent";
      default:
        return "Not Specified";
    }
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" />
          Guardian Status Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex flex-wrap justify-between items-center">
          <h3 className="text-base font-medium">Current Status</h3>
          <Badge variant="outline" className={getStatusBadgeColor(statusData.guardianType as GuardianType)}>
            {getStatusLabel(statusData.guardianType as GuardianType)}
          </Badge>
        </div>

        {(statusData.guardianType === "total-orphan" || statusData.guardianType === "single-parent") && (
          <div className="bg-gray-50 p-4 rounded border space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-500" />
                  Paternal Status
                </h4>
                <Badge variant="outline" className={
                  statusData.paternalStatus === "deceased" ? "bg-amber-100 text-amber-800" : 
                  "bg-gray-100 text-gray-800"
                }>
                  {getParentStatusLabel(statusData.paternalStatus)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-500" />
                  Maternal Status
                </h4>
                <Badge variant="outline" className={
                  statusData.maternalStatus === "deceased" ? "bg-amber-100 text-amber-800" : 
                  "bg-gray-100 text-gray-800"
                }>
                  {getParentStatusLabel(statusData.maternalStatus)}
                </Badge>
              </div>
              
              {statusData.yearOfParentalLoss && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Year of Parental Loss
                  </h4>
                  <p className="text-sm">{statusData.yearOfParentalLoss}</p>
                </div>
              )}
              
              {statusData.guardianRelationship && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    Guardian Relationship
                  </h4>
                  <p className="text-sm capitalize">{statusData.guardianRelationship}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Shield className="h-4 w-4 text-gray-500" />
                Legal Guardian Status
              </h4>
              <p className="text-sm">
                {statusData.hasLegalGuardian ? 
                  "Student has a legally appointed guardian" : 
                  "No legally appointed guardian"
                }
              </p>
            </div>
            
            {statusData.supportDocuments && statusData.supportDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <File className="h-4 w-4 text-gray-500" />
                  Supporting Documents
                </h4>
                <ul className="text-sm space-y-1">
                  {statusData.supportDocuments.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <File className="h-3 w-3 mr-1 text-blue-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!(statusData.guardianType === "total-orphan" || statusData.guardianType === "single-parent") && (
          <div className="text-sm text-gray-500 italic">
            No additional guardian details required for this status.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrphanStatusCard;
