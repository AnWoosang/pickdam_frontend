const fs = require('fs');
const { execSync } = require('child_process');

// 잘못 변경된 import 수정
const importFixes = [
  // 공통 컴포넌트들 올바른 경로로 수정
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]Button['\"]\)/g,
    replacement: "from '@/shared/components/Button'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]ErrorMessage['\"]\)/g,
    replacement: "from '@/shared/components/ErrorMessage'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]Avatar['\"]\)/g,
    replacement: "from '@/shared/components/Avatar'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]Breadcrumb['\"]\)/g,
    replacement: "from '@/shared/components/Breadcrumb'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]ConfirmDialog['\"]\)/g,
    replacement: "from '@/shared/components/ConfirmDialog'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]Divider['\"]\)/g,
    replacement: "from '@/shared/components/Divider'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]BaseModal['\"]\)/g,
    replacement: "from '@/shared/components/BaseModal'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]Pagination['\"]\)/g,
    replacement: "from '@/shared/components/Pagination'"
  },
  {
    pattern: /from ['"]@\/shared\/components\/LoadingSpinner['"] \(imported as ['"]MentionText['\"]\)/g,
    replacement: "from '@/shared/components/MentionText'"
  }
];

// 더 간단한 방법: 잘못된 패턴을 직접 수정
const simpleReplaces = [
  // @/shared/components/LoadingSpinner로 잘못 변경된 것들을 개별 컴포넌트로 수정
  {
    from: "from '@/shared/components/LoadingSpinner'",
    searches: [
      { import: "Button", to: "from '@/shared/components/Button'" },
      { import: "ErrorMessage", to: "from '@/shared/components/ErrorMessage'" },
      { import: "Avatar", to: "from '@/shared/components/Avatar'" },
      { import: "Breadcrumb", to: "from '@/shared/components/Breadcrumb'" },
      { import: "ConfirmDialog", to: "from '@/shared/components/ConfirmDialog'" },
      { import: "Divider", to: "from '@/shared/components/Divider'" },
      { import: "BaseModal", to: "from '@/shared/components/BaseModal'" },
      { import: "Pagination", to: "from '@/shared/components/Pagination'" },
      { import: "MentionText", to: "from '@/shared/components/MentionText'" }
    ]
  }
];

const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => !file.includes('index.ts'));

console.log(`🔧 Fixing import errors in ${files.length} files...`);

let fixedFiles = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // LoadingSpinner에서 잘못 import하는 컴포넌트들 수정
    simpleReplaces[0].searches.forEach(({ import: importName, to }) => {
      const wrongPattern = new RegExp(`import\\s*{[^}]*${importName}[^}]*}\\s*from\\s*['"]@/shared/components/LoadingSpinner['"]`, 'g');
      if (wrongPattern.test(content)) {
        // import { Button, ... } from '@/shared/components/LoadingSpinner'
        // → import { Button } from '@/shared/components/Button'
        const importRegex = new RegExp(`import\\s*{([^}]*)}\\s*from\\s*['"]@/shared/components/LoadingSpinner['"]`, 'g');
        content = content.replace(importRegex, (match, imports) => {
          const importsList = imports.split(',').map(i => i.trim()).filter(i => i);
          let result = '';

          importsList.forEach(imp => {
            const cleanImport = imp.trim();
            const targetSearch = simpleReplaces[0].searches.find(s => s.import === cleanImport);
            if (targetSearch) {
              result += `import { ${cleanImport} } ${targetSearch.to};\n`;
            } else if (cleanImport === 'LoadingSpinner') {
              result += `import { LoadingSpinner } from '@/shared/components/LoadingSpinner';\n`;
            }
          });

          return result.slice(0, -1); // 마지막 \n 제거
        });
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      fixedFiles++;
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Import errors fixed!`);
console.log(`📊 Files fixed: ${fixedFiles}`);
console.log(`\n🚀 Now run: npm run dev`);