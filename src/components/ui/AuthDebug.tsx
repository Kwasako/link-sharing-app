'use client'

import React, { useState, useEffect } from 'react';
import { auth } from '@/app/data/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const AuthDebug: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log('AuthDebug: Setting up auth listener');
    console.log('Auth object:', auth);
    console.log('Auth currentUser:', auth?.currentUser);
    
    if (!auth) {
      console.error('Auth is not initialized!');
      setLoading(false);
      return;
    }

    setAuthInitialized(true);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('AuthDebug: Auth state changed:', user);
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      console.log('AuthDebug: Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Auth Debug Info:</h3>
      <div className="space-y-1">
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Auth Initialized: {authInitialized ? 'Yes' : 'No'}</p>
        <p>Current User: {currentUser ? 'Logged In' : 'Not Logged In'}</p>
        {currentUser && (
          <>
            <p>User ID: {currentUser.uid}</p>
            <p>Email: {currentUser.email}</p>
          </>
        )}
        <p>Auth Object: {auth ? 'Available' : 'Not Available'}</p>
        <p>Direct Auth User: {auth?.currentUser ? 'Available' : 'Not Available'}</p>
        {!currentUser && (
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            Go to Login Page
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;