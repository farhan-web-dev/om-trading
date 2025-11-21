"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSignup } from "@/hooks/auth/useAuth";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    signup.mutate(form, {
      onSuccess: () => {
        toast.success("Account created successfully!");
        router.push("/onboarding");
      },
      onError: (err: any) => {
        toast.error(err.message || "Signup failed");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo + Branding */}
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
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Enter your email & password</CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                {signup.isPending ? "Creating..." : "Sign Up"}
              </Button>
            </form>

            {/* Already have account */}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/auth/login")}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
