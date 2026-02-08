import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import logoImage from '../components/photos/LumenIQ Logo.png';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in production this would use Firebase auth
    onLogin(email);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-slate-950 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-slate-950 to-slate-950" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 font-switzer sm:px-6">
        <Card className="w-full max-w-md space-y-6 border-white/15 bg-white/85 p-8 text-slate-900 shadow-xl backdrop-blur">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logoImage} alt="LumenIQ" className="h-12 w-auto" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/80 px-4 py-1 text-xs font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Welcome back
            </span>
            <h1 className="text-2xl font-outfit text-slate-900">Sign in to LumenIQ</h1>
            <p className="text-sm text-slate-600">Pick up where you left off and keep your social on autopilot.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 bg-white/90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-200 bg-white/90"
              />
            </div>

            <Button type="submit" className="w-full gradient-blue-primary text-white hover:opacity-90">
              Sign In
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <button
              onClick={() => navigate('/signup')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}