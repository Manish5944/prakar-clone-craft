import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileText, DollarSign, Shield, Rocket, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Admin = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-wallcraft-dark py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-8">Sell a prompt</h1>
              
              {/* Feature Cards */}
              <div className="space-y-4">
                <Card className="bg-wallcraft-card border-wallcraft-card p-6 flex items-start gap-4 hover:border-wallcraft-cyan transition-colors">
                  <FileText className="h-10 w-10 text-wallcraft-cyan flex-shrink-0 mt-1" />
                  <p className="text-foreground text-lg">Provide some details about your AI prompt</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-6 flex items-start gap-4 hover:border-wallcraft-cyan transition-colors">
                  <DollarSign className="h-10 w-10 text-wallcraft-cyan flex-shrink-0 mt-1" />
                  <p className="text-foreground text-lg">Sell with 0% fees via your link — 20% via marketplace</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-6 flex items-start gap-4 hover:border-wallcraft-cyan transition-colors">
                  <Shield className="h-10 w-10 text-wallcraft-cyan flex-shrink-0 mt-1" />
                  <p className="text-foreground text-lg">Get paid out securely via Stripe</p>
                </Card>
                <Card className="bg-wallcraft-card border-wallcraft-card p-6 flex items-start gap-4 hover:border-wallcraft-cyan transition-colors">
                  <Rocket className="h-10 w-10 text-wallcraft-cyan flex-shrink-0 mt-1" />
                  <p className="text-foreground text-lg">Build an audience & grow your AI business</p>
                </Card>
              </div>
            </div>

            {/* Guidelines */}
            <div className="mb-8 p-6 bg-wallcraft-card/50 border border-wallcraft-card rounded-lg">
              <p className="text-muted-foreground mb-2">
                Please read our <span className="text-wallcraft-cyan underline cursor-pointer">prompt submission guidelines</span> before submitting your prompt so you understand what prompts can be sold on PromptBase.
              </p>
              <p className="text-muted-foreground text-sm">
                Payouts from PromptBase occur when reaching a minimum $30.00 balance threshold on monthly/weekly payout cycles. You can withdraw your balance earlier or below this threshold for a fee. 0% fees are unlocked after 5 sales. <span className="text-wallcraft-cyan underline cursor-pointer">Learn more.</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="px-8"
              >
                Back
              </Button>
              <Button 
                variant="wallcraft"
                onClick={() => navigate('/admin/form')}
                className="px-8 gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
