'use client';
import { AuthProvider } from '@/components/context/AuthContext';
import LoginContent from './LoginContent'; // This will now work correctly

export default function LuxuryAdminLogin() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}