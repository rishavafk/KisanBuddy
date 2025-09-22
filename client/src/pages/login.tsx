'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from "wouter";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DroneIcon } from '@/components/ui/drone-icon';
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeOff, ArrowLeft, Zap, Shield, User } from 'lucide-react';

interface LoginPageProps {
  onBack?: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps = {}) {
  const { login, signup } = useAuth();
  const [, setLocation] = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login({ username: formData.username, password: formData.password });
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await signup({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password, 
          fullName: formData.fullName 
        });
      }
      setLocation("/dashboard");
    } catch (err: any) {
      setError(err?.message || `${isLogin ? 'Login' : 'Signup'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (onBack) {
      onBack();
    } else {
    setLocation("/");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--drone-dark)] text-white overflow-hidden relative">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="w-full h-full"
      style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559506709-e3d879c60305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGFncmljdWx0dXJlJTIwZmFybWxhbmQlMjBhZXJpYWx8ZW58MXx8fHwxNzU4NDA2NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--drone-dark)]/95 via-[var(--drone-dark-secondary)]/90 to-[var(--drone-dark)]/95"></div>
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[var(--drone-green)] rounded-full opacity-40"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
</div>

      {/* Back Button */}
      <motion.button
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white/70 hover:text-[var(--drone-green)] transition-colors duration-300"
        onClick={goBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </motion.button>

      {/* Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-3 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-teal)] flex items-center justify-center">
                <DroneIcon className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-teal)] bg-clip-text text-transparent">
                KisanBuddy
              </h1>
            </motion.div>

            <h2 className="text-4xl lg:text-6xl font-bold mb-6">
              Welcome to the
              <span className="block bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-blue)] bg-clip-text text-transparent">
                Future of Farming
              </span>
        </h2>

            <p className="text-xl text-white/70 mb-8 max-w-lg">
              Join thousands of farmers who are revolutionizing agriculture with our AI-powered drone technology.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'AI Powered', desc: 'Smart automation' },
                { icon: Shield, title: 'Secure', desc: 'Enterprise grade' },
                { icon: User, title: '1000+ Users', desc: 'Growing community' },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <Icon className="w-8 h-8 text-[var(--drone-green)] mx-auto mb-2" />
                    <h4 className="font-medium text-white mb-1">{feature.title}</h4>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-8 lg:p-12 max-w-md mx-auto">
              {/* Toggle Buttons */}
              <div className="flex mb-8">
                <Button
                  variant={isLogin ? 'default' : 'ghost'}
                  className={`flex-1 mr-2 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-teal)] text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </Button>
                <Button
                  variant={!isLogin ? 'default' : 'ghost'}
                  className={`flex-1 ml-2 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-teal)] text-black' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </Button>
              </div>

              {error && (
                <motion.p 
                  className="text-red-400 mb-4 text-center text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      onFocus={() => setFocusedField('fullName')}
                      onBlur={() => setFocusedField(null)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 transition-all duration-300 ${
                        focusedField === 'fullName' ? 'border-[var(--drone-green)] shadow-lg shadow-[var(--drone-green)]/20' : ''
                      }`}
                      required
                    />
                  </motion.div>
                )}

                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 transition-all duration-300 ${
                        focusedField === 'email' ? 'border-[var(--drone-green)] shadow-lg shadow-[var(--drone-green)]/20' : ''
                      }`}
                      required
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0 : 0.2 }}
                >
            <Input
              type="text"
              placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-white/10 border-white/20 text-white placeholder-white/50 transition-all duration-300 ${
                      focusedField === 'username' ? 'border-[var(--drone-green)] shadow-lg shadow-[var(--drone-green)]/20' : ''
                    }`}
              required
                  />
                </motion.div>

                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0.1 : 0.3 }}
                >
            <Input
                    type={showPassword ? 'text' : 'password'}
              placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`bg-white/10 border-white/20 text-white placeholder-white/50 pr-12 transition-all duration-300 ${
                      focusedField === 'password' ? 'border-[var(--drone-green)] shadow-lg shadow-[var(--drone-green)]/20' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-[var(--drone-green)] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </motion.div>

                {!isLogin && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      className={`bg-white/10 border-white/20 text-white placeholder-white/50 transition-all duration-300 ${
                        focusedField === 'confirmPassword' ? 'border-[var(--drone-green)] shadow-lg shadow-[var(--drone-green)]/20' : ''
                      }`}
              required
                    />
                  </motion.div>
                )}

                {isLogin && (
                  <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center text-white/70">
                      <input type="checkbox" className="mr-2 accent-[var(--drone-green)]" />
                      Remember me
                    </label>
                    <button type="button" className="text-[var(--drone-green)] hover:text-[var(--drone-teal)] transition-colors">
                      Forgot Password?
                    </button>
          </div>
                )}

                {/* Test credentials info for login */}
                {isLogin && (
                  <motion.div
                    className="text-sm text-white/60 bg-white/5 p-3 rounded-lg border border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <p className="mb-1">Test Credentials:</p>
                    <p>Username: <span className="text-[var(--drone-green)] font-medium">farmer1</span></p>
                    <p>Password: <span className="text-[var(--drone-green)] font-medium">password123</span></p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: isLogin ? 0.3 : 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
          <Button
            type="submit"
            disabled={loading}
                    className="w-full bg-gradient-to-r from-[var(--drone-green)] to-[var(--drone-teal)] text-black font-medium py-3 rounded-xl hover:shadow-lg hover:shadow-[var(--drone-green)]/25 transition-all duration-300"
          >
                    {loading ? (isLogin ? 'Signing In...' : 'Creating Account...') : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
                </motion.div>
        </form>

              <div className="mt-8 text-center">
                <p className="text-white/60 text-sm">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[var(--drone-green)] hover:text-[var(--drone-teal)] transition-colors font-medium"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
      </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
