export const convertLapTimeToSeconds = (lapTime: string): number => {
  if (!lapTime) return 0;
  const [minutes, seconds] = lapTime.split(":").map(Number);
  return parseFloat((minutes * 60 + seconds).toFixed(3));
};
