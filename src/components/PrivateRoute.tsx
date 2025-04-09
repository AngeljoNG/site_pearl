import React from 'react';
import { Navigate } from 'react-router-dom';
import { adminAuth } from '../lib/supabaseClient';

const AUTHORIZED_EMAILS = ['joelle@nguyen.eu', 'pearl@nguyen.eu'];

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const session = adminAuth.getSession();

  if (!session || !AUTHORIZED_EMAILS.includes(session.email)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}