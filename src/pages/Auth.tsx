import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"password" | "otp">("password");

  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle tab switching - reset relevant states
  const handleAuthMethodChange = (value: string) => {
    const newMethod = value as "password" | "otp";
    setAuthMethod(newMethod);
    setOtp("");
    setOtpSent(false);
    if (newMethod === "otp") {
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google Login Failed",
        description: error.message,
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast({
        title: "Email Required",
        description: "कृपया email address दर्ज करें।",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      toast({
        title: "Invalid Email",
        description: "कृपया valid email address दर्ज करें।",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "OTP भेजा गया!",
        description: "कृपया अपना email check करें।",
      });
    } catch (error: any) {
      console.error("OTP send error:", error);
      toast({
        title: "Error",
        description: error.message || "OTP भेजने में error हुआ।",
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
        description: "कृपया 6 digit OTP दर्ज करें।",
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
        title: "Login सफल!",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "गलत OTP। कृपया दोबारा प्रयास करें।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "Password मेल नहीं खाता",
        description: "Password और Confirm Password एक जैसे होने चाहिए।",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Email verify नहीं हुआ",
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
            title: "Verification email भेजा गया!",
            description: "कृपया अपना email check करें और verification link पर click करें।",
          });
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        } else {
          toast({
            title: "Account बन गया!",
            description: "अब आप sign in कर सकते हैं।",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      let errorMessage = error.message;

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "गलत email या password।";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "यह email पहले से registered है।";
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
            {authMethod === "password"
              ? isLogin ? "अपने account में sign in करें" : "नया account बनाएं"
              : "Email OTP से login करें"}
          </p>
        </div>

        <div className="bg-wallcraft-card p-8 rounded-lg">
          {/* Google Login Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-3 border-border hover:bg-muted"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-wallcraft-card px-3 text-xs text-muted-foreground">
              या / OR
            </span>
          </div>

          <Tabs value={authMethod} onValueChange={handleAuthMethodChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password" className="text-xs sm:text-sm">
                Email & Password
              </TabsTrigger>
              <TabsTrigger value="otp" className="text-xs sm:text-sm">
                Email OTP
              </TabsTrigger>
            </TabsList>

            {/* Email + Password Authentication */}
            <TabsContent value="password" className="space-y-4">
              {/* Login / Signup Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-border mb-2">
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setConfirmPassword(""); }}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    isLogin
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Login करें
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    !isLogin
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Sign Up करें
                </button>
              </div>

              <form onSubmit={handlePasswordAuth} className="space-y-4">
                <div>
                  <label htmlFor="password-email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
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
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-wallcraft-darker border-wallcraft-card text-foreground pr-10"
                      placeholder="Minimum 6 characters"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password - only on signup */}
                {!isLogin && (
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="bg-wallcraft-darker border-wallcraft-card text-foreground pr-10"
                        placeholder="Password दोबारा दर्ज करें"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive mt-1">Password मेल नहीं खाता</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || (!isLogin && password !== confirmPassword && confirmPassword.length > 0)}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  {loading ? "Please wait..." : isLogin ? "Login करें" : "Account बनाएं"}
                </Button>
              </form>
            </TabsContent>

            {/* Email OTP Authentication */}
            <TabsContent value="otp" className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label htmlFor="otp-email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
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
                    {loading ? "भेजा जा रहा है..." : "OTP भेजें"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      OTP दर्ज करें
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
                    {loading ? "Verify हो रहा है..." : "Verify करें और Login करें"}
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
                    दोबारा OTP भेजें
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
