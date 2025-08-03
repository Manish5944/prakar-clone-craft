import { Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Button variant="wallcraft-ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              WallCraft
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search wallpaper"
                className="pl-10 bg-wallcraft-card border-wallcraft-card text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="wallcraft-ghost" size="icon">
              <div className="w-4 h-4 bg-wallcraft-cyan rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-between py-2 border-t border-wallcraft-card">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Button 
                key={item} 
                variant="wallcraft-ghost" 
                className="text-xs font-medium px-3 py-2"
              >
                {item}
              </Button>
            ))}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="wallcraft-ghost" className="text-xs font-medium">
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