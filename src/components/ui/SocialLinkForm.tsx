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
        <label className="block text-sm text-gray-600 mb-2">Platform</label>
        <div 
          className="w-full p-3 border rounded-lg flex items-center justify-between cursor-pointer bg-white hover:border-custom-purple transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            <currentPlatform.icon className="mr-2 text-gray-600" size={18} />
            <span className="text-gray-800">{currentPlatform.label}</span>
          </span>
          {isOpen ? (
            <FaChevronUp className="text-custom-purple" size={14} />
          ) : (
            <FaChevronDown className="text-custom-purple" size={14} />
          )}
        </div>
        {isOpen && (
          <ul className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            {platformsData.map((platform) => (
              <li
                key={platform.id}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => handlePlatformChange(platform)}
              >
                <platform.icon className="mr-3 text-gray-600" size={18} />
                <span className="text-gray-800">{platform.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm text-gray-600 mb-2">Link</label>
        <div className="relative">
          <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            value={linkInput} 
            onChange={handleLinkChange}
            placeholder={`e.g. ${currentPlatform.placeholder}`}
            className="w-full p-3 pl-10 border rounded-lg focus:border-custom-purple focus:outline-none transition-colors"
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}