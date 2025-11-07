import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OTPEmailRequest {
  email: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp }: OTPEmailRequest = await req.json();

    console.log("Sending OTP email to:", email);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your OTP Code - Prompt Copy</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">
                Prompt Copy
              </h1>
              <p style="color: #9ca3af; font-size: 14px; margin-top: 8px;">
                AI Prompt Marketplace
              </p>
            </div>

            <!-- Main Content -->
            <div style="background-color: #1a1a1a; border-radius: 12px; padding: 40px; border: 1px solid #2a2a2a;">
              <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 16px 0;">
                आपका OTP Code / Your OTP Code
              </h2>
              
              <p style="color: #9ca3af; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
                अपने Prompt Copy account में login करने के लिए नीचे दिए गए OTP का उपयोग करें।<br><br>
                Use the OTP code below to login to your Prompt Copy account.
              </p>

              <!-- OTP Code Box -->
              <div style="background: linear-gradient(135deg, #00d4ff15 0%, #7c3aed15 100%); border: 2px solid #00d4ff; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                <div style="color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>

              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 24px 0 0 0;">
                यह OTP 10 मिनट के लिए valid है। / This OTP is valid for 10 minutes.
              </p>

              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 16px 0 0 0;">
                अगर आपने यह request नहीं किया है, तो कृपया इस email को ignore करें।<br>
                If you didn't request this, please ignore this email.
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 12px; line-height: 18px; margin: 0;">
                © 2025 Prompt Copy. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 12px; line-height: 18px; margin: 8px 0 0 0;">
                AI Prompt Marketplace for Creators
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // NOTE: In Resend's free tier, you can only send to your verified email (k.mantu9004@gmail.com)
    // To send to any email, verify a domain at resend.com/domains and update the 'from' address
    // Example: from: "Prompt Copy <noreply@yourdomain.com>"
    const { data, error } = await resend.emails.send({
      from: "Prompt Copy <onboarding@resend.dev>",
      to: [email],
      subject: "Your OTP Code - Prompt Copy Login",
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-otp-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
