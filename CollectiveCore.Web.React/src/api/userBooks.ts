import axios from 'axios';
import type { UserBook } from '../types/userBook';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getBooksByUser(userId: number): Promise<UserBook[]> {
  try {
    const response = await axios.get<UserBook[]>(`${API_BASE_URL}/userbooks/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user books:', error);
    throw error;
  }
}