// components/ImageUploader.tsx
import React, { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { FaImage, FaCamera } from 'react-icons/fa';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  initialImageUrl?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, initialImageUrl = null }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const newImageUrl = e.target?.result as string;
        setImageUrl(newImageUrl);
        onImageUpload(newImageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-[193px] h-[193px] bg-light-purple flex flex-col items-center justify-center gap-2 relative group rounded-lg">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageUpload} 
        className="hidden" 
        id="imageUpload" 
      />
      <label htmlFor="imageUpload" className="cursor-pointer flex items-center w-full h-full">
        {imageUrl ? (
          <>
            <Image src={imageUrl} alt="Uploaded" layout="fill" objectFit="cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaImage className="text-white text-3xl"/>
              <p className="text-white">change image</p>
            </div>
          </>
        ) : (
          <div className='text-center flex flex-col items-center justify-center'>
            <FaImage className="text-dark-purple text-3xl"/>
            <p className="text-dark-purple">+ Upload image</p>
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;