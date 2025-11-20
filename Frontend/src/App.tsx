import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CalendarPage } from './components/CalendarPage';
import { PhotoGeneration } from './components/PhotoGeneration';
import { PhotoStorage, StoredImage } from './components/PhotoStorage';
import { LoginPage } from './components/LoginPage';
import { PricingPage } from './components/PricingPage';
import { SignupForm } from './components/SignupForm';
import { BusinessProfileSetup, BusinessProfile } from './components/BusinessProfileSetup';
import { ProfileSettings } from './components/ProfileSettings';
import { Toaster } from './components/ui/sonner';
import exampleImage from 'figma:asset/df2090fc49b955134e9a81b5eaf931ef24ffe2e6.png';

export interface Post {
  id: string;
  date: Date;
  time: string;
  caption: string;
  imageUrl: string;
  status: 'scheduled' | 'draft' | 'posted';
  platform: string;
  isAiGenerated?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'denied';
}

type AppState = 'login' | 'pricing' | 'signup' | 'profile-setup' | 'dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [activePage, setActivePage] = useState('calendar');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);

  // Initialize with example posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      date: new Date(2025, 10, 15), // November 15, 2025
      time: '09:00',
      caption: 'Have you had coffee today? Start your morning right with our fresh croissants and premium coffee! ☕️🥐',
      imageUrl: exampleImage,
      status: 'scheduled',
      platform: 'instagram',
      isAiGenerated: false,
      approvalStatus: 'approved',
    },
    {
      id: '2',
      date: new Date(2025, 10, 15), // November 15, 2025
      time: '14:00',
      caption: 'Elevate your afternoon with our premium selection! ✨ #lifestyle #quality',
      imageUrl: exampleImage,
      status: 'scheduled',
      platform: 'facebook',
      isAiGenerated: true,
      approvalStatus: 'pending',
    },
  ]);
  
  const [storedImages, setStoredImages] = useState<StoredImage[]>([
    {
      id: '1',
      url: exampleImage,
      prompt: 'Coffee and croissant promotional image',
      uploadedAt: new Date(),
    },
  ]);

  const handleAddPost = (post: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      approvalStatus: post.isAiGenerated ? 'pending' : 'approved',
    };
    setPosts((prev) => [...prev, newPost]);
  };

  const handleUpdatePost = (postId: string, updates: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updates } : post))
    );
  };

  const handleSaveImage = (imageUrl: string, prompt: string) => {
    const newImage: StoredImage = {
      id: Date.now().toString(),
      url: imageUrl,
      prompt,
      uploadedAt: new Date(),
    };
    setStoredImages((prev) => [...prev, newImage]);
  };

  const handleDeleteImage = (id: string) => {
    setStoredImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleLogin = () => {
    // For existing users, simulate that they already have a profile
    setBusinessProfile({
      businessName: 'My Business',
      businessDescription: 'A great business serving customers',
      targetMarket: 'Small to medium businesses',
      websiteUrl: 'https://mybusiness.com',
      brandColor: '#5B6DB8',
    });
    setAppState('dashboard');
  };

  const handleCreateAccount = () => {
    setAppState('pricing');
  };

  const handleSelectPlan = (plan: string, stream: string, price: string) => {
    if (plan === 'Enterprise') {
      // In a real app, this would open a contact form
      alert('Please contact our sales team for Enterprise pricing.');
      return;
    }
    setSelectedPlan(plan);
    setSelectedStream(stream);
    setPlanPrice(price);
    setAppState('signup');
  };

  const handleSignupComplete = () => {
    setAppState('profile-setup');
  };

  const handleProfileSetupComplete = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setAppState('dashboard');
  };

  const handleProfileUpdate = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
    setActivePage('calendar');
  };

  const handleBackToLogin = () => {
    setAppState('login');
  };

  const handleBackToPricing = () => {
    setAppState('pricing');
  };

  if (appState === 'login') {
    return (
      <>
        <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} />
        <Toaster />
      </>
    );
  }

  if (appState === 'pricing') {
    return (
      <>
        <PricingPage onSelectPlan={handleSelectPlan} onBack={handleBackToLogin} />
        <Toaster />
      </>
    );
  }

  if (appState === 'signup') {
    return (
      <>
        <SignupForm
          selectedPlan={selectedPlan}
          selectedStream={selectedStream}
          planPrice={planPrice}
          onComplete={handleSignupComplete}
          onBack={handleBackToPricing}
        />
        <Toaster />
      </>
    );
  }

  if (appState === 'profile-setup') {
    return (
      <>
        <BusinessProfileSetup onComplete={handleProfileSetupComplete} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      
      <main className="flex-1 overflow-auto">
        {activePage === 'calendar' && (
          <CalendarPage posts={posts} onAddPost={handleAddPost} onUpdatePost={handleUpdatePost} storedImages={storedImages} />
        )}
        
        {activePage === 'photo-generation' && (
          <PhotoGeneration onSaveImage={handleSaveImage} />
        )}
        
        {activePage === 'photo-storage' && (
          <PhotoStorage images={storedImages} onDeleteImage={handleDeleteImage} />
        )}
        
        {activePage === 'settings' && businessProfile && (
          <ProfileSettings
            profile={businessProfile}
            onSave={handleProfileUpdate}
            onBack={() => setActivePage('calendar')}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
}
