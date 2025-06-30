import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthWrapper, useAuth } from './components/auth/AuthWrapper';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { Generator } from './components/Generator';
import { Payment } from './components/Payment';
import { Results } from './components/Results';
import { SuccessPage } from './components/SuccessPage';
import { AdminDashboard } from './components/AdminDashboard';
import { trackPageViewDebounced } from './services/analytics';

function AppContent() {
  const { state } = useApp();
  const location = useLocation();

  // Track page views when location changes
  useEffect(() => {
    trackPageViewDebounced(location.pathname);
  }, [location.pathname]);

  switch (state.currentStep) {
    case 'home':
      return <HomePage />;
    case 'generator':
      return <Generator />;
    case 'payment':
      return <Payment />;
    case 'results':
      return <Results />;
    case 'success':
      return <SuccessPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Layout */}
        <Route path="/" element={
          <AppProvider>
            <Layout>
              <AppContent />
            </Layout>
          </AppProvider>
        } />
        
        {/* Admin route without public Layout */}
        <Route path="/admin" element={
          <AuthWrapper>
            {(user) => <AdminDashboard user={user} />}
          </AuthWrapper>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;