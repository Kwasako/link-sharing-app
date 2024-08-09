'use client'

import React from 'react';
import { Button } from '@/components/ui/button';

const PreviewPage: React.FC = () => {
  return (
    <div className='w-full bg-dark-purple h-80 rounded-b-lg'>
      <div className='flex justify-between bg-white m-4 p-2 rounded-lg'>
        <Button className='bg-white text-dark-purple border-2 border-dark-purple hover:bg-white'>Back to editor</Button>
        <Button className='bg-dark-purple text-white hover:bg-dark-purple'>Share link</Button>
      </div>
      <div className="fixed inset-0 flex items-center justify-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-2">
          <div className="text-xl font-bold mb-4 w-28 h-28 rounded-full border-2 border-dark-purple"></div>
          <p className="mb-4">Here's your shareable link: [Your link here]</p>
          <Button>Close</Button>
        </div>
      </div>
      
    </div>
  );
};

export default PreviewPage;