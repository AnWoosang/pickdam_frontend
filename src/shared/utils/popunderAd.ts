// let isScriptLoaded = false;

// export const loadPopunderScript = (): void => {
//   if (typeof window === 'undefined') return;

//   // 이미 로드되었으면 다시 로드하지 않음
//   if (isScriptLoaded) return;

//   // 이미 스크립트가 로드되었는지 확인
//   const existingScript = document.querySelector(
//     'script[src*="7bfa28077067fa47d9df7ed630e31955"]'
//   );

//   if (existingScript) {
//     isScriptLoaded = true;
//     return;
//   }

//   const script = document.createElement('script');
//   script.type = 'text/javascript';
//   script.src = '//pl27752315.revenuecpmgate.com/7b/fa/28/7bfa28077067fa47d9df7ed630e31955.js';
//   script.async = true;

//   script.onload = () => {
//     isScriptLoaded = true;
//   };

//   document.head.appendChild(script);
// };