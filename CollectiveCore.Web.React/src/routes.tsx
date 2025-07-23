import React from 'react';
import { createBrowserRouter } from 'react-router';
import AppLayout from './layouts/AppLayout';
import BookListPage from './pages/BookListPage';
import AddBookPage from './pages/AddBookPage';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // layout with theme switcher and outlet
    children: [
      { index: true, element: <BookListPage /> }, // default page at "/"
      { path: 'add-book', element: <AddBookPage /> },
      
    ],
  },
]);