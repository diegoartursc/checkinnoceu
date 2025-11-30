// src/features/story/StoryOverlay.tsx
import React, { memo, useState, useMemo, useCallback } from 'react';
import { BookOpen, ArrowRight, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';

interface StorySlide {
    text: string;
    icon: any;
}

interface Story {
    id: string;
    title: string;
    slides: StorySlide[];
}

interface StoryOverlayProps {
    story: Story;
    onClose: () => void;
}

const StoryOverlay = memo(({ story, onClose }: StoryOverlayProps) => {
    const [slideIndex, setSlideIndex] = useState(0);
    const slides = useMemo(() => story.slides || [{ text: "Erro", icon: BookOpen }], [story.slides]);
    const totalSlides = slides.length;
    const CurrentIcon = slides[slideIndex].icon;

    const handleNext = useCallback(() => {
        if (slideIndex < totalSlides - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            onClose();
        }
    }, [slideIndex, totalSlides, onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-700"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,0,0.3)] border-4 border-yellow-400 relative flex flex-col h-[500px] sm:h-[550px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-48 sm:h-56 bg-gradient-to-b from-sky-100 to-white flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-yellow-400/10 rotate-12 scale-150 transform origin-bottom-left"></div>
                    <div key={slideIndex} className="relative z-10 transition-all duration-700 transform animate-in zoom-in slide-in-from-bottom-10">
                        <CurrentIcon size={80} className="text-yellow-600 drop-shadow-lg sm:w-24 sm:h-24" strokeWidth={1.5} />
                    </div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col items-center text-center bg-white relative">
                    <h3 className="font-black text-xl sm:text-2xl text-gray-800 mb-1">{story.title}</h3>
                    <div className="flex-1 flex items-center">
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-500" key={`txt-${slideIndex}`}>
                            "{slides[slideIndex].text}"
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-6 w-full">
                        <Button onClick={handleNext} color="bg-yellow-500 w-full shadow-yellow-700 text-base sm:text-lg py-3 sm:py-4">
                            {slideIndex < totalSlides - 1 ? (
                                <span className="flex items-center gap-2">Continuar <ArrowRight size={20}/></span>
                            ) : (
                                <span className="flex items-center gap-2">Amém! <Heart fill="white" size={20}/></span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

StoryOverlay.displayName = 'StoryOverlay';

export default StoryOverlay;
