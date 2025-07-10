import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getAllBooks() {
  try {
    const booksResponse = await axios.get(`${API_BASE_URL}/books`);
    return booksResponse.data; // array of books
  } catch (error) {
    console.error('Failed to fetch books:', error);
    throw error;
  }
}