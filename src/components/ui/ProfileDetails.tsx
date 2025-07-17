// components/ProfileDetails.tsx
"use client";
import React, { useState, ChangeEvent } from 'react';
import ImageUploader from "./ImageUploader";
import { Input } from './input';

interface ProfileDetailsProps {
  onImageUpload: (imageUrl: string) => void;
  onProfileUpdate: (profileData: ProfileData) => void;
  imageUrl: string | null;
  initialProfileData?: ProfileData;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfileDetails({ onImageUpload, onProfileUpdate, imageUrl, initialProfileData }: ProfileDetailsProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData || {
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
    onProfileUpdate({
      ...profileData,
      [name]: value
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Profile Details</h2>
      <p className="text-sm text-gray-600 mb-6">
        Add your details to create personal touch to your profile
      </p>
      
      {/* Profile Picture Section */}
      <div className="bg-light-gray w-full rounded-lg p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <p className="text-sm text-gray-600 sm:w-32 flex-shrink-0">
            Profile picture
          </p>
          <div className="flex-shrink-0">
            <ImageUploader onImageUpload={onImageUpload} initialImageUrl={imageUrl} />
          </div>
          <p className="text-xs text-gray-600 text-center sm:text-left">
            Image must be below 1024x1024px. Use PNG or JPEG format.
          </p>
        </div>
      </div>
      
      {/* Form Fields */}
      <div className='bg-light-gray w-full rounded-lg p-4 sm:p-6 space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">First name*</label>
          <Input 
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            placeholder='e.g John'
            className="flex-grow"
          />
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">Last name*</label>
          <Input 
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            placeholder='e.g Doe'
            className="flex-grow"
          />
        </div>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
          <label className="text-sm text-gray-600 sm:w-24 flex-shrink-0">Email*</label>
          <Input 
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            placeholder='e.g johndoe@example.com'
            className="flex-grow"
          />
        </div>
      </div>
    </div>
  );
}