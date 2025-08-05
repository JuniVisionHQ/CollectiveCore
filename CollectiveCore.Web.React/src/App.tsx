import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>
      <Toaster /> {/* Add Toaster here */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
