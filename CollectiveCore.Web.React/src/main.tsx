import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-4ewv5h2owkvs8jgi.us.auth0.com"
      clientId="dbDi9PIZsPgK4yGE20F9YLQneuTJeDUz"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://localhost:7091/api", // your API identifier
        scope: "openid profile email",
      }}
    >
    <App />
    </Auth0Provider>
  </React.StrictMode>
);