import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-wallcraft-darker via-wallcraft-dark to-wallcraft-darker py-16 md:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI Prompt Marketplace
          </Badge>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Discover & Use{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Expert AI Prompts
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse thousands of tested prompts for ChatGPT, DALL·E, Midjourney, Stable Diffusion & more. Save time and get better results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="wallcraft" size="lg" className="text-base px-8 py-6">
              <Search className="h-5 w-5 mr-2" />
              Explore Prompts
            </Button>
            <Button variant="wallcraft-outline" size="lg" className="text-base px-8 py-6">
              <Zap className="h-5 w-5 mr-2" />
              Sell Your Prompts
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
              <p className="text-muted-foreground text-sm">Prompts</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-foreground">5K+</p>
              <p className="text-muted-foreground text-sm">Users</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center flex flex-col items-center">
              <p className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-1">
                <TrendingUp className="h-5 w-5" />
                50+
              </p>
              <p className="text-muted-foreground text-sm">AI Models</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
