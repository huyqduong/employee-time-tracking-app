export const getJobLocationDisplay = (location?: { name: string; city: string; state: string }): string => {
  if (!location) return '';
  return `${location.name} - ${location.city}, ${location.state}`;
};
