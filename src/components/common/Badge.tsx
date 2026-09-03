import React from 'react';
import { ComplianceStatus, InspectionOverallStatus } from '../../types/inspection';
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Clock, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: ComplianceStatus | InspectionOverallStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const { lang, t } = useLanguage();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold',
    md: 'text-xs px-2.5 py-1 font-extrabold',
    lg: 'text-sm px-3.5 py-1.5 font-black',
  }[size];

  switch (status) {
    case 'PASS':
    case 'COMPLIANT':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 ${sizeClasses}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>{lang === 'hi' ? '🟢 मान्य (सत्यापित)' : '🟢 Compliant (Verified)'}</span>
        </span>
      );

    case 'FAIL':
    case 'VIOLATION':
    case 'NON_COMPLIANT':
    case 'CRITICAL_NON_COMPLIANT':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-300 ${sizeClasses}`}>
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>{lang === 'hi' ? '🔴 नियम उल्लंघन' : '🔴 Violation Detected'}</span>
        </span>
      );

    case 'WARNING':
    case 'PARTIALLY_VERIFIED':
    case 'ATTENTION_REQUIRED':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 ${sizeClasses}`}>
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>{lang === 'hi' ? '🟡 आंशिक रूप से सत्यापित' : '🟡 Partially Verified'}</span>
        </span>
      );

    case 'INSUFFICIENT_EVIDENCE':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-300 ${sizeClasses}`}>
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          <span>{lang === 'hi' ? '🟣 अपर्याप्त साक्ष्य' : '🟣 Insufficient Evidence'}</span>
        </span>
      );

    case 'NOT_DETECTED':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 ${sizeClasses}`}>
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>{lang === 'hi' ? 'पहचाना नहीं गया' : 'Not Detected'}</span>
        </span>
      );

    case 'REVIEW_REQUIRED':
    case 'PENDING':
    case 'IN_REVIEW':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-300 ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
          <span>{lang === 'hi' ? 'निरीक्षणधीन' : 'IN REVIEW'}</span>
        </span>
      );

    case 'EXEMPT':
    case 'NOT_APPLICABLE':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300 ${sizeClasses}`}>
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>{lang === 'hi' ? 'छूट प्राप्त (Exempt)' : 'STATUTORY EXEMPT'}</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses}`}>
          {showIcon && <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>{status}</span>
        </span>
      );
  }
};
