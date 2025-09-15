const { performance } = require('perf_hooks');

// 1. 모듈별 로딩 시간 추적
const moduleLoadTimes = new Map();
const originalRequire = require;

require = function(id) {
  const start = performance.now();
  const result = originalRequire.apply(this, arguments);
  const end = performance.now();
  const duration = end - start;

  moduleLoadTimes.set(id, duration);

  // 느린 모듈만 실시간 출력
  if (duration > 100) {
    console.log(`🐌 SLOW MODULE: ${id} → ${duration.toFixed(2)}ms`);
  }

  return result;
};

// 2. TypeScript 처리 시간 추적
let tsStartTime;
const originalCreateProgram = require('typescript').createProgram;
require('typescript').createProgram = function(...args) {
  tsStartTime = performance.now();
  console.log('📊 TypeScript compilation START');
  const result = originalCreateProgram.apply(this, args);
  const duration = performance.now() - tsStartTime;
  console.log(`📊 TypeScript compilation END → ${duration.toFixed(2)}ms`);
  return result;
};

// 3. Webpack 플러그인별 시간 측정
const webpack = require('webpack');
const originalRun = webpack.Compiler.prototype.run;
webpack.Compiler.prototype.run = function(callback) {
  console.log('🔨 Webpack compilation STARTED');
  const start = performance.now();

  return originalRun.call(this, (err, stats) => {
    const duration = performance.now() - start;
    console.log(`🔨 Webpack compilation FINISHED → ${duration.toFixed(2)}ms`);

    if (stats) {
      console.log(`📦 Assets: ${stats.compilation.assets ? Object.keys(stats.compilation.assets).length : 'unknown'}`);
      console.log(`📁 Modules: ${stats.compilation.modules ? stats.compilation.modules.size : 'unknown'}`);
    }

    callback(err, stats);
  });
};

// 4. 프로세스 종료 시 상위 느린 모듈 출력
process.on('exit', () => {
  console.log('\n🔍 === PERFORMANCE ANALYSIS RESULTS ===');

  const slowModules = Array.from(moduleLoadTimes.entries())
    .filter(([_, time]) => time > 10)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  console.log('\n📊 Top 15 slowest modules (>10ms):');
  slowModules.forEach(([module, time], index) => {
    console.log(`${index + 1}. ${module} → ${time.toFixed(2)}ms`);
  });

  const totalModules = moduleLoadTimes.size;
  const totalTime = Array.from(moduleLoadTimes.values()).reduce((a, b) => a + b, 0);
  console.log(`\n📈 Total modules loaded: ${totalModules}`);
  console.log(`📈 Total module load time: ${totalTime.toFixed(2)}ms`);
});

console.log('🔍 Advanced performance analysis enabled');