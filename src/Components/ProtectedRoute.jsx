import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('loggedInUserMobileNumber');

  if (!isLoggedIn) {
    // If not logged in, redirect to login with the intended destination
    return <Navigate 
      to="/" 
      state={{ from: location }} 
      replace 
    />;
  }

  return children;
};

export default ProtectedRoute;