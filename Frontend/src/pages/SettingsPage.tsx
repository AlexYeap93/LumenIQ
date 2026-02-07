import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  CreditCard, 
  Building, 
  Palette,
  MapPin,
  ChevronRight,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

interface Business {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  instagramHandle: string;
  brandColor: string;
  location: string;
  isActive: boolean;
}

export function SettingsPage() {
  const currentPlan = {
    name: 'Growth',
    price: 119,
    type: 'Digital Business',
    billingPeriod: 'monthly',
    maxBrands: 5,
    features: [
      'Up to 5 brands',
      'Unlimited social profiles',
      'Advanced AI content generation',
      'Unlimited auto-planners',
      'Priority support'
    ]
  };

  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'My Main Business',
      description: 'A great business doing amazing things',
      websiteUrl: 'https://mybusiness.com',
      instagramHandle: '@mybusiness',
      brandColor: '#3b82f6',
      location: 'New York, USA',
      isActive: true
    },
    {
      id: '2',
      name: 'Secondary Brand',
      description: 'My second business venture',
      websiteUrl: 'https://secondbrand.com',
      instagramHandle: '@secondbrand',
      brandColor: '#10b981',
      location: 'Los Angeles, USA',
      isActive: false
    }
  ]);

  const [activeBusiness, setActiveBusiness] = useState(businesses[0]);
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [newBusiness, setNewBusiness] = useState<Partial<Business>>({
    name: '',
    description: '',
    websiteUrl: '',
    instagramHandle: '',
    brandColor: '#3b82f6',
    location: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    postReminders: true,
    weeklyReports: false,
    aiSuggestions: true
  });

  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  });

  const canAddMoreBrands = businesses.length < currentPlan.maxBrands;

  const handleSwitchBusiness = (business: Business) => {
    setBusinesses(businesses.map(b => ({
      ...b,
      isActive: b.id === business.id
    })));
    setActiveBusiness(business);
  };

  const handleAddBusiness = () => {
    if (!newBusiness.name) return;
    
    const business: Business = {
      id: Date.now().toString(),
      name: newBusiness.name,
      description: newBusiness.description || '',
      websiteUrl: newBusiness.websiteUrl || '',
      instagramHandle: newBusiness.instagramHandle || '',
      brandColor: newBusiness.brandColor || '#3b82f6',
      location: newBusiness.location || '',
      isActive: false
    };

    setBusinesses([...businesses, business]);
    setNewBusiness({
      name: '',
      description: '',
      websiteUrl: '',
      instagramHandle: '',
      brandColor: '#3b82f6',
      location: ''
    });
    setShowAddBusiness(false);
  };

  const handleDeleteBusiness = (id: string) => {
    if (businesses.length <= 1) {
      alert('You must have at least one business');
      return;
    }
    if (window.confirm('Are you sure you want to delete this business?')) {
      setBusinesses(businesses.filter(b => b.id !== id));
      if (activeBusiness.id === id) {
        const newActive = businesses.find(b => b.id !== id)!;
        setActiveBusiness(newActive);
      }
    }
  };

  const handleUpdateBusiness = (field: keyof Business, value: string) => {
    setActiveBusiness({ ...activeBusiness, [field]: value });
    setBusinesses(businesses.map(b => 
      b.id === activeBusiness.id ? { ...b, [field]: value } : b
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your account and business preferences</p>
      </div>

      <Tabs defaultValue="businesses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Businesses</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Businesses Tab */}
        <TabsContent value="businesses" className="space-y-6">
          {/* Current Plan Info */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{currentPlan.name} Plan</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                    {currentPlan.type}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Using {businesses.length} of {currentPlan.maxBrands} available brands
                </p>
                <div className="w-full bg-background/50 rounded-full h-2">
                  <div 
                    className="gradient-blue-primary h-2 rounded-full transition-all"
                    style={{ width: `${(businesses.length / currentPlan.maxBrands) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">${currentPlan.price}</div>
                <div className="text-sm text-muted-foreground">/month</div>
              </div>
            </div>
          </Card>

          {/* Business Selector */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Your Businesses</h3>
              {canAddMoreBrands && (
                <Button
                  onClick={() => setShowAddBusiness(!showAddBusiness)}
                  size="sm"
                  className="gradient-blue-primary text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Business
                </Button>
              )}
            </div>

            {/* Add New Business Form */}
            {showAddBusiness && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 border border-border rounded-lg bg-muted/30"
              >
                <h4 className="font-medium text-foreground mb-4">Add New Business</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newBusinessName">Business Name</Label>
                    <Input
                      id="newBusinessName"
                      value={newBusiness.name}
                      onChange={(e) => setNewBusiness({ ...newBusiness, name: e.target.value })}
                      placeholder="My New Business"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newBusinessDesc">Description</Label>
                    <Input
                      id="newBusinessDesc"
                      value={newBusiness.description}
                      onChange={(e) => setNewBusiness({ ...newBusiness, description: e.target.value })}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddBusiness} size="sm" className="gradient-blue-primary text-white">
                      Add Business
                    </Button>
                    <Button onClick={() => setShowAddBusiness(false)} size="sm" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Business List */}
            <div className="space-y-2">
              {businesses.map((business) => (
                <button
                  key={business.id}
                  onClick={() => handleSwitchBusiness(business)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    business.isActive
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: business.brandColor }}
                      >
                        {business.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          {business.name}
                          {business.isActive && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{business.description}</p>
                        {business.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {business.location}
                          </div>
                        )}
                      </div>
                    </div>
                    {businesses.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBusiness(business.id);
                        }}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {!canAddMoreBrands && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  You've reached the maximum number of businesses for your plan. 
                  <button className="text-primary hover:underline ml-1">Upgrade to add more.</button>
                </p>
              </div>
            )}
          </Card>

          {/* Active Business Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {activeBusiness.name} Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={activeBusiness.name}
                  onChange={(e) => handleUpdateBusiness('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Description</Label>
                <Textarea
                  id="businessDescription"
                  value={activeBusiness.description}
                  onChange={(e) => handleUpdateBusiness('description', e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={activeBusiness.websiteUrl}
                    onChange={(e) => handleUpdateBusiness('websiteUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagramHandle">Instagram Handle</Label>
                  <Input
                    id="instagramHandle"
                    value={activeBusiness.instagramHandle}
                    onChange={(e) => handleUpdateBusiness('instagramHandle', e.target.value)}
                    placeholder="@yourbusiness"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brandColor">Brand Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="brandColor"
                      type="color"
                      value={activeBusiness.brandColor}
                      onChange={(e) => handleUpdateBusiness('brandColor', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={activeBusiness.brandColor}
                      onChange={(e) => handleUpdateBusiness('brandColor', e.target.value)}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={activeBusiness.location}
                    onChange={(e) => handleUpdateBusiness('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <Button className="gradient-blue-primary text-white hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                />
              </div>

              <Button className="gradient-blue-primary text-white hover:opacity-90">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
            <div className="space-y-4">
              <Button variant="outline">Change Password</Button>
              <div className="pt-4 border-t border-border">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Email Notifications</div>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Post Reminders</div>
                  <p className="text-sm text-muted-foreground">Get reminded before posts go live</p>
                </div>
                <Switch
                  checked={notifications.postReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, postReminders: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">Weekly Reports</div>
                  <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">AI Suggestions</div>
                  <p className="text-sm text-muted-foreground">Get AI-powered content recommendations</p>
                </div>
                <Switch
                  checked={notifications.aiSuggestions}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, aiSuggestions: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Current Plan</h3>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{currentPlan.name} Plan</div>
                  <p className="text-muted-foreground mt-1">{currentPlan.type}</p>
                  <ul className="mt-3 space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-foreground">${currentPlan.price}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-destructive">Cancel Subscription</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                <CreditCard className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
