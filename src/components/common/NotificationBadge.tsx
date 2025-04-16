
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  isRead: boolean;
  action?: {
    type: string;
    link: string;
  };
}

interface NotificationBadgeProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
  onViewAll: () => void;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onViewAll
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadCount} New
              </Badge>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                  onClick={() => onNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-blue-600' : ''}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs mt-1 h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(notification.id);
                      }}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No notifications yet
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Button variant="ghost" className="w-full" onClick={onViewAll}>
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBadge;
