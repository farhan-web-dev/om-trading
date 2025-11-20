"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSendOtp } from "@/hooks/auth/useAuth"; // <-- use your hook
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const sendOtp = useSendOtp(); // <-- use React Query mutation

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();

    sendOtp.mutate(
      { email },
      {
        onSuccess: () => {
          localStorage.setItem("signup_email", email);
          toast.success("OTP sent to your email!");
          router.push("/auth/verify-otp");
        },
        onError: (err: any) => {
          console.error(err);
          toast.error(err.message || "Failed to send OTP");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold text-primary">OMTrade</span>
          </div>
          <p className="text-muted-foreground">
            Professional OM Trading Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email to receive a one-time password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {sendOtp.isError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {(sendOtp.error as Error).message || "Failed to send OTP"}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={sendOtp.isPending}
              >
                {sendOtp.isPending ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
