import { Search, Box, Palette, Grid3x3, Image, Pencil, Briefcase, Camera, Gamepad2, Send, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const navItems = [
    { 
      name: "Models", 
      icon: Box,
      subcategories: [
        "All Models prompts",
        "ChatGPT prompts",
        "Claude prompts",
        "DALL-E prompts",
        "Midjourney prompts",
        "Stable Diffusion prompts",
        "GPT-4 prompts",
        "Gemini prompts"
      ]
    },
    { 
      name: "Art", 
      icon: Palette,
      subcategories: [
        "All Art prompts",
        "Digital Art prompts",
        "Illustration prompts",
        "Painting prompts",
        "Abstract Art prompts",
        "Portrait prompts",
        "Landscape prompts"
      ]
    },
    { 
      name: "Logos", 
      icon: Grid3x3,
      subcategories: [
        "All Logo prompts",
        "Business Logos",
        "Minimalist Logos",
        "Vintage Logos",
        "Modern Logos",
        "Typography Logos"
      ]
    },
    { 
      name: "Graphics", 
      icon: Image,
      subcategories: [
        "All Graphics prompts",
        "UI/UX Design",
        "Social Media Graphics",
        "Infographics",
        "Icon Design",
        "Banner Design"
      ]
    },
    { 
      name: "Productivity", 
      icon: Pencil,
      subcategories: [
        "All Productivity prompts",
        "Writing prompts",
        "Code Generation",
        "Data Analysis",
        "Automation prompts",
        "Research prompts"
      ]
    },
    { 
      name: "Marketing", 
      icon: Briefcase,
      subcategories: [
        "All Marketing prompts",
        "SEO prompts",
        "Content Marketing",
        "Social Media",
        "Email Marketing",
        "Ad Copy prompts"
      ]
    },
    { 
      name: "Photography", 
      icon: Camera,
      subcategories: [
        "All Photography prompts",
        "Portrait Photography",
        "Product Photography",
        "Nature Photography",
        "Street Photography",
        "Food Photography"
      ]
    },
    { 
      name: "Games", 
      icon: Gamepad2,
      subcategories: [
        "All Games prompts",
        "Character Design",
        "Game Assets",
        "Environment Design",
        "Concept Art",
        "Game Story prompts"
      ]
    }
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
              Prompt Copy
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 pr-12 bg-wallcraft-card border-wallcraft-card text-foreground placeholder:text-muted-foreground rounded-md h-9"
              />
              <Button 
                variant="wallcraft-ghost" 
                size="icon" 
                onClick={handleSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
              >
                <Send className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="wallcraft-ghost" size="icon" className="text-white">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wallcraft-card border-wallcraft-card" align="end">
                  <DropdownMenuItem className="text-foreground hover:bg-wallcraft-card-hover">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-foreground hover:bg-wallcraft-card-hover cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="wallcraft-ghost" 
                onClick={() => navigate("/auth")}
                className="text-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-center py-3 border-t border-wallcraft-card">
          <div className="flex items-center gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="wallcraft-ghost" 
                    className="flex items-center gap-2 text-sm font-medium px-3 py-2 whitespace-nowrap text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wallcraft-card border-wallcraft-card w-56 z-50" align="start">
                  {item.subcategories?.map((subcategory) => (
                    <DropdownMenuItem 
                      key={subcategory}
                      className="text-foreground hover:bg-wallcraft-card-hover cursor-pointer"
                      onClick={() => console.log(`Selected: ${subcategory}`)}
                    >
                      {subcategory}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;