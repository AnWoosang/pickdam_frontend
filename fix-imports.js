const fs = require('fs');
const { execSync } = require('child_process');

// API 파일들 찾기
const files = execSync('find src/app/api -name "*.ts"', { encoding: 'utf8' }).trim().split('\n');

files.forEach(filePath => {
  if (!filePath) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // supabaseServer 동적 import가 있는지 확인
  if (content.includes('supabaseServer') && content.includes('await import')) {
    console.log(`Fixing: ${filePath}`);

    // 1. 정적 import 추가 (이미 있으면 추가하지 않음)
    if (!content.includes("import { supabaseServer } from '@/infrastructure/api/supabaseServer'")) {
      // import 섹션 마지막에 추가
      const lastImportMatch = content.match(/(import.*\n)(?!import)/);
      if (lastImportMatch) {
        const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
        content = content.slice(0, insertIndex) + 
                 "import { supabaseServer } from '@/infrastructure/api/supabaseServer'\n" + 
                 content.slice(insertIndex);
        modified = true;
      }
    }

    // 2. 동적 import 제거
    if (content.includes('await import')) {
      content = content.replace(/\s*const\s*{\s*supabaseServer\s*}\s*=\s*await\s*import\([^)]+\);\s*/g, '');
      content = content.replace(/\s*const\s*{\s*supabaseServer\s*}\s*=\s*await\s*import\([^)]+\)/g, '');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
    }
  }
});

console.log('✅ All API routes processed!');
