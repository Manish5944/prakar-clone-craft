import { Instagram, MessageCircle, Twitter, Music, Github, Gamepad2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-sidebar border-t border-sidebar-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Categories */}
          <div>
            <h3 className="text-sidebar-foreground font-semibold mb-4 text-lg">CATEGORIES</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Best AI prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Art & Illustration prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Logo & Icon prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Graphic & Design prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Productivity & Writing prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Marketing & Business prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Photography prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Games & 3D prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-sidebar-foreground font-semibold mb-4 text-lg">MODELS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Image prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Text prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Video prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Free prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Midjourney prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sora prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FLUX prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">DALL·E prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">ChatGPT Image prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Gemini Image prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">KLING AI prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Hailuo AI prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Google Imagen prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Stable Diffusion prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">DeepSeek prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">ChatGPT prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Leonardo Ai prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Llama prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Claude prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Ideogram prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Gemini prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">ChatGPT prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Grok prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Grok Image prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Veo prompts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Midjourney Video prompts</a></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sidebar-foreground font-semibold mb-4 text-lg">LINKS</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Changelog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Affiliates</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sidebar-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">© PromptBase 2025</p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Music size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Gamepad2 size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
