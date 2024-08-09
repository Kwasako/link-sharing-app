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


interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
  }


const LandingPage: React.FC = () => {

  const router =  useRouter()

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
    const [viewProfile, setViewProfile] = useState<boolean>(false)

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

    const handleSave = () => {
        const platforms = socialLinkForms
          .filter(form => form.platform && form.url)
          .map(({ platform, url }) => ({
            platform: platformsData.find(p => p.label.toLowerCase() === platform.toLowerCase())?.label || platform,
            url
          }));
        updateSelectedPlatforms(platforms);
};

    const handleViewProfile = ()=>{
        setViewProfile(prev => !prev)
    }

    const handleProfileUpdate = (newProfileData: ProfileData) => {
        setProfileData(newProfileData);
      };

    return (
        <>
            <nav className="w-full flex justify-between items-center bg-white p-2 m-0">
                <div className="flex items-center justify-between gap-2">
                    <Image src='/solar_link-circle-bold.png' alt='solar link circle' width={40} height={40}/>
                    <Image src='/devlinks.svg' alt='solar link circle' width={135} height={26.25}/>
                </div>
                <div className="flex items center gap-4">
                    <Link href=''> 
                        <div className="px-[27px] py-[11px] flex items-center justify-center gap-2 rounded-lg hover:bg-light-purple active:bg-light-purple text-custom-purple font-bold transition-colors duration-200 cursor-pointer">
                            <FaLink size={16} className="text-custom-purple"/> 
                            <span>Links</span>
                        </div> 
                    </Link>
                    <div 
                        className=" px-[27px] flex items-center justify-center gap-1 rounded-lg hover:bg-light-purple active:bg-light-purple hover:text-custom-purple font-bold transition-colors duration-200 cursor-pointer" 
                        onClick={handleViewProfile}
                        >
                        <HiOutlineUserCircle size={16}  className="text-custom-purple" />
                        <p className="font-instrument text-xs font-normal leading-12 text-custom-gray hover:text-custom-purple">Profile Details</p>
                    </div>
                </div>
                <Link href='/landing/preview'>
                    <div 
                        className="px-[27px] py-[11px] flex items-center justify-center gap-2 rounded-lg hover:bg-light-purple active:bg-light-purple text-custom-purple border font-bold transition-colors duration-200 cursor-pointer border-custom-purple"
                        >
                        <p className="font-instrument text-xs font-normal leading-12">Preview</p>
                    </div>
                </Link>
            </nav>

            <div className="flex w-full m-0">
                <div className="w-[70%] p-16 bg-white m-2 flex-col items-center">
                    <div className="main_frame">
                    <div className="phone-frame">
                        <div className="notch"></div>
                        <div className="content">
                            <div className="profile-circle relative w-[96px] h-[96px] rounded-full overflow-hidden mx-auto my-4 bg-light-gray">
                                {imageUrl && (
                                    <Image 
                                    src={imageUrl} 
                                    alt="Profile" 
                                    layout="fill" 
                                    objectFit="cover"
                                    />
                                )}
                            </div>
                            <div className='flex flex-col items-center gap-2 p-6'>
                                <p>{profileData.firstName} {profileData.lastName} </p>
                                <p>{profileData.email}</p>
                            </div>
                            <div>
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
                                                className="block w-full mb-4"
                                            >
                                                <div 
                                                    className="flex items-center justify-between p-3 rounded-md w-[237px] text-white"
                                                    style={{ backgroundColor: platformInfo.bg }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <IconComponent size={20} />
                                                        <span>{platform.platform}</span>
                                                    </div>
                                                    <MdArrowForward size={16} />
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
                <div className='w-full bg-white m-2 p-6'>
                    {viewProfile? (<ProfileDetails 
                                    onProfileUpdate={handleProfileUpdate} 
                                    onImageUpload={handleImageUpload} 
                                    imageUrl={imageUrl}
                                    initialProfileData={profileData}
                                    />):(
                        <div className="w-full bg-white m-2 p-6 relative">
                            <h2 className="font-instrument text-3xl font-bold leading-tight text-left text-gray-800 mb-4">
                                Customize Your Links
                            </h2>
                            <p className="font-instrument text-sm font-normal leading-normal text-left text-gray-600 mb-6">
                                Add/edit/remove links below and then share your profile to the world
                            </p>
                            <Button 
                                className="w-full border bg-white border-custom-purple hover:bg-light-purple active:bg-light-purple text-custom-purple"
                                onClick={handleAddNewLink}
                                >
                                + Add new link
                            </Button>
                            <div className="w-full bg-light-gray flex flex-col items-center m-4 ml-0">
                                {socialLinkForms.length === 0 ? (
                                <div className="flex flex-col items-center m-4 ml-0">
                                    <Image src='/get_started.png' alt="get started image" width={250} height={160}/>
                                    <h2 className="font-instrument text-3xl font-bold leading-tight text-gray-800 mb-4">
                                        Let's get you started
                                    </h2>
                                    <p className="font-instrument text-sm font-normal leading-normal text-center p-20 pt-0 pb-6 text-gray-600 mb-6">
                                        Use the "add new link" button to get started.
                                        Once you have more than one link you can render and edit them.
                                        We're here to help you share your link with everyone.
                                    </p>
                                </div>
                                ) : (
                                        socialLinkForms.map(({ id, number, platform, url }) => (
                                        <div key={id} className="w-full mb-4">
                                            <div className="w-full flex justify-between items-center">
                                                <h2>= LINK #{number}</h2>
                                                <Button 
                                                    className="bg-transparent text-gray-600 hover:bg-transparent"
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
                                    ))
                                )
                                }
                            </div>
                            
                        </div>
                    )}
                    <div className="w-full m-4fixed bottom-0 left-0 right-0 bg-white p-4">
                        <hr className="w-full"/>
                        <Button 
                            className="mt-2 float-right bg-dark-purple hover:bg-dark-purple inactive:bg-light-purple"
                            onClick={handleSave}
                            >
                            Save
                        </Button>
                    </div>
                </div>
                
            </div>
        </>
            
    )
}

export default LandingPage