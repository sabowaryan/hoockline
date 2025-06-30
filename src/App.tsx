import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { Generator } from './components/Generator';
import { Payment } from './components/Payment';
import { Results } from './components/Results';
import { SuccessPage } from './components/SuccessPage';

function AppContent() {
  const { state } = useApp();

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
    <AuthWrapper>
      {(user) => (
        <AppProvider>
          <Layout>
            <AppContent />
          </Layout>
        </AppProvider>
      )}
    </AuthWrapper>
  );
}

export default App;