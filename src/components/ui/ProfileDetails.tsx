import React, { useState } from 'react';
import ImageUploader from "./ImageUploader";

interface ProfileDetailsProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ProfileDetails({ onImageUpload }: ProfileDetailsProps) {
  const handleImageUpload = (imageUrl: string) => {
    onImageUpload(imageUrl);
  };

  return (
    <div className="flex flex-col">
      <h2 className="font-instrument text-3xl font-bold leading-tight text-left text-gray-800 mb-4">Profile Details</h2>
      <p className="font-instrument text-sm font-normal leading-normal text-left text-gray-600 mb-6">
        Add your details to create personal touch to your profile
      </p>
      <div className="bg-light-gray w-full flex p-6 items-center justify-around gap-2">
        <p className="font-instrument text-sm font-normal leading-normal text-left text-gray-600 mb-6">
          Profile picture
        </p>
        <ImageUploader onImageUpload={handleImageUpload} />
        <p className="font-instrument text-xs font-normal leading-normal text-left text-gray-600 mb-6">
          image must be below 1024x1024px use PNG or JPEG format
        </p>
      </div>
    </div>
  );
}