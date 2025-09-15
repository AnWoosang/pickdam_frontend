const { performance } = require('perf_hooks');

// Next.js 컴파일 성능 분석 스크립트
const originalRequire = require;
const moduleLoadTimes = new Map();

require = function(id) {
  const start = performance.now();
  const result = originalRequire.apply(this, arguments);
  const end = performance.now();
  const duration = end - start;
  
  moduleLoadTimes.set(id, duration);
  
  if (duration > 50) { // 50ms 이상 걸리는 모듈만 기록
    console.log(`🐌 Module load: ${id} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};

// 상위 10개 느린 모듈 출력
process.on('exit', () => {
  const sortedModules = Array.from(moduleLoadTimes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  console.log('\n📊 Top 10 slowest modules:');
  sortedModules.forEach(([module, time], index) => {
    console.log(`${index + 1}. ${module}: ${time.toFixed(2)}ms`);
  });
});

// TypeScript 컴파일 성능 추적
const ts = require('typescript');
const originalCreateProgram = ts.createProgram;

ts.createProgram = function(...args) {
  console.log('📊 TypeScript compilation started');
  const start = performance.now();
  const result = originalCreateProgram.apply(this, args);
  const end = performance.now();
  console.log(`📊 TypeScript compilation took ${(end - start).toFixed(2)}ms`);
  return result;
};

console.log('🔍 Performance debugging enabled');