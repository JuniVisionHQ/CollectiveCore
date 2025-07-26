export interface UserBook {
  userId: number;
  bookId: number;
  title: string;
  author: string;
  bookCoverImageFileName?: string; // populated only if there's an uploaded image
  isFavorite: boolean;
  hasRead: boolean;
}