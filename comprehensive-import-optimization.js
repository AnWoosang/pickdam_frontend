const fs = require('fs');
const { execSync } = require('child_process');

// 전체적인 barrel import 최적화 매핑
const optimizationRules = [
  // 도메인 간 참조 최적화
  {
    pattern: /from ['"]@\/domains\/user['"](?!\/)/g,
    replacement: "from '@/domains/user/types/user'"
  },
  {
    pattern: /from ['"]@\/domains\/product\/types['"](?!\/)/g,
    replacement: "from '@/domains/product/types/product'"
  },
  {
    pattern: /from ['"]@\/domains\/community['"](?!\/)/g,
    replacement: "from '@/domains/community/types/post'"
  },
  {
    pattern: /from ['"]@\/domains\/auth['"](?!\/)/g,
    replacement: "from '@/domains/auth/types/auth'"
  },

  // shared 모듈 최적화
  {
    pattern: /from ['"]@\/shared\/layout['"](?!\/)/g,
    replacement: "from '@/shared/layout/Container'"
  },
  {
    pattern: /from ['"]@\/shared\/components['"](?!\/)/g,
    replacement: "from '@/shared/components/FormField'"
  },
  {
    pattern: /from ['"]@\/shared\/validation['"](?!\/)/g,
    replacement: "from '@/shared/validation/validation'"
  },
  {
    pattern: /from ['"]@\/shared\/utils['"](?!\/)/g,
    replacement: "from '@/shared/utils/index'"
  },
  {
    pattern: /from ['"]@\/shared\/hooks['"](?!\/)/g,
    replacement: "from '@/shared/hooks/useNicknameCheck'"
  },
  {
    pattern: /from ['"]@\/shared\/constants['"](?!\/)/g,
    replacement: "from '@/shared/constants/terms'"
  },

  // utils 최적화
  {
    pattern: /from ['"]@\/utils['"](?!\/)/g,
    replacement: "from '@/utils/dateUtils'"
  }
];

// 더 세밀한 컴포넌트별 최적화
const specificOptimizations = [
  // 특정 컴포넌트가 실제로 사용하는 것만 import하도록
  {
    searchText: "import { Product }",
    pattern: /from ['"]@\/domains\/product\/types['"](?!\/)/g,
    replacement: "from '@/domains/product/types/product'"
  },
  {
    searchText: "import { User }",
    pattern: /from ['"]@\/domains\/user['"](?!\/)/g,
    replacement: "from '@/domains/user/types/user'"
  },
  {
    searchText: "import { Gender }",
    pattern: /from ['"]@\/domains\/user['"](?!\/)/g,
    replacement: "from '@/domains/user/types/gender'"
  },
  {
    searchText: "import { Post }",
    pattern: /from ['"]@\/domains\/community['"](?!\/)/g,
    replacement: "from '@/domains/community/types/post'"
  },
  {
    searchText: "import { Comment }",
    pattern: /from ['"]@\/domains\/community['"](?!\/)/g,
    replacement: "from '@/domains/community/types/comment'"
  }
];

const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => !file.includes('index.ts') && !file.includes('.backup'));

console.log(`🚀 Comprehensive import optimization for ${files.length} files...`);

let optimizedFiles = 0;
let totalOptimizations = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileModified = false;
    let fileOptimizations = 0;

    // 1. 일반적인 barrel import 최적화
    optimizationRules.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replacement);
        fileModified = true;
        fileOptimizations += matches.length;
      }
    });

    // 2. 특정 컴포넌트별 세밀한 최적화
    specificOptimizations.forEach(({ searchText, pattern, replacement }) => {
      if (content.includes(searchText)) {
        const matches = content.match(pattern);
        if (matches) {
          content = content.replace(pattern, replacement);
          fileModified = true;
          fileOptimizations += matches.length;
        }
      }
    });

    if (fileModified) {
      fs.writeFileSync(filePath, content);
      optimizedFiles++;
      totalOptimizations += fileOptimizations;
      console.log(`✅ ${filePath} (${fileOptimizations} optimizations)`);
    }
  } catch (error) {
    console.error(`❌ Error in ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Comprehensive optimization complete!`);
console.log(`📊 Files optimized: ${optimizedFiles}/${files.length}`);
console.log(`📊 Total optimizations: ${totalOptimizations}`);
console.log(`\n⚡ Expected reduction: 1000+ modules`);
console.log(`\n🚀 Now run: npm run dev`);