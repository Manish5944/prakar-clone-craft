import { User as SupabaseUser } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, CreditCard, Bell, UserCircle, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  user: SupabaseUser;
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-wallcraft-card">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-[hsl(220,20%,14%)] border-wallcraft-card rounded-xl p-0 overflow-hidden"
        align="end"
        sideOffset={8}
      >
        {/* User info header */}
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-medium truncate">{user.email}</p>
            <p className="text-muted-foreground text-xs truncate">{displayName}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-wallcraft-card m-0" />

        {/* My Credits */}
        <DropdownMenuItem
          className="flex items-center justify-between px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/premium")}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">My Credits</span>
          </div>
          <span className="text-muted-foreground text-sm font-semibold">0</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-wallcraft-card m-0" />

        {/* Menu items */}
        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Account</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/premium")}
        >
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Plans</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/settings")}
        >
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={() => navigate("/admin")}
        >
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">Publish existing prompt</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-wallcraft-card m-0" />

        {/* Logout */}
        <DropdownMenuItem
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-wallcraft-card cursor-pointer rounded-none"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
