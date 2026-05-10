export const transitions = {
  screen: { type: 'timing' as const, duration: 400 },
  card: { type: 'timing' as const, duration: 300 },
  spring: { type: 'spring' as const, damping: 20, stiffness: 200 },
  press: { type: 'spring' as const, damping: 15 },
};
