import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/layout/Header';
import { MinimalAuthHeader } from './components/layout/MinimalAuthHeader';
import { Footer } from './components/layout/Footer';
import { AiTravelCompanionDrawer } from './components/ai/AiTravelCompanionDrawer';
import { AppRoutes } from './routes/AppRoutes';
import { EntryWelcomePage } from './pages/auth/EntryWelcomePage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [entryDone, setEntryDone] = useState<boolean>(
    () => localStorage.getItem('setu_entry_completed') === 'true'
  );
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isBypassRoute = isAuthRoute || pathname.startsWith('/admin') || pathname.startsWith('/welcome');

  const isEntered = entryDone || !!user || isBypassRoute;

  if (loading) {
    return null;
  }

  if (!isEntered) {
    return <EntryWelcomePage onCompleteEntry={() => setEntryDone(true)} />;
  }

  let bgImage = '/tourist.jpeg';
  if (pathname.startsWith('/vendor')) {
    bgImage = '/vendor.jpeg';
  } else if (isAuthRoute) {
    bgImage = '/login.jpeg';
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between font-serif bg-cover bg-center bg-fixed transition-all duration-700"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      {isAuthRoute ? (
        <MinimalAuthHeader />
      ) : (
        <Header onOpenAi={() => setAiDrawerOpen(true)} />
      )}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
      <AiTravelCompanionDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <AppContent />
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
