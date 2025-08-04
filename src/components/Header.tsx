import { Search, ChevronDown } from "lucide-react";
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
    "HOME", "EXCLUSIVE", "PARALLAX", "VIDEO", "AI ART", 
    "24 HOURS", "DOUBLE", "RATING", "AUTHORS", "ANDROID 12"
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
        <nav className="flex items-center justify-between py-2 border-t border-wallcraft-card">
          <div className="flex items-center gap-8 overflow-x-auto">
            {navItems.map((item) => (
              <Button 
                key={item} 
                variant="wallcraft-ghost" 
                className="text-xs font-medium px-2 py-1 whitespace-nowrap text-muted-foreground hover:text-foreground"
              >
                {item}
              </Button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="wallcraft-ghost" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                POPULAR <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-wallcraft-card border-wallcraft-card">
              <DropdownMenuItem className="text-foreground hover:bg-wallcraft-card-hover">Most Viewed</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-wallcraft-card-hover">Most Downloaded</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-wallcraft-card-hover">Most Liked</DropdownMenuItem>
              <DropdownMenuItem className="text-foreground hover:bg-wallcraft-card-hover">Trending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};

export default Header;