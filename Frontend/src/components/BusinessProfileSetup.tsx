import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Logo } from './Logo';
import { toast } from 'sonner@2.0.3';

export interface BusinessProfile {
  businessName: string;
  businessDescription: string;
  targetMarket: string;
  websiteUrl: string;
  brandColor: string;
}

interface BusinessProfileSetupProps {
  onComplete: (profile: BusinessProfile) => void;
}

export function BusinessProfileSetup({ onComplete }: BusinessProfileSetupProps) {
  const [formData, setFormData] = useState<BusinessProfile>({
    businessName: '',
    businessDescription: '',
    targetMarket: '',
    websiteUrl: '',
    brandColor: '#5B6DB8',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.targetMarket) {
      toast.error('Please fill in required fields');
      return;
    }

    toast.success('Business profile created successfully!');
    onComplete(formData);
  };

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6 bg-white rounded-lg p-4">
            <Logo size="md" />
          </div>
          <h1 className="text-foreground mb-2">Set Up Your Business Profile</h1>
          <p className="text-muted-foreground text-center">
            Help us understand your business to create better content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-foreground">
              Business Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={formData.businessName}
              onChange={(e) => handleChange('businessName', e.target.value)}
              placeholder="Enter your business name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Business Description
            </label>
            <Textarea
              value={formData.businessDescription}
              onChange={(e) => handleChange('businessDescription', e.target.value)}
              placeholder="Briefly describe what your business does..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Target Market <span className="text-destructive">*</span>
            </label>
            <Textarea
              value={formData.targetMarket}
              onChange={(e) => handleChange('targetMarket', e.target.value)}
              placeholder="Who are your ideal customers? (e.g., Young professionals aged 25-35, health-conscious individuals)"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Website URL
            </label>
            <Input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => handleChange('websiteUrl', e.target.value)}
              placeholder="https://www.yourbusiness.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">
              Brand Color
            </label>
            <div className="flex items-center gap-4">
              <Input
                type="color"
                value={formData.brandColor}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                className="w-20 h-12 cursor-pointer"
              />
              <Input
                type="text"
                value={formData.brandColor}
                onChange={(e) => handleChange('brandColor', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Choose your primary brand color for consistent visual identity
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Complete Setup
          </Button>
        </form>
      </Card>
    </div>
  );
}
