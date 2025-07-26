import axios from 'axios';
import type { User } from '../types/user';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUserById(id: number): Promise<User> {
  try {
    const userResponse = await axios.get<User>(`${API_BASE_URL}/users/${id}`);
    return userResponse.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}