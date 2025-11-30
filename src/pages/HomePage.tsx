// src/pages/HomePage.tsx
import React from 'react';
import CheckInScreen from '@/features/checkin/CheckInScreen';
import CloudBackground from '@/components/ui/CloudBackground';
import { useUserProgress } from '@/context/UserProgressContext';

const HomePage = () => {
    const { lastCompletedDay } = useUserProgress();

    return (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 z-0">
             <CloudBackground />
             <div className="relative z-10 h-full pt-14 sm:pt-16 pb-20">
                <CheckInScreen currentDay={lastCompletedDay + 1} />
             </div>
        </div>
    );
};

export default HomePage;
