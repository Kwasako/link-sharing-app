"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { platformsData } from '@/app/data/ui';
import { FaLink } from 'react-icons/fa';
import { IconType } from 'react-icons';

type SocialLinkFormProps = {
  initialPlatform?: string;
  initialUrl?: string;
  onUpdate: (platform: string, url: string, isValid: boolean) => void;
};

type Platform = {
  id: number;
  value: string;
  label: string;
  icon: IconType;
  bg: string;
  placeholder: string;
};

export default function SocialLinkForm({initialPlatform, initialUrl, onUpdate }: SocialLinkFormProps) {
  const [currentPlatform, setCurrentPlatform] = useState(
    initialPlatform ? platformsData.find(p => p.value === initialPlatform) || platformsData[0] : platformsData[0]
);
  const [linkInput, setLinkInput] = useState(initialUrl || '');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (url: string, platform: string) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (!urlPattern.test(url)) {
      return "Please enter a valid URL";
    }
  
    switch (platform) {
      case 'github':
        if (!url.toLowerCase().includes('github.com')) {
          return "Please enter a valid GitHub URL";
        }
        break;
      case 'twitter':
        if (!url.toLowerCase().includes('twitter.com')) {
          return "Please enter a valid Twitter URL";
        }
        break;
      case 'linkedin':
        if (!url.toLowerCase().includes('linkedin.com')) {
          return "Please enter a valid LinkedIn URL";
        }
        break;
      case 'youtube':
        if (!url.toLowerCase().includes('youtube.com') && !url.toLowerCase().includes('youtu.be')) {
          return "Please enter a valid YouTube URL";
        }
        break;
      case 'frontendMentor':
        if (!url.toLowerCase().includes('frontendmentor.io')) {
          return "Please enter a valid Frontend Mentor URL";
        }
        break;
      case 'facebook':
        if (!url.toLowerCase().includes('facebook.com')) {
          return "Please enter a valid Facebook URL";
        }
        break;
      case 'twitch':
        if (!url.toLowerCase().includes('twitch.tv')) {
          return "Please enter a valid Twitch URL";
        }
        break;
      case 'dev.to':
        if (!url.toLowerCase().includes('dev.to')) {
          return "Please enter a valid Dev.to URL";
        }
        break;
      case 'codewars':
        if (!url.toLowerCase().includes('codewars.com')) {
          return "Please enter a valid Codewars URL";
        }
        break;
      case 'codepen':
        if (!url.toLowerCase().includes('codepen.io')) {
          return "Please enter a valid CodePen URL";
        }
        break;
      case 'freeCodeCamp':
        if (!url.toLowerCase().includes('freecodecamp.org')) {
          return "Please enter a valid freeCodeCamp URL";
        }
        break;
      case 'gitlab':
        if (!url.toLowerCase().includes('gitlab.com')) {
          return "Please enter a valid GitLab URL";
        }
        break;
      case 'hashnode':
        if (!url.toLowerCase().includes('hashnode.dev') && !url.toLowerCase().includes('hashnode.com')) {
          return "Please enter a valid Hashnode URL";
        }
        break;
      case 'stackOverflow':
        if (!url.toLowerCase().includes('stackoverflow.com')) {
          return "Please enter a valid Stack Overflow URL";
        }
        break;
      default:
        break;
    }
  
    return ''; // No error
  };
  useEffect(() => {
    const validationError = validateUrl(linkInput, currentPlatform.value);
    setError(validationError);
    onUpdate(currentPlatform.value, linkInput, !validationError);
  }, [currentPlatform, linkInput, onUpdate]);

  const handlePlatformChange = (platform :Platform) => {
    setCurrentPlatform(platform);
    setIsOpen(false);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInput(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <p className="font-instrument text-sm font-normal leading-normal text-gray-600">Platform</p>

        <div 
          className="w-full p-2 border rounded flex items-center justify-between cursor-pointer bg-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <currentPlatform.icon className="mr-2" />
            {currentPlatform.label}
          </span>
          {isOpen ? (
            <FaChevronUp className="text-[#EFEBFF]" />
          ) : (
            <FaChevronDown className="text-[#EFEBFF]" />
          )}
        </div>
        {isOpen && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
            {platformsData.map((platform) => (
              <li
                key={platform.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handlePlatformChange(platform)}
              >
                <platform.icon className="mr-2" />
                {platform.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          value={linkInput} 
          onChange={handleLinkChange}
          placeholder={`e.g. ${currentPlatform.placeholder}`}
          className="w-full p-2 pl-10 border rounded"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}