import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Heart, Eye, Star, Share2, Copy, Check, Expand } from "lucide-react";
import MarketplaceExplore from "@/components/MarketplaceExplore";
import Footer from "@/components/Footer";

interface Prompt {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt_text: string;
  image_url: string;
  example_images: string[];
  price: number;
  rating: number;
  views: number;
  downloads: number;
  likes: number;
  user_id: string | null;
}

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);

  useEffect(() => {
    fetchPrompt();
  }, [id]);

  useEffect(() => {
    if (prompt) checkIfLiked();
  }, [prompt]);

  const fetchPrompt = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPrompt(data);

      // Increment view count
      await supabase
        .from('prompts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !prompt) return;
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', prompt.id)
      .maybeSingle();
    setIsLiked(!!data);
  };

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Login Required", description: "Please login to favorite prompts", variant: "destructive" });
      return;
    }
    try {
      if (isLiked) {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('prompt_id', prompt!.id);
        setIsLiked(false);
        toast({ title: "Removed from favorites" });
      } else {
        await supabase.from('favorites').insert({ user_id: user.id, prompt_id: prompt!.id });
        setIsLiked(true);
        toast({ title: "Added to favorites!" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCopyPrompt = async () => {
    if (!prompt?.prompt_text) return;
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    toast({ title: "Copied!", description: "Prompt copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: prompt?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share link copied to clipboard" });
    }
  };

  const handleDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Login Required", description: "Please login to download", variant: "destructive" });
      return;
    }
    try {
      await supabase.from('downloads').insert({ user_id: user.id, prompt_id: prompt!.id });
      toast({ title: "Downloaded!", description: "Prompt saved to your downloads" });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!prompt) {
    return (
      <Layout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Prompt not found</p>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">

          {/* Back Button */}
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Main Layout: Left Image | Right Details */}
          <div className="flex flex-col lg:flex-row gap-10">

            {/* LEFT: Large Image */}
            <div className="lg:w-[45%] flex-shrink-0">
              <div className="relative group rounded-2xl overflow-hidden bg-wallcraft-card shadow-xl">
                <img
                  src={prompt.image_url}
                  alt={prompt.title}
                  className="w-full object-cover"
                  style={{ maxHeight: '75vh', objectPosition: 'top' }}
                />
                {/* Expand button */}
                <button
                  onClick={() => setImageExpanded(true)}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Expand className="h-4 w-4" />
                </button>
                {/* Action icons at bottom */}
                <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleShare}
                    className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Prompt Details */}
            <div className="flex-1 min-w-0">

              {/* Author / Posted info */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">P</span>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">@promptcopy</p>
                    <p className="text-muted-foreground text-xs">Posted recently</p>
                  </div>
                </div>
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="sm"
                  className={`gap-1.5 px-4 ${isLiked ? 'bg-primary hover:bg-primary/90' : ''}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary-foreground text-primary-foreground' : ''}`} />
                  {isLiked ? 'Favorited' : 'Favorite'}
                </Button>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-5 mb-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  {(prompt.views || 0).toLocaleString()} views
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  {(prompt.likes || 0).toLocaleString()} favorites
                </span>
              </div>

              {/* Model & Category info */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Model Used</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs">🤖</span>
                    </div>
                    <span className="text-foreground font-medium text-sm capitalize">{prompt.category}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Category</p>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs">📁</span>
                    </div>
                    <span className="text-foreground font-medium text-sm">{prompt.category}</span>
                  </div>
                </div>
              </div>

              {/* Generation Parameters */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Generation Parameters</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E" alt="" className="h-3.5 w-3.5" />
                    Image
                  </Badge>
                  <Badge variant="secondary" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg">
                    <Expand className="h-3.5 w-3.5 text-muted-foreground" />
                    1536×2752
                  </Badge>
                  {prompt.likes > 0 && (
                    <Badge variant="secondary" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg">
                      <Star className="h-3.5 w-3.5 text-muted-foreground" />
                      {(prompt.likes || 0).toLocaleString()}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="gap-1.5 text-xs px-3 py-1.5 rounded-lg">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='m21 15-5-5L5 21'/%3E%3C/svg%3E" alt="" className="h-3.5 w-3.5" />
                    jpg
                  </Badge>
                </div>
              </div>

              {/* PROMPT Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Prompt</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary hover:text-primary">
                      ✨ Try this prompt
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={handleCopyPrompt}
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>

                {prompt.prompt_text ? (
                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap font-mono">
                      {prompt.prompt_text}
                    </p>
                  </div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-6 border border-dashed border-border text-center">
                    <p className="text-muted-foreground text-sm">
                      {prompt.price > 0
                        ? `Purchase this prompt for $${prompt.price.toFixed(2)} to unlock the full prompt`
                        : 'No prompt text available'}
                    </p>
                    {prompt.price > 0 && (
                      <Button className="mt-3" size="sm" onClick={handleDownload}>
                        Buy for ${prompt.price.toFixed(2)}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {prompt.description && (
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Description</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">{prompt.description}</p>
                </div>
              )}

              {/* Price & Action */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {prompt.price > 0 ? `$${prompt.price.toFixed(2)}` : 'Free'}
                    </p>
                    {prompt.price > 0 && (
                      <p className="text-xs text-muted-foreground">One-time purchase</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLike}>
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full text-base font-semibold"
                  onClick={prompt.price > 0 ? handleDownload : handleCopyPrompt}
                >
                  {prompt.price > 0 ? `Buy Prompt · $${prompt.price.toFixed(2)}` : 'Copy Prompt'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceExplore />
      <Footer />

      {/* Full Image Lightbox */}
      {imageExpanded && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageExpanded(false)}
        >
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          <button
            className="absolute top-4 right-4 text-white bg-white/20 rounded-full p-2"
            onClick={() => setImageExpanded(false)}
          >
            ✕
          </button>
        </div>
      )}
    </Layout>
  );
};

export default PromptDetail;
