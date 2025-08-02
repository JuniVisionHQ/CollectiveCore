import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { NewBook } from '../types/book';
import { createBookFormData } from '../utils/formDataHelpers';
import { addBook } from '../api/books';
import { addBookToUser } from '../api/userBooks';
import ImageUploader from '../components/ImageUploader';

type BookFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    onBookAdded?: () => void;
};

export default function BookFormModal({ isOpen, onClose, mode, onBookAdded }: BookFormModalProps) {
    // Pass existing book data as props in the future for "edit" mode
    // For now it resets on close/open
    const [bookData, setBookData] = useState<NewBook>({
        title: '',
        author: '',
        description: '',
        genre: '',
        yearPublished: undefined,
    });

    const [imageFile, setImageFile] = useState<File | undefined>(undefined);

    // Auth0 hook to get token
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setBookData({
                title: '',
                author: '',
                description: '',
                genre: '',
                yearPublished: undefined,
            });
            setImageFile(undefined);
        }
    }, [isOpen]);

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
            //Create book
            const formData = createBookFormData(bookData, imageFile); // Combine data + image
            const newBook = await addBook(formData);

            // If logged in, attach it to the user
            if (isAuthenticated) {
                const token = await getAccessTokenSilently();
                await addBookToUser(token, newBook.id); // attach new book
            }

            alert('Book added!');
            if (onBookAdded) onBookAdded();
            onClose(); // Close modal on success
        } catch (error) {
            console.error('Failed to add book:', error);
            alert('Something went wrong while adding the book.');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={onClose} // close popup if user clicks outside modal
        >
            <div
                className="bg-card-bg rounded-lg shadow-card p-6 w-[700px]"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
                <form onSubmit={handleSubmit} className="add-book-form">
                    {/* Modal header with close button */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold">
                            {mode === 'create' ? 'Add New Book' : 'Edit Book'}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="font-bold text-xl"
                        >
                            ×
                        </button>
                    </div>
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

                    <ImageUploader
                        onFileSelect={setImageFile}
                        initialFileName={imageFile?.name}
                    />

                    <button type="submit" className="theme-button mt-2">
                        {mode === 'create' ? 'Add Book' : 'Update Book'}
                    </button>
                </form>
            </div>
        </div>
    );
}