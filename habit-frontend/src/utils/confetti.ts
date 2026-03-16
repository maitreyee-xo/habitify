export function popConfetti() {
  const count = 120;
  const defaults = { origin: { y: 0.7 } };

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    confetti.style.backgroundColor =
      ["#38bdf8", "#4ade80", "#f87171", "#a78bfa"][Math.floor(Math.random() * 4)];

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
  }
}
