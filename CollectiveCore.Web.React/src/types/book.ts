export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  genre?: string;
  yearPublished?: number;
  bookCoverImageFileName?: string; // populated only if there's an uploaded image
}

export type NewBook = Omit<Book, 'id'>;