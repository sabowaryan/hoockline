import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/HomePage';
import { GeneratorPage } from './pages/GeneratorPage';
import { Payment } from './pages/Payment';
import { ResultsPage } from './pages/ResultsPage';
import { SuccessPage } from './pages/SuccessPage';
import { ErrorPage } from './pages/ErrorPage';
import { TestErrorPage } from './pages/TestErrorPage';
import { NotFound } from './components/common/NotFound';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { TrafficPage } from './pages/Admin/TrafficPage';
import { UsersPage } from './pages/Admin/UsersPage';
import { OrdersPage } from './pages/Admin/OrdersPage';
import { SEOManagerPage } from './pages/Admin/SEOManagerPage';
import { AnalyticsPage } from './pages/Admin/AnalyticsPage';
import { SettingsPage } from './pages/Admin/SettingsPage';
import { SEOManager } from './components/common/SEOManager';
import { NotificationContainer } from './components/common/Notification';
import { ScrollManager } from './components/common/ScrollManager';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { trackPageViewDebounced } from './services/analytics';

function TrackPageView() {
  useEffect(() => {
    const handlePopState = () => {
      trackPageViewDebounced(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <SEOManager />
      <TrackPageView />
      <ErrorBoundary>
        <AppProvider>
          <NotificationContainer />
          <ScrollManager>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } />
            <Route path="/generator" element={
              <PublicLayout>
                <GeneratorPage />
              </PublicLayout>
            } />
            <Route path="/payment" element={
              <PublicLayout>
                <Payment />
              </PublicLayout>
            } />
            <Route path="/results" element={
              <PublicLayout>
                <ResultsPage />
              </PublicLayout>
            } />
            <Route path="/success" element={
              <PublicLayout>
                <SuccessPage />
              </PublicLayout>
            } />
            
            {/* Test Route (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="/test-errors" element={
                <PublicLayout>
                  <TestErrorPage />
                </PublicLayout>
              } />
            )}
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <AdminDashboard />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/traffic" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <TrafficPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/users" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <UsersPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/orders" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <OrdersPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/seo" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <SEOManagerPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/analytics" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <AnalyticsPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            <Route path="/admin/settings" element={
              <AuthWrapper>
                {(user) => (
                  <AdminLayout user={user}>
                    <SettingsPage />
                  </AdminLayout>
                )}
              </AuthWrapper>
            } />
            
            {/* Error Routes - Only for specific error pages */}
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Catch-all route for 404 - Keep original URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </ScrollManager>
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;