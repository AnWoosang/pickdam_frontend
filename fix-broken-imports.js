const fs = require('fs');
const { execSync } = require('child_process');

// 문제가 있는 파일들 찾기
const files = [
  'src/app/api/auth/signup/route.ts',
  'src/app/api/products/[id]/route.ts', 
  'src/app/api/users/[id]/profile/route.ts',
  'src/app/api/users/[id]/wishlist/route.ts',
  'src/app/api/users/check-nickname/route.ts'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 잘못된 import 패턴 수정
  content = content.replace(/import \{ \nimport \{ supabaseServer \} from '@\/infrastructure\/api\/supabaseServer'/g, 
                           "import {\nimport { supabaseServer } from '@/infrastructure/api/supabaseServer'");
  
  // 더 정확한 패턴으로 수정
  content = content.replace(/import \{ \nimport \{ supabaseServer \}/g, 'import {');
  
  // supabaseServer import를 별도로 추가
  if (!content.includes("import { supabaseServer } from '@/infrastructure/api/supabaseServer'")) {
    // 마지막 import 다음에 추가
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') && !lines[i].includes('supabaseServer')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, "import { supabaseServer } from '@/infrastructure/api/supabaseServer'");
      content = lines.join('\n');
    }
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${filePath}`);
});

console.log('✅ Fixed broken import files!');
