import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChooseMascotScreen from './ChooseMascotScreen';
import OnboardingSummaryScreen from './OnboardingSummaryScreen';

const OnboardingFlow = () => {
  const [step, setStep] = useState('welcome'); // welcome, choose, summary

  const handleNext = () => {
    if (step === 'welcome') setStep('choose');
    else if (step === 'choose') setStep('summary');
  };

  // We could add animation wrapper here
  return (
    <div className="w-full h-full absolute inset-0 bg-white">
      {step === 'welcome' && <WelcomeScreen onNext={handleNext} />}
      {step === 'choose' && <ChooseMascotScreen onNext={handleNext} />}
      {step === 'summary' && <OnboardingSummaryScreen />}
    </div>
  );
};

export default OnboardingFlow;
