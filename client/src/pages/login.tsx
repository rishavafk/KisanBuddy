'use client';

import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ username, password });
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0C10] px-4">
      <Card className="w-full max-w-md p-10 rounded-3xl glass-strong shadow-xl bg-gradient-to-b from-[#111315] to-[#1A1C20] border border-white/10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-teal-400 rounded-full flex items-center justify-center text-black text-2xl font-bold shadow-lg">
            DN
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">Welcome Back</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50" size={20} />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 bg-[#1A1C20] text-white border border-white/20 focus:ring-green-400 focus:border-green-400"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-white/50" size={20} />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-[#1A1C20] text-white border border-white/20 focus:ring-green-400 focus:border-green-400"
            />
          </div>

          {/* Test credentials info */}
          <p className="text-sm text-white/60">
            Test Username: <span className="text-green-400 font-medium">farmer1</span> | Test Password: <span className="text-green-400 font-medium">password123</span>
          </p>

          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-400 to-teal-400 text-black font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Button
            type="button"
            onClick={goBack}
            className="w-full py-3 mt-2 bg-gray-700 text-white font-medium rounded-xl shadow hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} /> Go Back to Homepage
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-400 hover:underline">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  );
}
