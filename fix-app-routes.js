const fs = require('fs');
const path = require('path');

// Define mappings for page components and their correct paths
const pageMappings = {
  'MyPostsPage': '@/domains/user/components/mypage/MyPostsPage',
  'MyCommentsPage': '@/domains/user/components/mypage/MyCommentsPage',
  'MyReviewsPage': '@/domains/user/components/mypage/MyReviewsPage',
  'Mypage': '@/domains/user/components/mypage/Mypage',
  'ProtectedRoute': '@/domains/auth/components/ProtectedRoute',
  'ProductDetailPage': '@/domains/product/components/detail/ProductDetailPage',
  'ProductListPage': '@/domains/product/components/ProductListPage'
};

function fixImportsInAppFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let newContent = content;

    // Check each mapping and fix incorrect imports
    for (const [componentName, correctPath] of Object.entries(pageMappings)) {
      // Look for incorrect import patterns
      const incorrectPatterns = [
        `import { ${componentName} } from '@/domains/user/types/user';`,
        `import { ${componentName} } from '@/domains/auth/types/auth';`,
        `import { ${componentName} } from '@/domains/product/components/ProductCard';`
      ];

      for (const incorrectPattern of incorrectPatterns) {
        if (newContent.includes(incorrectPattern)) {
          console.log(`Fixing ${componentName} import in: ${filePath}`);
          const correctImport = `import { ${componentName} } from '${correctPath}';`;
          newContent = newContent.replace(incorrectPattern, correctImport);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

// Fix specific files mentioned in errors
const filesToFix = [
  '/Users/songsiho/pickdam_frontend/src/app/mypage/my-posts/page.tsx',
  '/Users/songsiho/pickdam_frontend/src/app/mypage/page.tsx',
  '/Users/songsiho/pickdam_frontend/src/app/mypage/reviews/page.tsx',
  '/Users/songsiho/pickdam_frontend/src/app/product/[id]/page.tsx',
  '/Users/songsiho/pickdam_frontend/src/app/product/list/page.tsx'
];

let fixedCount = 0;
for (const file of filesToFix) {
  if (fs.existsSync(file) && fixImportsInAppFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed imports in ${fixedCount} app route files.`);