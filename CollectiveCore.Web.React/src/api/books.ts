import axios from 'axios';
import type { Book, NewBook } from '../types/book';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllBooks(): Promise<Book[]> {
  try {
    const booksResponse = await axios.get<Book[]>(`${API_BASE_URL}/books`);
    return booksResponse.data; // array of books
  } catch (error) {
    console.error('Failed to fetch books:', error);
    throw error;
  }
}

export async function addBook(formData: FormData): Promise<Book> {
  try {
    const addedBook = await axios.post<Book>(`${API_BASE_URL}/books`, formData);
    return addedBook.data;
  } catch (error) {
    console.error('Failed to add book:', error);
    throw error;
  }
}