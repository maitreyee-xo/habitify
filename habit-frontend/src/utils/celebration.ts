import confetti from "canvas-confetti";

export const fireConfetti = () => {
  confetti({
    particleCount: 180,
    spread: 90,
    origin: { y: 0.6 },
  });
};

export const shouldCelebrateStreak = (streak: number) => {
  return [7, 30, 60, 90, 180].includes(streak);
};
