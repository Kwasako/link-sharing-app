'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/ui/loginForm";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/data/firebase";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        router.push("/landing");
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // This will likely never render as we're redirecting in useEffect
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"> 
      <div className="flex items-center gap-3 mb-8">
        <Image src='/solar_link-circle-bold.png' alt='DevLinks logo' width={32} height={32} className="sm:w-10 sm:h-10"/>
        <Image src='/devlinks.svg' alt='DevLinks' width={108} height={21} className="sm:w-[135px] sm:h-[26px]"/>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Create account</h2>
        <p className="text-gray-600 mb-6">Let's get you started sharing your links!</p>
        <LoginForm />
      </div>
    </main> 
  );
}