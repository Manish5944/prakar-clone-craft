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

const Favorites = () => {
  const [favorites, setFavorites] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  const checkAuthAndFetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    await fetchFavorites(user.id);
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          prompt_id,
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
        .eq('user_id', userId);

      if (error) throw error;

      const promptsData = data?.map(item => item.prompts).filter(Boolean) as Prompt[];
      setFavorites(promptsData || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
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
          <h1 className="text-2xl font-bold text-foreground mb-2">Favorites</h1>
          <p className="text-muted-foreground text-sm">
            {favorites.length} prompts saved
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No favorites yet</p>
            <p className="text-muted-foreground text-sm mt-2">
              Start liking prompts to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((prompt, index) => (
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

export default Favorites;
