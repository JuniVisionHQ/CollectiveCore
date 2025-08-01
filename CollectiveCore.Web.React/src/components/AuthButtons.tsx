import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null; // Avoid flicker on page load

  return (
    <>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
        </button>
      )}
    </>
  );
};

export default AuthButtons;