import React, { memo } from 'react';
import { Cloud } from 'lucide-react';

const CloudBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[5%] left-[10%] text-white/40 animate-pulse delay-700 gpu-accelerate"><Cloud size={80} fill="currentColor" /></div>
    <div className="absolute top-[30%] right-[15%] text-white/30 animate-pulse delay-1000 gpu-accelerate"><Cloud size={60} fill="currentColor" /></div>
    <div className="absolute top-[60%] left-[5%] text-white/20 animate-pulse gpu-accelerate"><Cloud size={100} fill="currentColor" /></div>
    <div className="absolute bottom-[10%] right-[10%] text-white/10 gpu-accelerate"><Cloud size={120} fill="currentColor" /></div>
  </div>
));

CloudBackground.displayName = 'CloudBackground';

export default CloudBackground;
