const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 유지할 중요한 index.ts 파일들
const KEEP_INDEXES = [
  'src/domains/auth/index.ts',
  'src/domains/user/index.ts',
  'src/domains/product/index.ts',
  'src/domains/community/index.ts',
  'src/domains/home/index.ts',
  'src/domains/image/index.ts',
  'src/domains/review/index.ts',
  'src/shared/components/index.ts',
  'src/shared/index.ts',
  'src/app/providers/index.ts',
  'src/app/router/index.ts',
  'src/utils/index.ts',
  'src/infrastructure/index.ts'
];

console.log('🧹 Starting index.ts cleanup...');

// 1. 모든 index.ts 파일 찾기
const allIndexes = execSync('find src -name "index.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.trim());

console.log(`📊 Found ${allIndexes.length} index.ts files`);

// 2. 제거할 파일들 식별
const toRemove = allIndexes.filter(file => !KEEP_INDEXES.includes(file));
const toKeep = allIndexes.filter(file => KEEP_INDEXES.includes(file));

console.log(`✅ Keeping ${toKeep.length} essential index.ts files:`);
toKeep.forEach(file => console.log(`   ${file}`));

console.log(`🗑️  Removing ${toRemove.length} unnecessary index.ts files:`);

// 3. 파일 제거 (먼저 백업)
let removedCount = 0;
toRemove.forEach(file => {
  try {
    // 백업 생성
    const backupPath = file + '.backup';
    fs.copyFileSync(file, backupPath);

    // 원본 제거
    fs.unlinkSync(file);
    removedCount++;
    console.log(`   ✅ Removed: ${file}`);
  } catch (error) {
    console.log(`   ❌ Failed to remove: ${file} - ${error.message}`);
  }
});

console.log(`\n🎉 Cleanup complete!`);
console.log(`📊 Removed ${removedCount} unnecessary index.ts files`);
console.log(`📊 Kept ${toKeep.length} essential index.ts files`);
console.log(`📊 Total reduction: ${removedCount}/${allIndexes.length} files (${Math.round(removedCount/allIndexes.length*100)}%)`);

console.log(`\n⚠️  Next steps:`);
console.log(`1. Run import optimization script`);
console.log(`2. Test with: npm run dev`);
console.log(`3. If issues occur, restore from .backup files`);