import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Purchase {
  id: string;
  prompt_id: string;
  created_at: string;
  prompts: {
    id: string;
    title: string;
    image_url: string;
    category: string;
  };
}

const Purchases = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('downloads')
        .select(`
          id,
          prompt_id,
          created_at,
          prompts (
            id,
            title,
            image_url,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load purchases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Loading purchases...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="h-6 w-6 text-wallcraft-cyan" />
            <h1 className="text-3xl font-bold text-foreground">Your Purchases</h1>
          </div>

          {purchases.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No purchases yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="group relative bg-wallcraft-card rounded-lg overflow-hidden hover:bg-wallcraft-card/80 transition-all cursor-pointer"
                  onClick={() => navigate(`/prompt/${purchase.prompts.id}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={purchase.prompts.image_url}
                      alt={purchase.prompts.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      <span className="text-yellow-400">⚡</span>
                      <span className="text-white font-semibold ml-1">{purchase.prompts.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-foreground font-semibold text-lg mb-2 line-clamp-2">
                      {purchase.prompts.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(purchase.created_at), { addSuffix: true })}
                      </p>
                      <Download className="h-4 w-4 text-wallcraft-cyan" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Purchases;
