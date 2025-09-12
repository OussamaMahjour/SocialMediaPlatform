// src/routes/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { ReactNode } from 'react';
import NavBar from '../components/NavBar';

export const PrivateRoute = ({ children }:{ children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated  ? <div className='h-screen w-screen flex flex-col '>
                                <NavBar /> 
                                  <div className='flex-1 w-full'>
                                    {children}
                                  </div>
                                
                                </div> :
                                 <Navigate to="/login" replace />;
};
