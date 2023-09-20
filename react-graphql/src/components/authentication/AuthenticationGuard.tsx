'use client'

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Loader from '../loader/Loader';

const AuthenticationGuard = (props: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect({
        appState: { returnTo: window.location.href },
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return <>{isAuthenticated && props.children}</>;
};

export default AuthenticationGuard;
