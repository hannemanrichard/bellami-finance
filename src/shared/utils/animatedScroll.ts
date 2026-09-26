type AnimatedScrollOptions = {
  durationMs?: number;
  offsetPx?: number;
  block?: "start" | "center";
};

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const getTargetScrollY = (
  element: HTMLElement,
  block: "start" | "center",
  offsetPx: number
): number => {
  const rect = element.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;

  if (block === "center") {
    return absoluteTop - window.innerHeight / 2 + rect.height / 2 - offsetPx;
  }

  return absoluteTop - offsetPx;
};

export const animatedScrollToElement = (
  element: HTMLElement,
  options: AnimatedScrollOptions = {}
): Promise<void> => {
  const { durationMs = 700, offsetPx = 0, block = "center" } = options;
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    Math.min(
      getTargetScrollY(element, block, offsetPx),
      document.documentElement.scrollHeight - window.innerHeight
    )
  );
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) {
    return Promise.resolve();
  }

  const startTime = performance.now();

  return new Promise((resolve) => {
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      resolve();
    };

    requestAnimationFrame(step);
  });
};
