import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Header from "@/components/Header";
import WallpaperGrid from "@/components/WallpaperGrid";
import Layout from "@/components/Layout";
import MarketplaceExplore from "@/components/MarketplaceExplore";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout onSearch={setSearchQuery}>
      <HeroSection />
      <WallpaperGrid searchQuery={searchQuery} />
      <MarketplaceExplore />
      <Footer />
    </Layout>
  );
};

export default Index;
