const fs = require('fs');
const { execSync } = require('child_process');

// 잘못된 import 경로들을 올바른 경로로 수정
const wrongImportFixes = [
  // 컴포넌트와 훅이 types/post로 잘못 매핑된 것들 수정
  {
    wrong: /import { ([^}]*PostHeader[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*PostContent[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*CommentSection[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*usePostDetailPage[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*useCommentSection[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*CommentForm[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*CommentList[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*useWritePostPage[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*usePostImageEditor[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*CategorySelector[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },
  {
    wrong: /import { ([^}]*PostEditor[^}]*) } from ['"]@\/domains\/community\/types\/post['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/community';`
  },

  // auth 관련 수정
  {
    wrong: /import { ([^}]*LoginModal[^}]*) } from ['"]@\/domains\/auth\/types\/auth['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/auth';`
  },
  {
    wrong: /import { ([^}]*useAuthStore[^}]*) } from ['"]@\/domains\/auth\/types\/auth['"];/g,
    correct: (match, imports) => `import { ${imports} } from '@/domains/auth';`
  }
];

const files = execSync('find src -name "*.tsx" -o -name "*.ts"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(file => !file.includes('index.ts'));

console.log(`🔧 Fixing wrong import paths...`);

let fixedFiles = 0;

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    wrongImportFixes.forEach(({ wrong, correct }) => {
      const newContent = content.replace(wrong, correct);
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

console.log(`\n🎉 Wrong import fixes complete!`);
console.log(`📊 Files fixed: ${fixedFiles}`);
console.log(`\n🚀 Now run: npm run dev`);