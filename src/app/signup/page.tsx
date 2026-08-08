'use client';

import React, { Suspense } from 'react';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF9F6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF5A36]/20 border-t-[#FF5A36] rounded-full animate-spin" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
