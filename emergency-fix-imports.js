const fs = require('fs');
const { execSync } = require('child_process');

// 긴급 import 경로 수정 맵
const urgentFixes = [
  // toGender 수정
  {
    pattern: /from ['"]@\/domains\/user\/types\/user['"] \(imported as ['"]toGender['\"]\)/g,
    replacement: "from '@/domains/user/types/dto/userMapper'"
  },
  {
    pattern: /import { ([^}]*toGender[^}]*) } from ['"]@\/domains\/user\/types\/user['"];?/g,
    replacement: "import { $1 } from '@/domains/user/types/dto/userMapper';"
  },

  // CATEGORY_CONFIG 수정
  {
    pattern: /import { ([^}]*CATEGORY_CONFIG[^}]*) } from ['"]@\/domains\/product\/types\/product['"];?/g,
    replacement: "import { $1 } from '@/domains/product/types/category';"
  },

  // useRecentProducts 수정
  {
    pattern: /import { ([^}]*useRecentProducts[^}]*) } from ['"]@\/domains\/user\/types\/user['"];?/g,
    replacement: "import { $1 } from '@/domains/user/hooks/useRecentProducts';"
  },

  // shared 컴포넌트들이 FormField로 잘못 매핑된 것들 수정
  {
    pattern: /import { ([^}]*Button[^}]*) } from ['"]@\/shared\/components\/FormField['"];?/g,
    replacement: "import { $1 } from '@/shared/components/Button';"
  },
  {
    pattern: /import { ([^}]*BaseModal[^}]*) } from ['"]@\/shared\/components\/FormField['"];?/g,
    replacement: "import { $1 } from '@/shared/components/BaseModal';"
  },
  {
    pattern: /import { ([^}]*ImageViewerModal[^}]*) } from ['"]@\/shared\/components\/FormField['"];?/g,
    replacement: "import { $1 } from '@/shared/components/ImageViewerModal';"
  },
  {
    pattern: /import { ([^}]*Logo[^}]*) } from ['"]@\/shared\/components\/FormField['"];?/g,
    replacement: "import { $1 } from '@/shared/components/Logo';"
  },
  {
    pattern: /import { ([^}]*SearchBar[^}]*) } from ['"]@\/shared\/components\/FormField['"];?/g,
    replacement: "import { $1 } from '@/shared/components/SearchBar';"
  },

  // AuthProvider 수정
  {
    pattern: /import { ([^}]*AuthProvider[^}]*) } from ['"]@\/domains\/auth\/types\/auth['"];?/g,
    replacement: "import { $1 } from '@/domains/auth/providers/AuthProvider';"
  }
];

const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => !file.includes('index.ts'));

console.log(`🚨 Emergency import fixes for ${files.length} files...`);

let fixedFiles = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    urgentFixes.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      fixedFiles++;
      console.log(`✅ Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error in ${filePath}:`, error.message);
  }
});

console.log(`\n🎉 Emergency fixes complete!`);
console.log(`📊 Files fixed: ${fixedFiles}`);
console.log(`\n🚀 Try: npm run dev`);