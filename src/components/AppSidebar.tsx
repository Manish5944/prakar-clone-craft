import { Home, Heart, Download, Settings, Crown, HelpCircle, Star, Share2, Music, Users, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Downloads", url: "/downloads", icon: Download },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Premium", url: "/premium", icon: Crown },
  { title: "Support", url: "/support", icon: HelpCircle },
];

const socialItems = [
  { title: "Rate App", url: "#rate", icon: Star, external: true },
  { title: "Share App", url: "#share", icon: Share2, external: true },
  { title: "Follow on TikTok", url: "https://tiktok.com", icon: Music, external: true },
  { title: "Artist Program", url: "/artist-program", icon: Users },
  { title: "Terms & Privacy", url: "/terms", icon: FileText },
];

export function AppSidebar() {
  const { open } = useSidebar();

  const getNavClass = (isActive: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive 
        ? "bg-wallcraft-cyan/20 text-wallcraft-cyan border-r-2 border-wallcraft-cyan" 
        : "text-muted-foreground hover:text-foreground hover:bg-wallcraft-card"
    }`;

  return (
    <Sidebar className="border-r border-wallcraft-card bg-wallcraft-dark">
      <SidebarContent className="bg-wallcraft-dark">
        {/* Logo */}
        <div className="p-4 border-b border-wallcraft-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-foreground">Prompt Copy</span>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavClass(isActive)}
                      end
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => getNavClass(isActive)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Social & More */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            More
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {socialItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.external && item.url.startsWith('http') ? (
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={getNavClass(false)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => getNavClass(isActive)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}