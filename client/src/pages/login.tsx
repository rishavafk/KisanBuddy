import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Leaf, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoginPending } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        setLocation("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AgriSmart</h1>
              <p className="text-sm text-muted-foreground">Precision Agriculture</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <p className="text-center text-muted-foreground">
              Sign in to your AgriSmart account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register("username")}
                  data-testid="input-username"
                />
                {errors.username && (
                  <p className="text-destructive text-sm" data-testid="error-username">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-destructive text-sm" data-testid="error-password">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoginPending}
                data-testid="button-login"
              >
                {isLoginPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline"
                  data-testid="link-signup"
                >
                  Sign up
                </Link>
              </p>
              
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-home"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials info */}
        <Card className="mt-4 bg-muted/30">
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground text-center mb-2">
              Demo Credentials:
            </p>
            <div className="text-sm text-center">
              <p><strong>Username:</strong> farmer1</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
