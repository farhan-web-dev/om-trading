"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useVerifyOtp } from "@/hooks/auth/useAuth"; // <-- React Query hook
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const verifyOtp = useVerifyOtp(); // <-- mutation

  // Load email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("signup_email");
    if (!storedEmail) {
      router.push("/auth/signin");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) return;

    verifyOtp.mutate(
      { email, otp },
      {
        onSuccess: (data: any) => {
          localStorage.setItem("auth_token", data.token);
          localStorage.removeItem("signup_email");
          toast.success("OTP verified successfully!");
          router.push("/onboarding");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to verify OTP");
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {email}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
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

              {verifyOtp.isError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md text-center">
                  {(verifyOtp.error as Error).message || "Invalid OTP"}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtp.isPending || otp.length !== 6}
              >
                {verifyOtp.isPending ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/auth/signin")}
                  className="text-sm"
                >
                  Use a different email
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
