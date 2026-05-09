import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // For auth pages (login, register, etc.) - redirect authenticated users to dashboard
  if (!requireAuth) {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // For protected pages (dashboard, etc.) - redirect unauthenticated users to login
  if (requireAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return children;
};

export default ProtectedRoute;
