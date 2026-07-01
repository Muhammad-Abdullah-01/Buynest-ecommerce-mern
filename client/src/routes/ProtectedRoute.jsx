import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the original route they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect regular users attempting to hit admin routes back to store home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
