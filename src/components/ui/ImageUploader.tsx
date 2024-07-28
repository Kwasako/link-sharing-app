// components/ImageUploader.tsx
import React, { ChangeEvent } from 'react';
import { FaImage } from 'react-icons/fa';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[193px] h-[193px] bg-light-purple flex flex-col items-center justify-center gap-2">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        className="hidden" 
        id="imageUpload" 
      />
      <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
        <FaImage className="text-dark-purple text-3xl"/>
        <p className="text-dark-purple">+ Upload image</p>
      </label>
    </div>
  );
};

export default ImageUploader;