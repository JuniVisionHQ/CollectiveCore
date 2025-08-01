import axios from 'axios';
import type { UserBook } from '../types/userBook';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// For getting another user's books (admin/public view)
export async function getBooksByUser(userId: number): Promise<UserBook[]> {
  try {
    const response = await axios.get<UserBook[]>(`${API_BASE_URL}/userbooks/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user books:', error);
    throw error;
  }
}

// For current authenticated user - using /me pattern
export async function getCurrentUserBooks(token: string): Promise<UserBook[]> {
  try {
  const response = await axios.get<UserBook[]>(`${API_BASE_URL}/userbooks/me`, {
    headers: { 
      Authorization: `Bearer ${token}` 
    },
  });
  return response.data;
}catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      if (error.response?.status === 404) {
        // User has no books yet, return empty array
        return [];
      }
    }
    console.error('Failed to fetch current user books:', error);
    throw error;
  }
}

// Add book to current user's collection - using /me pattern
export async function addBookToUser(token: string, bookId: number): Promise<UserBook> {
  try {
    const response = await axios.post<UserBook>(`${API_BASE_URL}/userbooks/me`, {
      bookId,
      isFavorite: false,
      hasRead: false
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        throw new Error('Book already in your collection');
      }
    }
    console.error('Failed to add book to user collection:', error);
    throw error;
  }
}

// Update user book status - using /me pattern
export async function updateUserBook(
  token: string, 
  bookId: number, 
  updates: { isFavorite?: boolean; hasRead?: boolean }
): Promise<UserBook> {
  try {
    const response = await axios.put<UserBook>(`${API_BASE_URL}/userbooks/me/${bookId}`, 
      updates, // Just send the updates, backend knows the user from token
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update user book:', error);
    throw error;
  }
}

// Remove book from current user's collection
export async function removeBookFromUser(token: string, bookId: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/userbooks/me/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Failed to remove book from user collection:', error);
    throw error;
  }
}