import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Trash2, HelpCircle, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminPromptFile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousData = location.state || {};

  const [formData, setFormData] = useState({
    promptTemplate: "",
    chatgptVersion: "",
    generationType: "",
    promptInstructions: "",
    referenceImage: "no"
  });

  const handleFinish = () => {
    // Combine all form data and navigate to final page or submit
    const completeData = { ...previousData, ...formData };
    console.log("Complete form data:", completeData);
    navigate('/admin/form', { state: completeData });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <p className="text-muted-foreground text-sm">2/3</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4">Prompt File</h1>
                <p className="text-muted-foreground mb-6">
                  Upload your prompt, plus examples and instructions on how to use it. Ensure you have read our prompt submission guidelines to understand what prompts are accepted.
                </p>
                <Button variant="outline" className="gap-2">
                  Prompt Submission Guidelines
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>

              {/* Right Column - Form */}
              <div className="space-y-6">
                {/* Prompt Template */}
                <div>
                  <Label htmlFor="promptTemplate" className="text-lg font-semibold text-foreground mb-2 block">
                    Prompt template
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Put any variables in [square brackets].
                  </p>
                  <Textarea
                    id="promptTemplate"
                    value={formData.promptTemplate}
                    onChange={(e) => setFormData({...formData, promptTemplate: e.target.value})}
                    placeholder="An Impressionist oil painting of [Flower] in a purple vase.."
                    rows={6}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground font-mono"
                  />
                </div>

                {/* ChatGPT Image Version */}
                <div>
                  <Label htmlFor="chatgptVersion" className="text-lg font-semibold text-foreground mb-2 block">
                    ChatGPT Image version
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    What version of ChatGPT Image does this prompt use?
                  </p>
                  <Select value={formData.chatgptVersion} onValueChange={(value) => setFormData({...formData, chatgptVersion: value})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="GPT-5 Image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt5-image">GPT-5 Image</SelectItem>
                      <SelectItem value="gpt4-image">GPT-4 Image</SelectItem>
                      <SelectItem value="dalle3">DALL-E 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generation Type */}
                <div>
                  <Label htmlFor="genType" className="text-lg font-semibold text-foreground mb-2 block">
                    Generation type
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Is this a text-to-image or image-to-image prompt?
                  </p>
                  <Select value={formData.generationType} onValueChange={(value) => setFormData({...formData, generationType: value})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="Text to image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-to-image">Text to image</SelectItem>
                      <SelectItem value="image-to-image">Image to image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Example Images */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-lg font-semibold text-foreground">
                      Example images
                    </Label>
                    <HelpCircle className="h-5 w-5 text-muted-foreground cursor-pointer" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload 9 unique example images generated by this prompt (no collages or edits)
                  </p>
                  <div className="flex gap-4">
                    <button className="w-32 h-32 rounded-lg border-2 border-dashed border-wallcraft-card bg-wallcraft-card/30 hover:bg-wallcraft-card/50 transition-colors flex items-center justify-center">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Reference Image */}
                <div>
                  <Label htmlFor="referenceImage" className="text-lg font-semibold text-foreground mb-2 block">
                    Reference image
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Does this prompt use a reference image for all generations?
                  </p>
                  <Select value={formData.referenceImage} onValueChange={(value) => setFormData({...formData, referenceImage: value})}>
                    <SelectTrigger className="bg-wallcraft-card border-wallcraft-card text-foreground">
                      <SelectValue placeholder="No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Instructions */}
                <div>
                  <Label htmlFor="promptInstructions" className="text-lg font-semibold text-foreground mb-2 block">
                    Prompt instructions
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Any extra tips or examples for the buyer on how to use this prompt.
                  </p>
                  <Textarea
                    id="promptInstructions"
                    value={formData.promptInstructions}
                    onChange={(e) => setFormData({...formData, promptInstructions: e.target.value})}
                    placeholder="To get the most out of this prompt you need to.."
                    rows={6}
                    className="bg-wallcraft-card border-wallcraft-card text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-wallcraft-card">
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin')}
                >
                  Back
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="wallcraft"
                onClick={handleFinish}
              >
                Next: Finish
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPromptFile;
