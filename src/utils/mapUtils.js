// Calculate sinuous path position (Match-3 style)
export const calculatePathPosition = (dayIndex) => {
    // Vertical spacing between days
    const verticalSpacing = 55;
    const top = dayIndex * verticalSpacing;

    // S-curve using sine wave
    // Frequency: completes wave every ~12 days
    const waveFrequency = (Math.PI * 2) / 12;
    const waveAmplitude = 25; // Amplitude in %
    const centerPosition = 50; // Center position in %

    // Create smooth S-curve
    const left = centerPosition + (Math.sin(dayIndex * waveFrequency) * waveAmplitude);

    return {
      left: `${left}%`,
      top: `${top}px`
    };
  };

  // Calculate day index in year from month and day
  export const calculateDayIndexInYear = (monthIndex, dayNum, monthsConfig) => {
    let dayIndex = 0;
    for (let i = 0; i < monthIndex; i++) {
      dayIndex += monthsConfig[i].days;
    }
    dayIndex += dayNum - 1; // dayNum starts from 1
    return dayIndex;
  };
