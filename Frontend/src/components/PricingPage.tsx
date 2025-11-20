import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Check, ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface PricingPageProps {
  onSelectPlan: (plan: string, stream: string, price: string) => void;
  onBack: () => void;
}

export function PricingPage({ onSelectPlan, onBack }: PricingPageProps) {
  const [selectedStream, setSelectedStream] = useState<'digital' | 'physical'>('digital');

  const digitalPlans = [
    {
      name: 'Solo',
      price: '$39',
      period: '/month',
      features: [
        '1 brand',
        'Up to 6 social profiles',
        'Product pull (basic)',
        'Monthly auto-planner',
        'Tap-to-publish + reminders',
        'Essentials analytics (90-day)',
      ],
      popular: false,
    },
    {
      name: 'Starter',
      price: '$79',
      period: '/month',
      features: [
        '2 brands',
        'Up to 12 profiles',
        'Product sync + SKU tags',
        '2 auto-planners/mo',
        'A/B hooks & captions',
        '6-month analytics + exports',
        'Basic approvals',
      ],
      popular: true,
    },
    {
      name: 'Growth',
      price: '$139',
      period: '/month',
      features: [
        '5 brands',
        'Up to 24 profiles',
        'UTM/GA merge dashboard',
        'Seasonal templates',
        'Bulk scheduling (CSV)',
        'Asset library',
        'Review-mining prompts',
        '12-month analytics + PDF/CSV',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Customized based on business profile',
        '5+ brands',
        'Dedicated account manager',
        'Advanced integrations',
        'Priority support',
        'Custom analytics',
      ],
      popular: false,
    },
  ];

  const physicalPlans = [
    {
      name: 'Solo',
      price: '$29',
      period: '/month',
      features: [
        '1 brand',
        'Up to 6 social profiles',
        'Monthly auto-planner',
        'Tap-to-publish + reminders',
        'Essentials analytics (90-day)',
        'Basic templates',
      ],
      popular: false,
    },
    {
      name: 'Starter',
      price: '$59',
      period: '/month',
      features: [
        '2 brands',
        'Up to 12 profiles',
        '2 auto-planners/mo',
        'Promo/offer & event templates',
        'Basic approvals & activity log',
        '6-month analytics + exports',
      ],
      popular: true,
    },
    {
      name: 'Growth',
      price: '$119',
      period: '/month',
      features: [
        '5 brands',
        'Up to 24 profiles',
        'Seasonal calendars',
        'Bulk scheduling (CSV)',
        'Asset library',
        'Localization tokens (menu/hours/neighborhood/class schedule)',
        '12-month analytics + PDF/CSV',
      ],
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Customized based on business profile',
        '5+ brands',
        'Dedicated account manager',
        'Advanced integrations',
        'Priority support',
      ],
      popular: false,
    },
  ];

  const plans = selectedStream === 'digital' ? digitalPlans : physicalPlans;

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6 bg-white rounded-lg p-4 inline-block">
              <Logo size="lg" />
            </div>
            <h1 className="text-foreground mb-2">Choose Your Plan</h1>
            <p className="text-muted-foreground mb-6">Select the perfect plan for your business</p>
            
            <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
              <button
                onClick={() => setSelectedStream('digital')}
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedStream === 'digital'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Digital Businesses
              </button>
              <button
                onClick={() => setSelectedStream('physical')}
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedStream === 'physical'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Physical Businesses
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative ${
                plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              
              <div className="mb-6">
                <h3 className="text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={plan.popular ? 'default' : 'outline'}
                onClick={() => onSelectPlan(plan.name, selectedStream, plan.price)}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>All plans include a 14-day free trial. No credit card required.</p>
          <p className="mt-2">Questions? <a href="#" className="text-primary hover:opacity-80">Contact our sales team</a></p>
        </div>
      </div>
    </div>
  );
}
