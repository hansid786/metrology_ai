import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ConsumerLayout } from '../components/layout/ConsumerLayout';
import { LoginPage } from '../pages/LoginPage';
import { authService } from '../services/authService';

const ConsumerScanPage = lazy(() => import('../pages/consumer/ConsumerScanPage').then(module => ({ default: module.ConsumerScanPage })));
const ConsumerResultPage = lazy(() => import('../pages/consumer/ConsumerResultPage').then(module => ({ default: module.ConsumerResultPage })));
const ConsumerHistoryPage = lazy(() => import('../pages/consumer/ConsumerHistoryPage').then(module => ({ default: module.ConsumerHistoryPage })));
const ConsumerRulesPage = lazy(() => import('../pages/consumer/ConsumerRulesPage').then(module => ({ default: module.ConsumerRulesPage })));
const DashboardPage = lazy(() => import('../pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const NewInspectionPage = lazy(() => import('../pages/NewInspectionPage').then(module => ({ default: module.NewInspectionPage })));
const ResultsPage = lazy(() => import('../pages/ResultsPage').then(module => ({ default: module.ResultsPage })));
const HistoryPage = lazy(() => import('../pages/HistoryPage').then(module => ({ default: module.HistoryPage })));
const InspectionDetailPage = lazy(() => import('../pages/InspectionDetailPage').then(module => ({ default: module.InspectionDetailPage })));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const RulesPage = lazy(() => import('../pages/RulesPage').then(module => ({ default: module.RulesPage })));
const ReportsPage = lazy(() => import('../pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(module => ({ default: module.SettingsPage })));

const RouteLoading: React.FC = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-sm font-semibold text-slate-500">
    Loading workspace...
  </div>
);

const OfficerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authService.getCurrentUser();
  const isDemoSession = authService.isDemoSession();

  // Demo session → allow immediately, no Supabase check needed
  if (user && user.role !== 'CITIZEN' && isDemoSession) {
    return <AppLayout>{children}</AppLayout>;
  }

  // No user at all → go to login
  if (!user || user.role === 'CITIZEN') {
    return <Navigate to="/login" replace />;
  }

  // Supabase session → render (Supabase session is validated at login time)
  return <AppLayout>{children}</AppLayout>;
};

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
      {/* Gateway Portal */}
      <Route path="/login" element={<LoginPage />} />

        {/* ── 1. DEDICATED CITIZEN / CONSUMER PORTAL (Jago Grahak Jago) ── */}
        <Route
          path="/consumer/scan"
          element={
            <ConsumerLayout>
              <ConsumerScanPage />
            </ConsumerLayout>
          }
        />
        <Route
          path="/consumer/result/:id"
          element={
            <ConsumerLayout>
              <ConsumerResultPage />
            </ConsumerLayout>
          }
        />
        <Route
          path="/consumer/results/:id"
          element={
            <ConsumerLayout>
              <ConsumerResultPage />
            </ConsumerLayout>
          }
        />
        <Route
          path="/consumer/history"
          element={
            <ConsumerLayout>
              <ConsumerHistoryPage />
            </ConsumerLayout>
          }
        />
        <Route
          path="/consumer/rules"
          element={
            <ConsumerLayout>
              <ConsumerRulesPage />
            </ConsumerLayout>
          }
        />

        {/* ── 2. DEDICATED GOVERNMENT OFFICER ENFORCEMENT PORTAL ── */}
        <Route
          path="/dashboard"
          element={
            <OfficerRoute>
              <DashboardPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/inspect/new"
          element={
            <OfficerRoute>
              <NewInspectionPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/inspect/:id/results"
          element={
            <OfficerRoute>
              <ResultsPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/history"
          element={
            <OfficerRoute>
              <HistoryPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/history/:id"
          element={
            <OfficerRoute>
              <InspectionDetailPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <OfficerRoute>
              <AnalyticsPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/rules"
          element={
            <OfficerRoute>
              <RulesPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <OfficerRoute>
              <ReportsPage />
            </OfficerRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <OfficerRoute>
              <SettingsPage />
            </OfficerRoute>
          }
        />

        {/* Default Gateway Route */}
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};
