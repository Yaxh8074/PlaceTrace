export const calculateDistance = (
  actual: { lat: number; lng: number },
  guessed: [number, number]
): number => {
  const R = 6371; // Earth's radius in km
  const φ1 = actual.lat * Math.PI / 180;
  const φ2 = guessed[0] * Math.PI / 180;
  const Δφ = (guessed[0] - actual.lat) * Math.PI / 180;
  const Δλ = (guessed[1] - actual.lng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ/2) * Math.sin(Δλ/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

export const calculateScore = (
  actual: { lat: number; lng: number },
  guessed: [number, number]
): number => {
  const distance = calculateDistance(actual, guessed);
  return Math.round(Math.max(0, 5000 * Math.exp(-distance/2000)));
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const getRandomLocation = (locations: any[], usedLocations: Set<string>) => {
  const availableLocations = locations.filter(loc => !usedLocations.has(loc.id));
  if (availableLocations.length === 0) return locations[Math.floor(Math.random() * locations.length)];
  return availableLocations[Math.floor(Math.random() * availableLocations.length)];
};