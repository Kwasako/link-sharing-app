'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/ui/loginForm";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

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
    <main className="flex min-h-screen flex-col items-center justify-between"> 
      <div className="flex items-center justify-between gap-5 mb-10">
        <Image src='/solar_link-circle-bold.png' alt='solar link circle' width={40} height={40}/>
        <Image src='/devlinks.svg' alt='solar link circle' width={135} height={26.25}/>
      </div>
      <div className="loginForm_div">
        <h2 className="font-instrument text-32 font-bold leading-48 text-left text-dark-gray">Create account</h2>
        <p className="font-instrument text-base font-normal leading-6 text-left text-custom-gray">Let's get you started sharing your links!</p>
        <LoginForm />
      </div>
    </main> 
  );
}