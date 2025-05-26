
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CalendarClock, AlertTriangle, CheckCircle, School } from "lucide-react";
import { ApplicationDeadline, InstitutionType } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationDeadlineCardProps {
  deadline: ApplicationDeadline;
  onViewDetails: (deadline: ApplicationDeadline) => void;
}

// Map of institution types to their icons
const institutionIcons: Record<InstitutionType, React.ReactNode> = {
  "Secondary": <School className="h-5 w-5 text-blue-500" />,
  "TVET": <School className="h-5 w-5 text-orange-500" />,
  "College": <School className="h-5 w-5 text-green-500" />,
  "University": <School className="h-5 w-5 text-purple-500" />
};

// Map of institution types to their theme colors
const institutionColors: Record<InstitutionType, string> = {
  "Secondary": "from-blue-50 to-blue-100",
  "TVET": "from-orange-50 to-orange-100",
  "College": "from-green-50 to-green-100",
  "University": "from-purple-50 to-purple-100"
};

const ApplicationDeadlineCard: React.FC<ApplicationDeadlineCardProps> = ({ deadline, onViewDetails }) => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  
  // Calculate time remaining state for countdown timer
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  
  // Update countdown timer
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const closingDate = new Date(deadline.closingDate);
      const currentDate = new Date();
      const totalMilliseconds = closingDate.getTime() - currentDate.getTime();
      
      if (totalMilliseconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }
      
      const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds, total: totalMilliseconds };
    };
    
    // Update timer immediately
    setTimeRemaining(calculateTimeRemaining());
    
    // Set up interval to update timer
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [deadline.closingDate]);
  
  // Determine if deadline is expired
  const isExpired = timeRemaining.total <= 0;
  
  // Calculate progress bar (days remaining as percentage of 30 days)
  const totalDays = 30; // Assuming a standard period of 30 days
  const daysElapsed = isExpired ? totalDays : totalDays - timeRemaining.days;
  const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Format the deadline display
  const formattedDeadline = new Date(deadline.closingDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // Determine status message and color
  let statusMessage: string;
  let statusColor: string;
  
  if (isExpired) {
    statusMessage = "Applications Closed";
    statusColor = "text-red-600";
  } else if (timeRemaining.days <= 3) {
    statusMessage = "Closing Soon";
    statusColor = "text-amber-600";
  } else {
    statusMessage = "Applications Open";
    statusColor = "text-green-600";
  }
  
  // Check if student's institution type matches the deadline's institution type
  const canApply = authState.user?.institutionType === deadline.institutionType && !isExpired && deadline.isActive;
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${
      isExpired ? 'border-l-red-500' : 'border-l-green-500'
    }`}>
      <CardHeader className={`pb-2 bg-gradient-to-r ${institutionColors[deadline.institutionType]}`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {institutionIcons[deadline.institutionType]}
            <CardTitle className="text-lg">{deadline.institutionType} Applications</CardTitle>
          </div>
          <Badge variant={isExpired ? "destructive" : "outline"}>
            {deadline.academicYear}
          </Badge>
        </div>
        <CardDescription className="text-gray-600">
          {deadline.description || `${deadline.institutionType} Bursary Applications for ${deadline.academicYear}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Deadline: {formattedDeadline}</span>
            </div>
            <div className={`text-sm font-medium ${statusColor}`}>
              {statusMessage}
            </div>
          </div>
          
          {/* Progress bar for time remaining */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Time Remaining</span>
              <span>{progress.toFixed(0)}% elapsed</span>
            </div>
            <Progress value={progress} className="h-2" 
              color={isExpired ? "bg-red-500" : timeRemaining.days <= 3 ? "bg-amber-500" : "bg-green-500"}
            />
          </div>
          
          {/* Dynamic Countdown display */}
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className={`p-2 rounded ${isExpired ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="text-xl font-bold">{isExpired ? 0 : timeRemaining.days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
            <div className={`p-2 rounded ${isExpired ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="text-xl font-bold">{isExpired ? 0 : timeRemaining.hours}</div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </div>
            <div className={`p-2 rounded ${isExpired ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="text-xl font-bold">{isExpired ? 0 : timeRemaining.minutes}</div>
              <div className="text-xs text-muted-foreground">Min</div>
            </div>
            <div className={`p-2 rounded ${isExpired ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="text-xl font-bold">{isExpired ? 0 : timeRemaining.seconds}</div>
              <div className="text-xs text-muted-foreground">Sec</div>
            </div>
          </div>

          {/* Institution Eligibility */}
          {!canApply && !isExpired && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-amber-700">
                  {authState.user?.institutionType !== deadline.institutionType 
                    ? `This bursary is only for ${deadline.institutionType} students` 
                    : "You cannot apply at this time"}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-gray-50 pt-4 pb-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 mr-2"
          onClick={() => onViewDetails(deadline)}
        >
          <Clock className="mr-2 h-4 w-4" />
          View Details
        </Button>
        <Button
          variant={isExpired || !deadline.isActive || !canApply ? "outline" : "default"}
          size="sm"
          className="flex-1 ml-2"
          disabled={isExpired || !deadline.isActive || !canApply}
          onClick={() => navigate("/student/applications/new")}
        >
          {isExpired || !deadline.isActive ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Closed
            </>
          ) : !canApply ? (
            <>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Not Eligible
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Apply Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApplicationDeadlineCard;
