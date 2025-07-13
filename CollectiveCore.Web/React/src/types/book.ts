export interface Book {
  id: number;
  title: string;
  author: string;
  description?: string;
  genre?: string;
  yearPublished?: number;
  bookCoverImageUrl?: string;
}

export type NewBook = Omit<Book, 'id'>;