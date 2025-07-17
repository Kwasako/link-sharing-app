'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { db } from '@/app/data/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { platformsData } from '@/app/data/ui';
import { useParams } from 'next/navigation';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.userId as string;
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<{ platform: string; url: string }>>([]);
  const [userExists, setUserExists] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId]);

  const loadUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.profileData) {
          setProfileData(userData.profileData);
        }
        
        if (userData.imageUrl) {
          setImageUrl(userData.imageUrl);
        }
        
        if (userData.selectedPlatforms) {
          setSelectedPlatforms(userData.selectedPlatforms);
        }
        
        setUserExists(true);
      } else {
        setUserExists(false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserExists(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-dark-purple hover:underline">
            Create your own profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with purple background */}
      <div className='w-full bg-dark-purple h-60 sm:h-80 rounded-b-3xl relative'>
        <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className="flex items-center gap-2">
            <Image src='/solar_link-circle-bold.png' alt='DevLinks' width={28} height={28} className="sm:w-8 sm:h-8"/>
            <Image src='/devlinks.svg' alt='DevLinks' width={90} height={18} className="sm:w-[108px] sm:h-[21px]"/>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className='flex justify-center px-4 -mt-32 sm:-mt-40'>
        <div className='bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-12 w-full max-w-sm text-center'>
          {/* Profile Image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-6 bg-light-gray border-4 border-dark-purple">
            {imageUrl ? (
              <Image 
                src={imageUrl} 
                alt="Profile" 
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className='mb-8'>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {profileData.firstName || profileData.lastName 
                ? `${profileData.firstName} ${profileData.lastName}`.trim()
                : 'DevLinks User'
              }
            </h1>
            <p className="text-gray-600">
              {profileData.email || 'Connect with me through my links below'}
            </p>
          </div>

          {/* Social Links */}
          <div className='space-y-4'>
            {selectedPlatforms.length > 0 ? (
              selectedPlatforms.map((platform, index) => {
                const platformInfo = platformsData.find(p => p.label === platform.platform);
                if (!platformInfo) return null;

                const IconComponent = platformInfo.icon;

                return (
                  <Link 
                    key={index}
                    href={platform.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <div 
                      className="flex items-center justify-between p-4 rounded-lg text-white hover:opacity-90 transition-opacity transform hover:scale-105 duration-200"
                      style={{ backgroundColor: platformInfo.bg }}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={20} />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <MdArrowForward size={16} />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-gray-500 py-8">
                <p>No links shared yet</p>
                <p className="text-sm">This user hasn't added any social links</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Created with{' '}
              <Link href="/" className="text-dark-purple hover:underline">
                DevLinks
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;