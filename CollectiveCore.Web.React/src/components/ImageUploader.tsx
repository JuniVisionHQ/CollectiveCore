import React, { useState } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file?: File) => void;
  initialFileName?: string;
}

export default function ImageUploader({ onFileSelect, initialFileName }: ImageUploaderProps) {
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState(initialFileName || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) {
    onFileSelect(undefined);
    setFileName('');
    setError('');
    return;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 0.5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    setError('Only JPG, PNG, or WEBP images are allowed.');
    onFileSelect(undefined);
    return;
  }

  if (file.size > maxSize) {
    setError('File size must be under 500 KB.');
    onFileSelect(undefined);
    return;
  }

  setError('');
  setFileName(file.name);
  onFileSelect(file);
};

  return (
    <div className="flex items-center gap-2 mt-4">
      <label 
        htmlFor="imageFile" 
        className="upload-cover-image-label cursor-pointer">
        Choose Book Cover Image
      </label>

      <input
        id="imageFile"
        name="imageFile"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      {fileName && <p> Selected file: {fileName}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}