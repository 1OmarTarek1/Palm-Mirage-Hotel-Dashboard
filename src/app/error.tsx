'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="bg-white dark:bg-[#1F2937] p-8 md:p-12 rounded-3xl border border-[#E5E7EB] dark:border-[#374151] shadow-sm max-w-lg w-full transition-colors duration-300">
        
      
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

       
        <h2 className="text-2xl font-bold text-[#111827] dark:text-[#F8F9FA] mb-3 tracking-tight">
          Oops! Something went wrong
        </h2>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8 leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred in the system. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gradient-to-br from-[#C6A969] to-[#B89555] text-white hover:from-[#B89555] hover:to-[#A6813F] border-none px-8 py-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] text-base font-semibold"
          >
            Try Again
          </Button>

          <Button
            onClick={() => router.push('/')} 
            variant="outline" 
            className="w-full sm:w-auto border-[#E5E7EB] dark:border-[#374151] text-[#4B5563] dark:text-[#D1D5DB] hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-6 rounded-xl transition-all duration-300 text-base font-semibold"
          >
            Back to Home
          </Button>

        </div>
        
      </div>
    </div>
  );
}