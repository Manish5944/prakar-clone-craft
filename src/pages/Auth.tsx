import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        // Check if email is verified
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Email not verified",
            description: "Please check your email and verify your account before signing in.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Verification email sent!",
            description: "Please check your email and click the verification link to activate your account.",
          });
          setEmail("");
          setPassword("");
        } else {
          toast({
            title: "Account created!",
            description: "You can now sign in with your credentials.",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      let errorMessage = error.message;
      
      // Provide more user-friendly error messages in Hindi and English
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "गलत email या password। कृपया अपने credentials जांचें। / Invalid email or password. Please check your credentials.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "यह email पहले से registered है। कृपया sign in करें। / This email is already registered. Please sign in instead.";
        setIsLogin(true);
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "कृपया sign in करने से पहले अपना email verify करें। / Please verify your email address before signing in.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "कृपया एक valid email address दर्ज करें। / Please enter a valid email address.";
      } else if (error.message.includes("Password")) {
        errorMessage = "Password कम से कम 6 characters का होना चाहिए। / Password must be at least 6 characters long.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-wallcraft-darker px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Prompt Copy
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6 bg-wallcraft-card p-8 rounded-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                placeholder="example@email.com"
                autoComplete="email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                placeholder="Minimum 6 characters"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
