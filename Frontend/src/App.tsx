import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from './components/ui/sonner';
import { store } from './shell/store';
import { ShellLayout } from './shell/layouts/ShellLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { ChatbotPage } from './pages/ChatbotPage';
import { CalendarPage } from './pages/CalendarPage';
import { PhotoStoragePage } from './pages/PhotoStoragePage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuth } from './shell/hooks/useAuth';

function AppContent() {
  const { isAuthenticated, needsOnboarding, hasCompletedOnboarding, login, signup, completeOnboarding } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={<LoginPage onLogin={(email: string) => login(email, 'mock-token')} />} 
        />
        <Route 
          path="/signup" 
          element={<SignupPage onSignup={() => signup('mock-user@lumeniq.local', 'mock-token')} />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/app/*" 
          element={
            isAuthenticated ? (
              needsOnboarding && !hasCompletedOnboarding ? (
                <OnboardingWizard onComplete={completeOnboarding} />
              ) : (
                <ShellLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="/dashboard" element={<ChatbotPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/photo-storage" element={<PhotoStoragePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Routes>
                </ShellLayout>
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Default redirect */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/app/dashboard" : "/"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster />
    </Provider>
  );
}