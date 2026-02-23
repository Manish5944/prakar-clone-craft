import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const NotificationPopover = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('header-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
        fetchNotifications();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setNotifications(data || []);
    setUnreadCount((data || []).filter(n => !n.read).length);
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white relative hover:bg-wallcraft-card"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-[hsl(220,20%,18%)] border-wallcraft-card rounded-xl overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wallcraft-card">
          <h3 className="text-foreground font-semibold text-base">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-4 py-8 flex flex-col items-center justify-center min-h-[140px]">
          {notifications.length === 0 ? (
            <>
              <div className="w-14 h-14 rounded-full bg-wallcraft-card flex items-center justify-center mb-4">
                <Bell className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold text-sm mb-1">No notifications yet</p>
              <p className="text-muted-foreground text-xs text-center">
                When you get notifications, they'll show up here.
              </p>
            </>
          ) : (
            <div className="w-full space-y-2">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-2 rounded-lg text-sm ${
                    n.read ? 'opacity-60' : 'bg-wallcraft-card/50'
                  }`}
                >
                  <p className="text-foreground font-medium text-xs">{n.title}</p>
                  <p className="text-muted-foreground text-xs truncate">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-wallcraft-card">
          <button
            onClick={() => navigate('/notifications')}
            className="w-full py-3 text-center text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;
