'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticatorPage() {
  const router = useRouter();

  useEffect(() => {
    const rawUserData = localStorage.getItem('luxury_user');

    // If no user object exists at all, reject immediately to login
    if (!rawUserData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(rawUserData);

      // Verify user has a valid, non-empty name string
      if (user && user.name && user.name.trim() !== "") {
        router.push('/pos');
      } else {
        // If the user's name is completely empty (""), bounce back to login
        localStorage.removeItem('luxury_user');
        router.push('/login');
      }
    } catch (error) {
      console.error("Session verification failure:", error);
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121419] text-white">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-100">Verifying Workspace Session...</h2>
      <p className="text-sm text-gray-400 mt-1">Checking secure profile configurations.</p>
    </div>
  );
}