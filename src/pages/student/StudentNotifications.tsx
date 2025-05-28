
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCircle, Clock, FileText, MessageSquare, RefreshCcw } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { format } from "date-fns";
import EmptyState from "@/components/common/EmptyState";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  type: 'application' | 'system' | 'payment';
  isRead: boolean;
  action?: {
    type: string;
    link: string;
  };
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Application Status Updated",
    message: "Your application A12345 has been approved by the ARO.",
    date: new Date(2023, 11, 15),
    type: "application",
    isRead: false,
    action: {
      type: "view",
      link: "/student/applications/A12345"
    }
  },
  {
    id: "n2",
    title: "Bursary Disbursement",
    message: "Your bursary funds of KES 50,000 have been disbursed to your institution.",
    date: new Date(2023, 11, 10),
    type: "payment",
    isRead: true,
    action: {
      type: "view",
      link: "/student/statements"
    }
  },
  {
    id: "n3",
    title: "Document Verification Required",
    message: "Please upload your latest academic transcript for application A67890.",
    date: new Date(2023, 10, 28),
    type: "application",
    isRead: true,
    action: {
      type: "upload",
      link: "/student/applications/A67890/edit"
    }
  },
  {
    id: "n4",
    title: "Application Reminder",
    message: "The deadline for Bursary Applications for the next semester is approaching on January 31, 2024.",
    date: new Date(2023, 10, 15),
    type: "system",
    isRead: true,
  },
  {
    id: "n5",
    title: "Profile Update",
    message: "Please update your contact information and institution details.",
    date: new Date(2023, 9, 27),
    type: "system",
    isRead: true,
    action: {
      type: "update",
      link: "/student/profile"
    }
  },
];

const NotificationCard: React.FC<{ notification: Notification; onMarkAsRead: (id: string) => void }> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'application':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={!notification.isRead ? "border-l-4 border-l-blue-500" : ""}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="mt-1">
            {getIcon()}
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
              <h3 className={`font-medium ${!notification.isRead ? "text-blue-600" : ""}`}>
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {format(notification.date, 'MMM dd, yyyy')}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
            
            <div className="flex justify-between items-center mt-3">
              <div>
                {notification.action && (
                  <Button variant="ghost" size="sm" className="text-primary pl-0 h-auto">
                    View Details
                  </Button>
                )}
              </div>
              
              {!notification.isRead && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadNotifications = notifications.filter(n => !n.isRead);
  const applicationNotifications = notifications.filter(n => n.type === 'application');
  const paymentNotifications = notifications.filter(n => n.type === 'payment');
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };
  
  return (
    <DashboardLayout title="Notifications">
      <div className="space-y-2 lg:-mx-[80px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-blue-50 h-20 px-4 rounded border-l-4 border-l-purple-500 border-b-2 ">
          <div>
            <h1 className="text-xl text-blue-800 font-bold -mt-4">Notifications</h1>
            <p className="text-muted-foreground text-sm mt-0">Stay updated with your Application status and System Alerts</p>
          </div>
          
          {unreadNotifications.length > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadNotifications.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">
                  {unreadNotifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="payment">Financial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {notifications.length > 0 ? (
              <div className="space-y-4 mt-4">
                {notifications.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={handleMarkAsRead} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No notifications"
                description="You don't have any notifications yet"
                icon={<Bell className="h-8 w-8 text-gray-400" />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="unread">
            {unreadNotifications.length > 0 ? (
              <div className="space-y-4 mt-4">
                {unreadNotifications.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={handleMarkAsRead} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No unread notifications"
                description="You have read all your notifications"
                icon={<CheckCircle className="h-8 w-8 text-gray-400" />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="application">
            {applicationNotifications.length > 0 ? (
              <div className="space-y-4 mt-4">
                {applicationNotifications.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={handleMarkAsRead} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No application notifications"
                description="You don't have any application-related notifications"
                icon={<FileText className="h-8 w-8 text-gray-400" />}
              />
            )}
          </TabsContent>
          
          <TabsContent value="payment">
            {paymentNotifications.length > 0 ? (
              <div className="space-y-4 mt-4">
                {paymentNotifications.map(notification => (
                  <NotificationCard 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={handleMarkAsRead} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No financial notifications"
                description="You don't have any financial or payment notifications"
                icon={<Clock className="h-8 w-8 text-gray-400" />}
              />
            )}
          </TabsContent>
        </Tabs>
        
        {notifications.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="text-gray-600">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Load More
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotifications;
