import { Search, Box, Palette, Grid3x3, Image, Pencil, Briefcase, Camera, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navItems = [
    { name: "Models", icon: Box },
    { name: "Art", icon: Palette },
    { name: "Logos", icon: Grid3x3 },
    { name: "Graphics", icon: Image },
    { name: "Productivity", icon: Pencil },
    { name: "Marketing", icon: Briefcase },
    { name: "Photography", icon: Camera },
    { name: "Games", icon: Gamepad2 }
  ];

  return (
    <header className="bg-wallcraft-dark border-b border-wallcraft-card">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-wallcraft-card">
              <div className="flex flex-col gap-1">
                <div className="w-5 h-0.5 bg-current"></div>
                <div className="w-5 h-0.5 bg-current"></div>
                <div className="w-5 h-0.5 bg-current"></div>
              </div>
            </SidebarTrigger>
            <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              WallCraft
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search wallpaper"
                className="pl-10 pr-10 bg-wallcraft-card border-wallcraft-card text-foreground placeholder:text-muted-foreground rounded-md h-9"
              />
              <Button variant="wallcraft-ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7">
                <div className="w-4 h-4 bg-muted-foreground rounded-full"></div>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="wallcraft-ghost" size="icon" className="text-white">
              <div className="w-6 h-6 bg-wallcraft-cyan rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center py-3 border-t border-wallcraft-card">
          <div className="flex items-center gap-6 overflow-x-auto">
            {navItems.map((item) => (
              <Button 
                key={item.name} 
                variant="wallcraft-ghost" 
                className="flex items-center gap-2 text-sm font-medium px-3 py-2 whitespace-nowrap text-muted-foreground hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;