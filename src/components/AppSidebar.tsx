import { useState } from "react";
import { 
  Home, 
  Shuffle, 
  Heart, 
  Download, 
  History, 
  FolderOpen, 
  Crown, 
  Zap, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Calendar,
  Smartphone,
  Tablet,
  Monitor,
  Tv,
  Youtube,
  Settings,
  MessageCircle,
  StarHalf,
  Share,
  Users,
  Shield
} from "lucide-react";
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
  { title: "Wallpaper Changer", url: "/wallpaper-changer", icon: Shuffle },
  { title: "Favorites", url: "/favorites", icon: Heart },
  { title: "Downloads", url: "/downloads", icon: Download },
  { title: "History", url: "/history", icon: History },
  { title: "Collections", url: "/collections", icon: FolderOpen },
  { title: "Premium", url: "/premium", icon: Crown },
  { title: "Live Wallpapers", url: "/live-wallpapers", icon: Zap },
  { title: "New & Fresh", url: "/new-fresh", icon: Sparkles },
  { title: "Top Rated", url: "/top-rated", icon: Star },
  { title: "Trending", url: "/trending", icon: TrendingUp },
  { title: "Daily Picks", url: "/daily-picks", icon: Calendar },
];

const deviceTypes = [
  { title: "Mobile", url: "/mobile", icon: Smartphone },
  { title: "Tablet", url: "/tablet", icon: Tablet },
  { title: "Desktop", url: "/desktop", icon: Monitor },
  { title: "4K Ultra HD", url: "/4k-ultra-hd", icon: Tv },
];

const moreItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Support", url: "/support", icon: MessageCircle },
  { title: "Rate App", url: "/rate-app", icon: StarHalf },
  { title: "Share App", url: "/share-app", icon: Share },
  { title: "Follow on TikTok", url: "/tiktok", icon: Users },
  { title: "Artist Program", url: "/artist-program", icon: Users },
  { title: "Terms & Privacy", url: "/terms-privacy", icon: Shield },
  { title: "Admin Panel", url: "/admin", icon: Settings },
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
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-lg text-foreground">WallpapersCraft</span>
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
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

        {/* Device Types */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            Device Types
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {deviceTypes.map((item) => (
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

        {/* YouTube Thumbnails */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            YouTube Thumbnails
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/youtube-thumbnails" 
                    className={({ isActive }) => getNavClass(isActive)}
                  >
                    <Youtube className="h-5 w-5 flex-shrink-0" />
                    <span>YouTube Thumbnails</span>
                    <span className="ml-auto bg-wallcraft-cyan/20 text-wallcraft-cyan text-xs px-2 py-1 rounded-full">
                      150
                    </span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* More */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide px-3 py-2">
            More
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {moreItems.map((item) => (
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

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
            <span className="text-white text-2xl font-bold">+</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}