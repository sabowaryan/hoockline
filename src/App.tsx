import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthWrapper, useAuth } from './components/auth/AuthWrapper';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { Generator } from './components/Generator';
import { Payment } from './components/Payment';
import { Results } from './components/Results';
import { SuccessPage } from './components/SuccessPage';
import { AdminDashboard } from './components/AdminDashboard';

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

function PublicApp() {
  return (
    <AppProvider>
      <Layout>
        <AppContent />
      </Layout>
    </AppProvider>
  );
}

function AdminApp() {
  return (
    <AuthWrapper>
      {(user) => <AdminDashboard user={user} />}
    </AuthWrapper>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicApp />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;