'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { auth, db } from '@/app/data/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { platformsData } from '@/app/data/ui';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

const PreviewPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<{ platform: string; url: string }>>([]);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Preview page: Starting to load data');
        
        // Wait a bit for auth to initialize if needed
        let currentUser = auth.currentUser;
        let attempts = 0;
        
        // Try to get the current user, with a few retries if needed
        while (!currentUser && attempts < 20) {
          console.log(`Preview page: Attempt ${attempts + 1} to get current user`);
          await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms
          currentUser = auth.currentUser;
          attempts++;
        }
        
        if (!currentUser) {
          console.log('Preview page: No user found after retries, redirecting to home');
          router.push('/');
          return;
        }

        console.log('Preview page: User found, loading data for:', currentUser.uid);
        
        // Load user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('Preview page: User data loaded:', userData);
          
          if (userData.profileData) {
            setProfileData(userData.profileData);
          }
          
          if (userData.imageUrl) {
            setImageUrl(userData.imageUrl);
          }
          
          if (userData.selectedPlatforms) {
            setSelectedPlatforms(userData.selectedPlatforms);
          }
        } else {
          console.log('Preview page: No user document found in Firestore');
        }
      } catch (error) {
        console.error('Preview page: Error loading data:', error);
      } finally {
        console.log('Preview page: Finished loading, setting loading to false');
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleBackToEditor = () => {
    router.push('/landing');
  };

  const handleShareLink = () => {
    setShowShareDialog(true);
  };

  const copyToClipboard = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const shareUrl = `${window.location.origin}/profile/${currentUser.uid}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Failed to copy link. Please copy manually: ' + shareUrl);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-purple mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header with purple background */}
      <div className='w-full bg-dark-purple h-60 sm:h-80 rounded-b-3xl relative'>
        <div className='flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 gap-4'>
          <Button 
            className='w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-dark-purple px-4 py-2'
            onClick={handleBackToEditor}
          >
            Back to Editor
          </Button>
          <Button 
            className='w-full sm:w-auto bg-white text-dark-purple hover:bg-gray-100 px-4 py-2'
            onClick={handleShareLink}
          >
            Share Link
          </Button>
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
                : 'Your Name'
              }
            </h1>
            <p className="text-gray-600">
              {profileData.email || 'your.email@example.com'}
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
                      className="flex items-center justify-between p-4 rounded-lg text-white hover:opacity-90 transition-opacity"
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
                <p>No links added yet</p>
                <p className="text-sm">Go back to editor to add your social links</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Share your profile</h3>
            <p className="text-gray-600 mb-4">
              Copy the link below to share your profile with others:
            </p>
            <div className="bg-gray-100 p-3 rounded border mb-4 break-all text-sm">
              {`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${auth.currentUser?.uid}`}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={copyToClipboard}
                className="flex-1 bg-dark-purple hover:bg-dark-purple text-white"
              >
                Copy Link
              </Button>
              <Button 
                onClick={() => setShowShareDialog(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;