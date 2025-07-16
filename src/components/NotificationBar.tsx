import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Notification } from "@/hooks/useNotifications";

interface NotificationBarProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: 'border-green-500/50 bg-green-500/10 text-green-400',
  error: 'border-red-500/50 bg-red-500/10 text-red-400',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
};

export const NotificationBar = ({ notifications, onRemove }: NotificationBarProps) => {
  return (
    <div className="fixed top-4 right-4 z-40 space-y-2">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];
        const colorClass = colorMap[notification.type];
        
        return (
          <div
            key={notification.id}
            className={`glass-card border p-4 rounded-lg flex items-center gap-3 min-w-80 animate-slide-up ${colorClass}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">
              {notification.message}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(notification.id)}
              className="w-6 h-6 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};