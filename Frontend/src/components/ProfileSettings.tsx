import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Save, ArrowLeft, CreditCard, Building2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BusinessProfile } from './BusinessProfileSetup';

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingZip: string;
}

interface ProfileSettingsProps {
  profile: BusinessProfile;
  onSave: (profile: BusinessProfile) => void;
  onBack: () => void;
}

export function ProfileSettings({ profile, onSave, onBack }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '•••• •••• •••• 4242',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    billingCity: '',
    billingZip: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.targetMarket) {
      toast.error('Please fill in required fields');
      return;
    }

    toast.success('Profile updated successfully!');
    onSave(formData);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payment information updated successfully!');
  };

  const handleChange = (field: keyof BusinessProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 overflow-auto bg-background min-h-screen">
      <div className="max-w-4xl mx-auto p-8 min-h-full">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Calendar
        </Button>

        <div className="mb-8">
          <h1 className="text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your business information and preferences
          </p>
        </div>

        <Card className="p-8">
          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Business Information
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business">
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
                    placeholder="Who are your ideal customers?"
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

                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Business Information
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="payment">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-foreground">
                    Card Number
                  </label>
                  <Input
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-foreground">
                    Cardholder Name
                  </label>
                  <Input
                    value={paymentInfo.cardName}
                    onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground">
                      Expiry Date
                    </label>
                    <Input
                      value={paymentInfo.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-foreground">
                      CVV
                    </label>
                    <Input
                      type="password"
                      value={paymentInfo.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-sm mb-4 text-foreground">Billing Address</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2 text-foreground">
                        Street Address
                      </label>
                      <Input
                        value={paymentInfo.billingAddress}
                        onChange={(e) => handlePaymentChange('billingAddress', e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2 text-foreground">
                          City
                        </label>
                        <Input
                          value={paymentInfo.billingCity}
                          onChange={(e) => handlePaymentChange('billingCity', e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-foreground">
                          ZIP Code
                        </label>
                        <Input
                          value={paymentInfo.billingZip}
                          onChange={(e) => handlePaymentChange('billingZip', e.target.value)}
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Update Payment Information
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
