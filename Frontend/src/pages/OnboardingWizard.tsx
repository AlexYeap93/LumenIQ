import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { PricingPlans } from '../components/PricingPlans';
import logoImage from '../components/photos/LumenIQ Logo.png';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateRequired,
  validateUrl,
  validateCardNumber,
  validateCardExpiry,
  validateCVC,
  validateZipCode
} from '../signup-onboarding/utils/validation';
import { toast } from 'sonner';

interface OnboardingWizardProps {
  onComplete: () => void;
}

interface OnboardingData {
  // Account Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Address
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Business Information
  businessType: 'digital' | 'physical';
  b2bOrB2c: 'b2b' | 'b2c' | 'both';
  selectedPlan: string;
  businessName: string;
  businessDescription: string;
  brandColor: string;
  websiteUrl: string;
  instagramHandle: string;
  targetLocation: string;
  idealCustomer: string;
  productsServices: string;
  businessAge: string;
  industryNiche: string;
  // Payment
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
  cardholderName: string;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 14;
  const [data, setData] = useState<Partial<OnboardingData>>({
    businessType: 'digital',
    b2bOrB2c: 'b2c',
    country: 'United States'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const progress = (step / totalSteps) * 100;

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limitedDigits = digits.slice(0, 16);
    // Add space every 4 digits
    const formatted = limitedDigits.match(/.{1,4}/g)?.join(' ') || limitedDigits;
    return formatted;
  };
  
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1: {
        const firstNameValidation = validateName(data.firstName || '', 'First name');
        if (!firstNameValidation.isValid) {
          newErrors.firstName = firstNameValidation.error!;
          toast.error(firstNameValidation.error);
        }
        const lastNameValidation = validateName(data.lastName || '', 'Last name');
        if (!lastNameValidation.isValid) {
          newErrors.lastName = lastNameValidation.error!;
          toast.error(lastNameValidation.error);
        }
        break;
      }
      case 2: {
        const emailValidation = validateEmail(data.email || '');
        if (!emailValidation.isValid) {
          newErrors.email = emailValidation.error!;
          toast.error(emailValidation.error);
        }
        const phoneValidation = validatePhone(data.phone || '');
        if (!phoneValidation.isValid) {
          newErrors.phone = phoneValidation.error!;
          toast.error(phoneValidation.error);
        }
        break;
      }
      case 3: {
        const addressValidation = validateRequired(data.address || '', 'Street address');
        if (!addressValidation.isValid) {
          newErrors.address = addressValidation.error!;
          toast.error(addressValidation.error);
        }
        const cityValidation = validateRequired(data.city || '', 'City');
        if (!cityValidation.isValid) {
          newErrors.city = cityValidation.error!;
          toast.error(cityValidation.error);
        }
        const stateValidation = validateRequired(data.state || '', 'State / Province');
        if (!stateValidation.isValid) {
          newErrors.state = stateValidation.error!;
          toast.error(stateValidation.error);
        }
        const zipValidation = validateZipCode(data.zipCode || '');
        if (!zipValidation.isValid) {
          newErrors.zipCode = zipValidation.error!;
          toast.error(zipValidation.error);
        }
        break;
      }
      case 4: {
        const businessNameValidation = validateRequired(data.businessName || '', 'Business name');
        if (!businessNameValidation.isValid) {
          newErrors.businessName = businessNameValidation.error!;
          toast.error(businessNameValidation.error);
        }
        break;
      }
      case 7: {
        if (!data.selectedPlan) {
          newErrors.selectedPlan = 'Please select a pricing plan';
          toast.error('Please select a pricing plan');
        }
        break;
      }
      case 8: {
        const cardholderValidation = validateRequired(data.cardholderName || '', 'Cardholder name');
        if (!cardholderValidation.isValid) {
          newErrors.cardholderName = cardholderValidation.error!;
          toast.error(cardholderValidation.error);
        }
        const cardNumberValidation = validateCardNumber(data.cardNumber || '');
        if (!cardNumberValidation.isValid) {
          newErrors.cardNumber = cardNumberValidation.error!;
          toast.error(cardNumberValidation.error);
        }
        const cardExpiryValidation = validateCardExpiry(data.cardExpiry || '');
        if (!cardExpiryValidation.isValid) {
          newErrors.cardExpiry = cardExpiryValidation.error!;
          toast.error(cardExpiryValidation.error);
        }
        const cvcValidation = validateCVC(data.cardCVC || '');
        if (!cvcValidation.isValid) {
          newErrors.cardCVC = cvcValidation.error!;
          toast.error(cvcValidation.error);
        }
        break;
      }
      case 9: {
        if (data.websiteUrl) {
          const urlValidation = validateUrl(data.websiteUrl, false);
          if (!urlValidation.isValid) {
            newErrors.websiteUrl = urlValidation.error!;
            toast.error(urlValidation.error);
          }
        }
        break;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      toast.success('Onboarding completed successfully!');
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Let's start with your name</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-lg">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={data.firstName || ''}
                  onChange={(e) => updateData('firstName', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.firstName ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-lg">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={data.lastName || ''}
                  onChange={(e) => updateData('lastName', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.lastName ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Contact Information</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={data.email || ''}
                  onChange={(e) => updateData('email', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-lg">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={data.phone || ''}
                  onChange={(e) => updateData('phone', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.phone ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Where are you located?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="address" className="text-lg">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={data.address || ''}
                  onChange={(e) => updateData('address', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.address ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="city" className="text-lg">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={data.city || ''}
                    onChange={(e) => updateData('city', e.target.value)}
                    className={`bg-input-background text-lg h-12 ${errors.city ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-lg">State / Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={data.state || ''}
                    onChange={(e) => updateData('state', e.target.value)}
                    className={`bg-input-background text-lg h-12 ${errors.state ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="zipCode" className="text-lg">ZIP / Postal Code</Label>
                <Input
                  id="zipCode"
                  placeholder="10001"
                  value={data.zipCode || ''}
                  onChange={(e) => updateData('zipCode', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.zipCode ? 'border-red-500' : ''}`}
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Tell us about your business</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="businessName" className="text-lg">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business Name"
                  value={data.businessName || ''}
                  onChange={(e) => updateData('businessName', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.businessName ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="businessDescription" className="text-lg">Business Description</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Describe what your business does..."
                  value={data.businessDescription || ''}
                  onChange={(e) => updateData('businessDescription', e.target.value)}
                  className="bg-input-background min-h-32 text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="brandColor" className="text-lg">Brand Color</Label>
                <div className="flex gap-4 items-center justify-center">
                  <Input
                    id="brandColor"
                    type="color"
                    value={data.brandColor || '#3b82f6'}
                    onChange={(e) => updateData('brandColor', e.target.value)}
                    className="w-24 h-16 cursor-pointer"
                  />
                  <span className="text-base text-muted-foreground">Choose your primary brand color</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">What type of business do you have?</h2>
            <RadioGroup
              value={data.businessType}
              onValueChange={(value) => updateData('businessType', value as 'digital' | 'physical')}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 p-6 border-2 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="digital" id="digital" className="w-5 h-5" />
                <Label htmlFor="digital" className="flex-1 cursor-pointer text-left">
                  <div className="font-medium text-lg">Digital Business</div>
                  <div className="text-base text-muted-foreground mt-1">Online-first brands, creators, SaaS, e-commerce</div>
                </Label>
              </div>
              <div className="flex items-center space-x-4 p-6 border-2 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="physical" id="physical" className="w-5 h-5" />
                <Label htmlFor="physical" className="flex-1 cursor-pointer text-left">
                  <div className="font-medium text-lg">Physical Business</div>
                  <div className="text-base text-muted-foreground mt-1">Cafes, gyms, salons, retail, local services</div>
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Who are your customers?</h2>
            <RadioGroup
              value={data.b2bOrB2c}
              onValueChange={(value) => updateData('b2bOrB2c', value as 'b2b' | 'b2c' | 'both')}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4 p-6 border-2 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="b2b" id="b2b" className="w-5 h-5" />
                <Label htmlFor="b2b" className="flex-1 cursor-pointer text-left">
                  <div className="font-medium text-lg">B2B (Business to Business)</div>
                  <div className="text-base text-muted-foreground mt-1">Selling to other businesses</div>
                </Label>
              </div>
              <div className="flex items-center space-x-4 p-6 border-2 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="b2c" id="b2c" className="w-5 h-5" />
                <Label htmlFor="b2c" className="flex-1 cursor-pointer text-left">
                  <div className="font-medium text-lg">B2C (Business to Consumer)</div>
                  <div className="text-base text-muted-foreground mt-1">Selling to individual customers</div>
                </Label>
              </div>
              <div className="flex items-center space-x-4 p-6 border-2 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="both" id="both" className="w-5 h-5" />
                <Label htmlFor="both" className="flex-1 cursor-pointer text-left">
                  <div className="font-medium text-lg">Both</div>
                  <div className="text-base text-muted-foreground mt-1">Serving both businesses and consumers</div>
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <PricingPlans
              businessType={data.businessType || 'digital'}
              onSelectPlan={(planId) => updateData('selectedPlan', planId)}
              selectedPlan={data.selectedPlan}
            />
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            key="step8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Payment Information</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="cardholderName" className="text-lg">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={data.cardholderName || ''}
                  onChange={(e) => updateData('cardholderName', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.cardholderName ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="cardNumber" className="text-lg">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={data.cardNumber || ''}
                  onChange={(e) => updateData('cardNumber', formatCardNumber(e.target.value))}
                  className={`bg-input-background text-lg h-12 ${errors.cardNumber ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="cardExpiry" className="text-lg">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={data.cardExpiry || ''}
                    onChange={(e) => updateData('cardExpiry', e.target.value)}
                    className={`bg-input-background text-lg h-12 ${errors.cardExpiry ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cardCVC" className="text-lg">CVC</Label>
                  <Input
                    id="cardCVC"
                    placeholder="123"
                    value={data.cardCVC || ''}
                    onChange={(e) => updateData('cardCVC', e.target.value)}
                    className={`bg-input-background text-lg h-12 ${errors.cardCVC ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 9:
        return (
          <motion.div
            key="step9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Your online presence</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="websiteUrl" className="text-lg">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={data.websiteUrl || ''}
                  onChange={(e) => updateData('websiteUrl', e.target.value)}
                  className={`bg-input-background text-lg h-12 ${errors.websiteUrl ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="instagramHandle" className="text-lg">Instagram Handle</Label>
                <Input
                  id="instagramHandle"
                  placeholder="@yourbusiness"
                  value={data.instagramHandle || ''}
                  onChange={(e) => updateData('instagramHandle', e.target.value)}
                  className="bg-input-background text-lg h-12"
                />
              </div>
            </div>
          </motion.div>
        );

      case 10:
        return (
          <motion.div
            key="step10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Where do you operate?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="targetLocation" className="text-lg">Target Location</Label>
                <Input
                  id="targetLocation"
                  placeholder="e.g., New York, USA"
                  value={data.targetLocation || ''}
                  onChange={(e) => updateData('targetLocation', e.target.value)}
                  className="bg-input-background text-lg h-12"
                />
                <p className="text-base text-muted-foreground">Where are your primary customers located?</p>
              </div>
            </div>
          </motion.div>
        );

      case 11:
        return (
          <motion.div
            key="step11"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">Who is your ideal customer?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="idealCustomer" className="text-lg">Describe Your Ideal Customer</Label>
                <Textarea
                  id="idealCustomer"
                  placeholder="Tell us about your ideal customers..."
                  value={data.idealCustomer || ''}
                  onChange={(e) => updateData('idealCustomer', e.target.value)}
                  className="bg-input-background min-h-32 text-lg"
                />
                <p className="text-base text-muted-foreground">Who are you trying to reach?</p>
              </div>
            </div>
          </motion.div>
        );

      case 12:
        return (
          <motion.div
            key="step12"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">What do you offer?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="productsServices" className="text-lg">Products / Services</Label>
                <Textarea
                  id="productsServices"
                  placeholder="What do you offer to your customers?"
                  value={data.productsServices || ''}
                  onChange={(e) => updateData('productsServices', e.target.value)}
                  className="bg-input-background min-h-32 text-lg"
                />
              </div>
            </div>
          </motion.div>
        );

      case 13:
        return (
          <motion.div
            key="step13"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">How long have you been in business?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="businessAge" className="text-lg">Business Age</Label>
                <Input
                  id="businessAge"
                  placeholder="e.g., 2 years, 6 months, Just starting"
                  value={data.businessAge || ''}
                  onChange={(e) => updateData('businessAge', e.target.value)}
                  className="bg-input-background text-lg h-12"
                />
              </div>
            </div>
          </motion.div>
        );

      case 14:
        return (
          <motion.div
            key="step14"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 text-center max-w-xl mx-auto"
          >
            <h2 className="text-2xl font-semibold text-foreground">What's your industry focus?</h2>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="industryNiche" className="text-lg">Industry Niches / Focus Areas</Label>
                <Textarea
                  id="industryNiche"
                  placeholder="e.g., Sustainable fashion, Organic food, Fitness coaching..."
                  value={data.industryNiche || ''}
                  onChange={(e) => updateData('industryNiche', e.target.value)}
                  className="bg-input-background min-h-32 text-lg"
                />
              </div>
              <div className="pt-4 text-center">
                <div className="inline-flex items-center gap-2 text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-lg">Almost done! Click Complete Setup to finish.</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-blue-light p-4">
      <Card className="w-full max-w-5xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img src={logoImage} alt="LumenIQ" className="h-10 w-auto" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="py-8 min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="text-base px-6 h-12"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="gradient-blue-primary text-white hover:opacity-90 text-base px-6 h-12"
            disabled={step === 7 && !data.selectedPlan}
          >
            {step === totalSteps ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}