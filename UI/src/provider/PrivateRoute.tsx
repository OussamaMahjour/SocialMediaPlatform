// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar';
import NotificationProvider from './NotificationProvider';

export const PrivateRoute = ({ children }:{ children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated  ? <div className='h-screen w-screen flex flex-col '>
                                  <NotificationProvider>
                                      <NavBar /> 
                                      <div className='flex-1 w-full'>
                                        {children}
                                      </div>
                                  </NotificationProvider>
                                </div> :
                                 <Navigate to="/login" replace />;
};
