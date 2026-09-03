import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ConsumerLayout } from '../components/layout/ConsumerLayout';
import { LoginPage } from '../pages/LoginPage';
import { ConsumerScanPage } from '../pages/consumer/ConsumerScanPage';
import { ConsumerResultPage } from '../pages/consumer/ConsumerResultPage';
import { ConsumerHistoryPage } from '../pages/consumer/ConsumerHistoryPage';
import { ConsumerRulesPage } from '../pages/consumer/ConsumerRulesPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NewInspectionPage } from '../pages/NewInspectionPage';
import { ResultsPage } from '../pages/ResultsPage';
import { HistoryPage } from '../pages/HistoryPage';
import { InspectionDetailPage } from '../pages/InspectionDetailPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { RulesPage } from '../pages/RulesPage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { authService } from '../services/authService';

const OfficerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = authService.getCurrentUser();
  if (!user || user.role === 'CITIZEN') {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export const AppRouter: React.FC = () => {
  return (
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
  );
};
