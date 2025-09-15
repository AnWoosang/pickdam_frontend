const fs = require('fs');
const { execSync } = require('child_process');

// 잘못된 import 패턴을 올바른 경로로 수정
const fixes = [
  {
    wrong: "from '@/shared/components/LoadingSpinner'",
    patterns: [
      { component: 'Button', correct: "from '@/shared/components/Button'" },
      { component: 'ErrorMessage', correct: "from '@/shared/components/ErrorMessage'" },
      { component: 'Avatar', correct: "from '@/shared/components/Avatar'" },
      { component: 'Breadcrumb', correct: "from '@/shared/components/Breadcrumb'" },
      { component: 'BreadcrumbItem', correct: "from '@/shared/components/Breadcrumb'" },
      { component: 'ConfirmDialog', correct: "from '@/shared/components/ConfirmDialog'" },
      { component: 'Divider', correct: "from '@/shared/components/Divider'" },
      { component: 'BaseModal', correct: "from '@/shared/components/BaseModal'" },
      { component: 'Pagination', correct: "from '@/shared/components/Pagination'" },
      { component: 'MentionText', correct: "from '@/shared/components/MentionText'" }
    ]
  }
];

const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => file.includes('.tsx') || file.includes('.ts'));

console.log(`🔧 Quick fixing imports...`);

let fixedFiles = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 잘못된 import가 있는지 확인
    if (content.includes("from '@/shared/components/LoadingSpinner'")) {
      fixes[0].patterns.forEach(({ component, correct }) => {
        // { Button, ... } from '@/shared/components/LoadingSpinner' 패턴 찾기
        const regex = new RegExp(`import\\s*{([^}]*\\b${component}\\b[^}]*)}\\s*from\\s*'@/shared/components/LoadingSpinner'`, 'g');

        content = content.replace(regex, (match, imports) => {
          const importsList = imports.split(',').map(i => i.trim()).filter(i => i);
          let result = '';
          let remainingImports = [];

          importsList.forEach(imp => {
            if (imp === component) {
              result += `import { ${component} } ${correct};\n`;
            } else {
              remainingImports.push(imp);
            }
          });

          // LoadingSpinner나 다른 컴포넌트가 남아있으면 유지
          if (remainingImports.length > 0) {
            result += `import { ${remainingImports.join(', ')} } from '@/shared/components/LoadingSpinner';`;
          }

          modified = true;
          return result.replace(/\n$/, '');
        });
      });
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      fixedFiles++;
      console.log(`✅ ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ ${filePath}: ${error.message}`);
  }
});

console.log(`\n🎉 Quick fix complete!`);
console.log(`📊 Files fixed: ${fixedFiles}`);
console.log(`\n🚀 Try: npm run dev`);