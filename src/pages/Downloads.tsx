import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WallpaperCard from "@/components/WallpaperCard";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

interface Prompt {
  id: string;
  title: string;
  category: string;
  image_url: string;
  views: number;
  downloads: number;
  likes: number;
}

const Downloads = () => {
  const [downloadedPrompts, setDownloadedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchDownloads();
  }, []);

  const checkAuthAndFetchDownloads = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await fetchDownloads(user.id);
  };

  const fetchDownloads = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('downloads')
        .select(`
          prompt_id,
          created_at,
          prompts (
            id,
            title,
            category,
            image_url,
            views,
            downloads,
            likes
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Remove duplicates - keep only the latest download of each prompt
      const uniquePrompts = new Map<string, Prompt>();
      data?.forEach(item => {
        if (item.prompts && !uniquePrompts.has(item.prompts.id)) {
          uniquePrompts.set(item.prompts.id, item.prompts as Prompt);
        }
      });

      setDownloadedPrompts(Array.from(uniquePrompts.values()));
    } catch (error) {
      console.error('Error fetching downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Downloads</h1>
          <p className="text-muted-foreground text-sm">
            {downloadedPrompts.length} prompts downloaded
          </p>
        </div>

        {downloadedPrompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No downloads yet</p>
            <p className="text-muted-foreground text-sm mt-2">
              Start downloading prompts to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {downloadedPrompts.map((prompt, index) => (
              <WallpaperCard
                key={prompt.id}
                id={index}
                image={prompt.image_url}
                title={prompt.title}
                category={prompt.category}
                views={prompt.views}
                downloads={prompt.downloads}
                likes={prompt.likes}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Downloads;
