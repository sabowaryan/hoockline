import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HomePage } from './components/HomePage';
import { Generator } from './components/Generator';
import { Payment } from './components/Payment';
import { Results } from './components/Results';

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
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;