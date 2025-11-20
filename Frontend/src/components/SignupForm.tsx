import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Logo } from './Logo';

interface SignupFormProps {
  selectedPlan: string;
  selectedStream: string;
  planPrice: string;
  onComplete: () => void;
  onBack: () => void;
}

export function SignupForm({
  selectedPlan,
  selectedStream,
  planPrice,
  onComplete,
  onBack,
}: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    businessName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.cardNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Account created successfully!');
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto p-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6 bg-white rounded-lg p-4 inline-block">
            <Logo size="md" />
          </div>
          <h1 className="text-foreground mb-2">Complete Your Registration</h1>
          <p className="text-muted-foreground">
            {selectedPlan} Plan ({selectedStream === 'digital' ? 'Digital' : 'Physical'} Business) · {planPrice}/month
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h3 className="text-foreground mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">First Name *</label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Last Name *</label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Email *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Password *</label>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-700">Business Name</label>
                <Input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-foreground mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Street Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">State</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">ZIP Code</label>
                  <Input
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="10001"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Country</label>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="United States"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-foreground" />
              <h3 className="text-foreground">Payment Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">Card Number *</label>
                <Input
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-2 text-gray-700">Expiry Date *</label>
                  <Input
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700">CVC *</label>
                  <Input
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700">Name on Card *</label>
                <Input
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-secondary border-border">
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" required />
              <p className="text-sm text-foreground">
                I agree to the <a href="#" className="text-primary hover:opacity-80">Terms of Service</a> and{' '}
                <a href="#" className="text-primary hover:opacity-80">Privacy Policy</a>. 
                I understand that I will be charged {planPrice}/month after my 14-day free trial.
              </p>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Start Free Trial
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
