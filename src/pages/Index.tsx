import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import WallpaperGrid from "@/components/WallpaperGrid";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-wallcraft-darker">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1">
            <WallpaperGrid />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
