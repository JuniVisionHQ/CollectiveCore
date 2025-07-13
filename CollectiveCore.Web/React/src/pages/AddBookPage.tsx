import React, { useState } from 'react';
import type { NewBook } from '../types/book';
import { addBook } from '../api/books';

export default function AddBookPage() {
  const [bookData, setBookData] = useState<NewBook>({
    title: '',
    author: '',
    description: '',
    genre: '',
    yearPublished: undefined,
    bookCoverImageUrl: '',
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: name === 'yearPublished' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addBook(bookData);
      alert('Book added!');
      setBookData({
        title: '',
        author: '',
        description: '',
        genre: '',
        yearPublished: undefined,
        bookCoverImageUrl: '',
      });
    } catch (error) {
      console.error('Failed to add book:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="card">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <input
          name="title"
          type="text"
          placeholder="Book Title"
          value={bookData.title}
          onChange={handleChange}
          required
        />
        <input
          name="author"
          type="text"
          placeholder="Author"
          value={bookData.author}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={bookData.description}
          onChange={handleChange}
        />
        <input
          name="genre"
          type="text"
          placeholder="Genre"
          value={bookData.genre}
          onChange={handleChange}
        />
        <input
          name="yearPublished"
          type="number"
          placeholder="Year Published"
          value={bookData.yearPublished ?? ''}
          onChange={handleChange}
        />
        <input
          name="bookCoverImageUrl"
          type="text"
          placeholder="Cover Image URL"
          value={bookData.bookCoverImageUrl}
          onChange={handleChange}
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}