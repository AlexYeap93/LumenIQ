import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import logoImage from '../components/photos/LumenIQClear.png';
import { Button } from '../components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useUnicornStudio } from '../utils/useUnicornStudio';
import { toast } from 'sonner';

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [businessType, setBusinessType] = useState<'digital' | 'physical' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useUnicornStudio();

  const handleBusinessTypeSelect = (type: 'digital' | 'physical') => {
    setBusinessType(type);
    setStep(2);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      toast.error('Password must contain at least one lowercase letter');
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }
    if (!/(?=.*\d)/.test(password)) {
      toast.error('Password must contain at least one number');
      return;
    }

    navigate('/onboarding', { state: { email, password, businessType } });
  };

  return (
    <div className="text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          data-us-project="57WCL9Xqt44BBvTV9ehL"
          data-us-production="true"
          data-us-lazyload="true"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-slate-950/55" aria-hidden="true" />
      </div>
      <div className="fixed top-4 left-4 w-fit h-fit z-10">
        <Button onClick={() => navigate('/')} className="text-white bg-transparent hover:bg-white/10">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 font-switzer sm:px-6">
        <Card className="w-full max-w-4xl space-y-6 border-white/15 bg-transparent p-8 text-white shadow-xl backdrop-blur">
          {/* Logo */}
          <div className="flex justify-center items-center gap-2">
            <img src={logoImage} alt="LumenIQ" className="h-16 w-auto" />
            <p className="text-4xl font-outfit text-white">LumenIQ</p>
          </div>

          {step === 1 ? (
            <>
              {/* Step 1: Business Type Selection */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-outfit text-white">What type of business do you have?</h1>
                <p className="text-sm md:text-lg text-white">Choose your business type to get started.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 w-full">
                <button
                  onClick={() => handleBusinessTypeSelect('digital')}
                  className="p-6 rounded-2xl border-2 border-transparent transition-all text-left hover:shadow-lg bg-white/20 hover:border-blue-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg gradient-blue-accent flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-outfit text-white">Digital Business</h3>
                      <p className="text-sm text-white mt-1">
                        For online-first brands, creators, SaaS, and e-commerce businesses
                      </p>
                    </div>
                    <div className="pt-2 text-sm text-white">
                      <p>✓ Product sync & SKU tagging</p>
                      <p>✓ A/B testing for content</p>
                      <p>✓ UTM tracking & analytics</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleBusinessTypeSelect('physical')}
                  className="p-6 rounded-2xl border-2 border-transparent transition-all text-left hover:shadow-lg bg-white/15 hover:border-blue-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-lg gradient-blue-primary flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-outfit text-white">Physical Business</h3>
                      <p className="text-sm text-white mt-1">
                        For cafes, gyms, salons, retail, and local service providers
                      </p>
                    </div>
                    <div className="pt-2 text-sm text-white">
                      <p>✓ Local-focused templates</p>
                      <p>✓ Event & promotion tools</p>
                      <p>✓ Multi-location support</p>
                    </div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Email & Password */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl md:text-3xl font-outfit text-white">Create your account</h1>
                <p className="text-sm md:text-lg text-white">
                  {businessType === 'digital' ? 'Digital' : 'Physical'} business — enter your details to get started.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 max-w-2xl mx-auto w-full">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="border-slate-200 bg-white/90 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-slate-200 bg-white/90 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-white">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-slate-200 bg-white/90 text-slate-900"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-blue-primary text-white hover:opacity-90 h-11 text-base font-medium"
                >
                  Continue
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-white/70 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5" />
                  Change business type
                </button>
              </form>
            </>
          )}

          {/* Login Link */}
          <div className="text-center text-sm flex flex-col">
            <span className="text-white">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:text-blue-300 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
