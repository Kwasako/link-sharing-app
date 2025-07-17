"use client";
import { useRouter } from 'next/navigation';
import { useLink } from './LinkContext';
import React, { useState, useEffect } from "react";
import Image from "next/image"
import Link from "next/link"
import { FaLink } from 'react-icons/fa';
import { HiOutlineUserCircle } from "react-icons/hi";
import { Button } from "./button";
import { FaGithub } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import SocialLinkForm from "./SocialLinkForm";
import { platformsData } from '@/app/data/ui';
import ProfileDetails from './ProfileDetails';
import ImageUploader from './ImageUploader';
import { auth, db } from '@/app/data/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useToast } from './toast';
import { HiMenu, HiX } from 'react-icons/hi';


interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
  }


const LandingPage: React.FC = () => {

  const router =  useRouter()
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: ''
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
    };

    const { selectedPlatforms, updateSelectedPlatforms } = useLink();
    const [socialLinkForms, setSocialLinkForms] = useState<Array<{ id: number, number: number, platform: string, url: string, isValid: boolean }>>([]);
    const [addedLinks, setAddedLinks] = useState<any[]>([]);
    const [viewProfile, setViewProfile] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    // Auth state management
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                loadUserData(user.uid);
            } else {
                // If no user is logged in, redirect to login page
                router.push('/');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    // Load user data from Firestore
    const loadUserData = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                
                // Load profile data
                if (userData.profileData) {
                    setProfileData(userData.profileData);
                }
                
                // Load image URL
                if (userData.imageUrl) {
                    setImageUrl(userData.imageUrl);
                }
                
                // Load social links
                if (userData.socialLinks) {
                    setSocialLinkForms(userData.socialLinks);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    };

    // Save user data to Firestore
    const saveUserData = async () => {
        // Use currentUser state or fallback to auth.currentUser
        const user = currentUser || auth.currentUser;
        
        if (!user) {
            showToast('Please log in to save your data', 'error');
            return;
        }
        
        setSaving(true);
        try {
            await setDoc(doc(db, 'users', user.uid), {
                profileData,
                imageUrl,
                socialLinks: socialLinkForms,
                selectedPlatforms,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            
            showToast('Your changes have been saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving user data:', error);
            showToast('Failed to save your changes. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const validPlatforms = socialLinkForms
            .filter(form => form.isValid && form.platform && form.url)
            .map(({ platform, url }) => ({
                platform: platformsData.find(p => p.value.toLowerCase() === platform.toLowerCase())?.label || platform,
                url
            }));
        updateSelectedPlatforms(validPlatforms);
    }, [socialLinkForms, updateSelectedPlatforms]);

    const handleAddNewLink = () => {
        setSocialLinkForms(prev => [...prev, { id: Date.now(), number: prev.length + 1, platform: '', url: '', isValid:false }]);
    };

    const handleRemoveLink = (idToRemove: number) => {
        setSocialLinkForms(prev => {
            const updatedForms = prev.filter(form => form.id !== idToRemove);
            return updatedForms.map((form, index) => ({ ...form, number: index + 1 }));
        });
    
        // Remove the link from selectedPlatforms
        const updatedSelectedPlatforms = selectedPlatforms.filter(platform => 
            !socialLinkForms.find(form => 
                form.id === idToRemove && form.platform === platform.platform
            )
        );
        updateSelectedPlatforms(updatedSelectedPlatforms);
    };

    const handleSocialLinkUpdate = (id: number, platform: string, url: string, isValid: boolean) => {
        setSocialLinkForms(prev => prev.map(form => 
          form.id === id ? { ...form, platform, url, isValid } : form
        ));
      };

    const handleSave = async () => {
        const platforms = socialLinkForms
          .filter(form => form.platform && form.url)
          .map(({ platform, url }) => ({
            platform: platformsData.find(p => p.label.toLowerCase() === platform.toLowerCase())?.label || platform,
            url
          }));
        updateSelectedPlatforms(platforms);
        
        // Save to Firestore
        await saveUserData();
    };

    const handleViewProfile = ()=>{
        setViewProfile(prev => !prev)
    }

    const handleProfileUpdate = (newProfileData: ProfileData) => {
        setProfileData(newProfileData);
        // Auto-save profile data when it changes
        setTimeout(() => {
            saveUserData();
        }, 500); // Debounce to avoid too many saves
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            showToast('You have been logged out successfully', 'success');
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
            showToast('Error signing out. Please try again.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-purple mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // If not loading and no user, redirect to login
    if (!loading && !currentUser) {
        router.push('/');
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <nav className="w-full bg-white shadow-sm">
                <div className="flex justify-between items-center p-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <Image src='/solar_link-circle-bold.png' alt='solar link circle' width={32} height={32} className="sm:w-10 sm:h-10"/>
                        <Image src='/devlinks.svg' alt='devlinks logo' width={108} height={21} className="sm:w-[135px] sm:h-[26px]"/>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <div className="px-4 py-2 lg:px-[27px] lg:py-[11px] flex items-center justify-center gap-2 rounded-lg hover:bg-light-purple active:bg-light-purple text-custom-purple font-bold transition-colors duration-200 cursor-pointer">
                            <FaLink size={16} className="text-custom-purple"/> 
                            <span className="hidden lg:inline">Links</span>
                        </div>
                        <div 
                            className="px-4 py-2 lg:px-[27px] lg:py-[11px] flex items-center justify-center gap-1 rounded-lg hover:bg-light-purple active:bg-light-purple hover:text-custom-purple font-bold transition-colors duration-200 cursor-pointer" 
                            onClick={handleViewProfile}
                        >
                            <HiOutlineUserCircle size={16} className="text-custom-purple" />
                            <p className="hidden lg:inline font-instrument text-xs font-normal leading-12 text-custom-gray hover:text-custom-purple">Profile Details</p>
                        </div>
                    </div>
                    
                    {/* Desktop Action Buttons */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button 
                            onClick={() => {
                                console.log('Preview button clicked');
                                window.location.href = '/landing/preview';
                            }}
                            className="px-4 py-2 lg:px-[27px] lg:py-[11px] bg-transparent hover:bg-light-purple text-custom-purple border border-custom-purple text-sm"
                        >
                            Preview
                        </Button>
                        <Button 
                            onClick={handleLogout}
                            className="px-4 py-2 lg:px-[27px] lg:py-[11px] bg-red-500 hover:bg-red-600 text-white text-sm"
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="sm:hidden border-t border-gray-200 bg-white">
                        <div className="p-4 space-y-3">
                            <div 
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-light-purple text-custom-purple cursor-pointer"
                                onClick={() => {
                                    setViewProfile(false);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <FaLink size={16} className="text-custom-purple"/> 
                                <span>Links</span>
                            </div>
                            <div 
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-light-purple text-custom-purple cursor-pointer"
                                onClick={() => {
                                    handleViewProfile();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <HiOutlineUserCircle size={16} className="text-custom-purple" />
                                <span>Profile Details</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 space-y-2">
                                <Button 
                                    onClick={() => {
                                        window.location.href = '/landing/preview';
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-transparent hover:bg-light-purple text-custom-purple border border-custom-purple"
                                >
                                    Preview
                                </Button>
                                <Button 
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <div className="flex flex-col lg:flex-row w-full gap-4 p-4 bg-gray-50 min-h-screen">
                {/* Phone Preview - Hidden on mobile, shown on larger screens */}
                <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 bg-white rounded-lg p-8 items-center justify-center">
                    <div className="main_frame">
                        <div className="phone-frame">
                            <div className="notch"></div>
                            <div className="content">
                                <div className="profile-circle relative w-[96px] h-[96px] rounded-full overflow-hidden mx-auto my-4 bg-light-gray">
                                    {imageUrl && (
                                        <Image 
                                        src={imageUrl} 
                                        alt="Profile" 
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        />
                                    )}
                                </div>
                                <div className='flex flex-col items-center gap-2 p-6'>
                                    <p className="font-semibold text-gray-800">{profileData.firstName} {profileData.lastName}</p>
                                    <p className="text-gray-600 text-sm">{profileData.email}</p>
                                </div>
                                <div className="px-4">
                                    {selectedPlatforms.map((platform, index) => {
                                            const platformInfo = platformsData.find(p => p.label === platform.platform);
                                            if (!platformInfo) return null;

                                            const IconComponent = platformInfo.icon;

                                            return (
                                                <Link 
                                                    key={index}
                                                    href={platform.url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block w-full mb-3"
                                                >
                                                    <div 
                                                        className="flex items-center justify-between p-3 rounded-md text-white text-sm"
                                                        style={{ backgroundColor: platformInfo.bg }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <IconComponent size={16} />
                                                            <span>{platform.platform}</span>
                                                        </div>
                                                        <MdArrowForward size={14} />
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Area */}
                <div className='flex-1 bg-white rounded-lg p-4 sm:p-6'>
                    {viewProfile ? (
                        <ProfileDetails 
                            onProfileUpdate={handleProfileUpdate} 
                            onImageUpload={handleImageUpload} 
                            imageUrl={imageUrl}
                            initialProfileData={profileData}
                        />
                    ) : (
                        <div className="w-full">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                                Customize Your Links
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Add/edit/remove links below and then share your profile to the world
                            </p>
                            <Button 
                                className="w-full mb-6 border bg-white border-custom-purple hover:bg-light-purple active:bg-light-purple text-custom-purple py-3"
                                onClick={handleAddNewLink}
                            >
                                + Add new link
                            </Button>
                            
                            <div className="w-full">
                                {socialLinkForms.length === 0 ? (
                                    <div className="flex flex-col items-center bg-light-gray rounded-lg p-8 sm:p-12">
                                        <Image 
                                            src='/get_started.png' 
                                            alt="get started image" 
                                            width={200} 
                                            height={128}
                                            className="sm:w-[250px] sm:h-[160px]"
                                        />
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 text-center">
                                            Let's get you started
                                        </h2>
                                        <p className="text-sm text-gray-600 text-center max-w-md">
                                            Use the "add new link" button to get started.
                                            Once you have more than one link you can render and edit them.
                                            We're here to help you share your link with everyone.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {socialLinkForms.map(({ id, number, platform, url }) => (
                                            <div key={id} className="bg-light-gray rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-sm font-semibold text-gray-700">= LINK #{number}</h3>
                                                    <Button 
                                                        className="bg-transparent text-gray-600 hover:bg-transparent text-sm px-2 py-1"
                                                        onClick={() => handleRemoveLink(id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                                <SocialLinkForm 
                                                    initialPlatform={platform}
                                                    initialUrl={url}
                                                    onUpdate={(platform, url, isValid) => handleSocialLinkUpdate(id, platform, url, isValid)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Save Button - Fixed at bottom on mobile, inline on desktop */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <div className="flex justify-end">
                            <Button 
                                className="w-full sm:w-auto bg-dark-purple hover:bg-dark-purple text-white px-8 py-3"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
            
    )
}

export default LandingPage