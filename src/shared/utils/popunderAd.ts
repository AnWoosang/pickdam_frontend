const POPUNDER_COOLDOWN_KEY = 'popunder_last_shown';
const COOLDOWN_MINUTES = 10;

export const canShowPopunder = (): boolean => {
  if (typeof window === 'undefined') return false;

  const lastShown = localStorage.getItem(POPUNDER_COOLDOWN_KEY);

  if (!lastShown) return true;

  const lastShownTime = parseInt(lastShown, 10);
  const currentTime = Date.now();
  const timeDiff = currentTime - lastShownTime;
  const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

  return timeDiff >= cooldownMs;
};

export const markPopunderShown = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(POPUNDER_COOLDOWN_KEY, Date.now().toString());
};

export const loadPopunderScript = (): void => {
  if (typeof window === 'undefined') return;

  if (!canShowPopunder()) return;

  // 이미 스크립트가 로드되었는지 확인
  const existingScript = document.querySelector(
    'script[src*="7bfa28077067fa47d9df7ed630e31955"]'
  );

  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//pl27752315.revenuecpmgate.com/7b/fa/28/7bfa28077067fa47d9df7ed630e31955.js';
  script.async = true;

  document.head.appendChild(script);
  markPopunderShown();
};