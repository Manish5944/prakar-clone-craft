import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  signOut as firebaseSignOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PhoneAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Initialize reCAPTCHA
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = "+91" + phoneNumber;

      // Check if phone number already exists in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", formattedPhone));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Phone number exists, allow login
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code"
        });
      } else {
        // New phone number, proceed with signup
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code"
        });
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    if (!confirmationResult) {
      toast({
        title: "Error",
        description: "Please request OTP first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const formattedPhone = "+91" + phoneNumber;

      // Check if user document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // New user - check if phone number is already registered with different account
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("phoneNumber", "==", formattedPhone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Phone number already registered
          await firebaseSignOut(auth);
          toast({
            title: "Registration Failed",
            description: "This mobile number is already registered.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Create new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          phoneNumber: formattedPhone,
          email: user.email || "",
          createdAt: new Date().toISOString()
        });

        toast({
          title: "Account Created",
          description: "Your account has been created successfully"
        });
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wallcraft-dark via-wallcraft-darker to-wallcraft-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-wallcraft-card border-wallcraft-card/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            Phone Authentication
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Login or signup using your mobile number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Mobile Number</Label>
            <div className="flex gap-2">
              <div className="flex items-center px-3 bg-wallcraft-darker border border-input rounded-md">
                <span className="text-foreground">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={otpSent}
                className="bg-wallcraft-darker border-input text-foreground"
              />
            </div>
          </div>

          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-foreground">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="bg-wallcraft-darker border-input text-foreground"
                maxLength={6}
              />
            </div>
          )}

          <div id="recaptcha-container"></div>

          {!otpSent ? (
            <Button 
              onClick={handleSendOTP} 
              disabled={loading || phoneNumber.length !== 10}
              className="w-full"
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={handleVerifyOTP} 
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <Button 
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setConfirmationResult(null);
                }}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Change Number
              </Button>
            </div>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            By continuing, you agree to receive SMS verification codes. 
            One mobile number can only be linked to one account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneAuth;

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
