import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("otp");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // We rely on the built-in OTP email delivery.

      setOtpSent(true);
      toast({
        title: "OTP भेजा गया! / OTP Sent!",
        description: "कृपया अपना email check करें। Prompt Copy से आया OTP दर्ज करें। / Please check your email for OTP from Prompt Copy.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "कृपया 6 digit OTP दर्ज करें। / Please enter 6 digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: otp,
        type: 'email',
      });

      if (error) throw error;

      toast({
        title: "सफलतापूर्वक login हो गए! / Successfully logged in!",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "गलत OTP। कृपया दोबारा प्रयास करें। / Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) throw error;
        
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
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) throw error;
        
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
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "गलत email या password। / Invalid email or password.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "यह email पहले से registered है। / This email is already registered.";
        setIsLogin(true);
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

        <div className="bg-wallcraft-card p-8 rounded-lg">
          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "password" | "otp")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="otp">OTP से Login</TabsTrigger>
              <TabsTrigger value="password">Password से Login</TabsTrigger>
            </TabsList>

            {/* OTP Authentication */}
            <TabsContent value="otp" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label htmlFor="otp-email" className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      id="otp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-wallcraft-darker border-wallcraft-card text-foreground"
                      placeholder="example@email.com"
                      autoComplete="email"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    {loading ? "भेजा जा रहा है... / Sending..." : "OTP भेजें / Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      OTP दर्ज करें / Enter OTP
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      {email} पर भेजा गया OTP दर्ज करें
                    </p>
                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    {loading ? "Verify कर रहे हैं... / Verifying..." : "Verify करें और Login करें"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="w-full"
                  >
                    दोबारा OTP भेजें / Resend OTP
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Password Authentication */}
            <TabsContent value="password" className="space-y-4">
              <form onSubmit={handlePasswordAuth} className="space-y-4">
                <div>
                  <label htmlFor="password-email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    id="password-email"
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
