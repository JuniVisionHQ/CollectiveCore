import type { NewBook } from '../types/book';

export function createBookFormData(book: NewBook, imageFile?: File): FormData {
  const formData = new FormData();

  // Append all book fields to formData, but skip undefined or empty string
  Object.entries(book).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' // still skip empty strings
    ) {
      const safeValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      formData.append(key, safeValue);
    }
  });

  // If imageFile is provided, append it to formData with key 'imageFile'
  if (imageFile) {
    formData.append('imageFile', imageFile);
  }

  return formData;
}