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
    <div className="flex flex-col">
      <h2 className="font-instrument text-3xl font-bold leading-tight text-left text-gray-800 mb-4">Profile Details</h2>
      <p className="font-instrument text-sm font-normal leading-normal text-left text-gray-600 mb-6">
        Add your details to create personal touch to your profile
      </p>
      <div className="bg-light-gray w-full flex p-6 items-center justify-between gap-2">
        <p className="font-instrument text-sm font-normal leading-normal text-left text-gray-600">
          Profile picture
        </p>
        <ImageUploader onImageUpload={onImageUpload} initialImageUrl={imageUrl} />
        <p className="text-center font-instrument text-xs font-normal leading-normal text-gray-600">
          Image must be below 1024x1024px. Use PNG or JPEG format.
        </p>
      </div>
      <div className='bg-light-gray w-full p-6 m-4 ml-0 flex flex-col gap-2'>
        <div className='flex items-center'>
          <label className="font-instrument text-sm font-normal leading-normal text-gray-600 w-24 mr-2">First name*</label>
          <Input 
            name="firstName"
            value={profileData.firstName}
            onChange={handleInputChange}
            placeholder='e.g John'
            className="flex-grow"
          />
        </div>
        <div className='flex items-center'>
          <label className="font-instrument text-sm font-normal leading-normal text-gray-600 w-24 mr-2">Last name*</label>
          <Input 
            name="lastName"
            value={profileData.lastName}
            onChange={handleInputChange}
            placeholder='e.g Doe'
            className="flex-grow"
          />
        </div>
        <div className='flex items-center'>
          <label className="font-instrument text-sm font-normal leading-normal text-gray-600 w-24 mr-2">email*</label>
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