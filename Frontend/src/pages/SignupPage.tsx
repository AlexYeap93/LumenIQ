import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import logoImage from '../components/photos/LumenIQ Logo.png';
import { Button } from '../components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

interface SignupPageProps {
  onSignup: () => void;
}

export function SignupPage({ onSignup }: SignupPageProps) {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState<'digital' | 'physical' | null>(null);

  const handleBusinessTypeSelect = (type: 'digital' | 'physical') => {
    setBusinessType(type);
    // Mock signup - in production this would proceed to full signup form
    onSignup();
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-slate-950 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-slate-950 to-slate-950" />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      </div>
      <div className="fixed top-4 left-4 w-fit h-fit z-10">
        <Button onClick={() => navigate('/')} className="bg-white/85 text-slate-900 hover:bg-white/90">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 font-switzer sm:px-6">
        <Card className="w-full max-w-4xl space-y-6 border-white/15 bg-white/90 p-8 text-slate-900 shadow-xl backdrop-blur">
          {/* Logo */}
          <div className="flex justify-center">
            <img src={logoImage} alt="LumenIQ" className="h-12 w-auto" />
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/80 px-4 py-1 text-xs font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Build your first week
            </span>
            <h1 className="text-2xl font-outfit text-slate-900">Get started with LumenIQ</h1>
            <p className="text-sm text-slate-600">Choose your business type to see tailored setup recommendations.</p>
          </div>

          {/* Business Type Selection */}
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            {/* Digital Business */}
            <button
              onClick={() => handleBusinessTypeSelect('digital')}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                businessType === 'digital'
                  ? 'border-blue-500/70 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg gradient-blue-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-outfit text-slate-900">Digital Business</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    For online-first brands, creators, SaaS, and e-commerce businesses
                  </p>
                </div>
                <div className="pt-2 text-sm text-slate-600">
                  <p>✓ Product sync & SKU tagging</p>
                  <p>✓ A/B testing for content</p>
                  <p>✓ UTM tracking & analytics</p>
                </div>
              </div>
            </button>

            {/* Physical Business */}
            <button
              onClick={() => handleBusinessTypeSelect('physical')}
              className={`p-6 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                businessType === 'physical'
                  ? 'border-blue-500/70 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg gradient-blue-primary flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-outfit text-slate-900">Physical Business</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    For cafes, gyms, salons, retail, and local service providers
                  </p>
                </div>
                <div className="pt-2 text-sm text-slate-600">
                  <p>✓ Local-focused templates</p>
                  <p>✓ Event & promotion tools</p>
                  <p>✓ Multi-location support</p>
                </div>
              </div>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm pt-4">
            <span className="text-slate-600">Already have an account? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}