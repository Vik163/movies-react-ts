import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ loggedIn, ...props }) => {
  let location = useLocation();

  // Не пускает зарегистрированного пользователя на страницы регистрации и авторизации
  if (location.pathname === '/sign-up' || location.pathname === '/sign-in') {
    return !loggedIn ? <Outlet /> : <Navigate to='/' />;
  }
  // ----------------------------------------------------------------------------------

  return loggedIn ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoute;
