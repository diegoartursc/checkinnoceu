/**
 * Calculate sinuous path position for day nodes (Match-3 style)
 */
export const calculatePathPosition = (dayIndex, totalDays) => {
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
