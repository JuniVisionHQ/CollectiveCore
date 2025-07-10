import React from 'react';
import { createBrowserRouter } from 'react-router';
import AppLayout from './layouts/AppLayout';
import BookListPage from './pages/BookListPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // layout with theme switcher and outlet
    children: [
      { index: true, element: <BookListPage /> }, // default page at "/"
      
    ],
  },
]);