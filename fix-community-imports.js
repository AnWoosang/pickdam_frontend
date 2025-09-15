const fs = require('fs');
const path = require('path');

// Define the mapping of what should be imported from where
const importMappings = {
  // API functions
  'postApi': '@/domains/community/api',
  'getReplies': '@/domains/community/api',

  // Query keys
  'postQueryKeys': '@/domains/community/constants',
  'commentQueryKeys': '@/domains/community/constants',

  // Hooks - React Query mutations
  'useCreatePostMutation': '@/domains/community/hooks',
  'useUpdatePostMutation': '@/domains/community/hooks',
  'useDeletePostMutation': '@/domains/community/hooks',
  'useTogglePostLikeMutation': '@/domains/community/hooks',
  'useIncrementPostViewMutation': '@/domains/community/hooks',
  'useCreateCommentMutation': '@/domains/community/hooks',
  'useUpdateCommentMutation': '@/domains/community/hooks',
  'useDeleteCommentMutation': '@/domains/community/hooks',
  'useToggleCommentLikeMutation': '@/domains/community/hooks',

  // Business logic hooks
  'useCommentCard': '@/domains/community/hooks',
  'useCommentForm': '@/domains/community/hooks',
  'useCommentSection': '@/domains/community/hooks',
  'usePostLikeButton': '@/domains/community/hooks',
  'usePostDetailPage': '@/domains/community/hooks',
  'usePostEditModal': '@/domains/community/hooks',
  'usePostWritePage': '@/domains/community/hooks',
  'usePostHeader': '@/domains/community/hooks',

  // Components
  'CommentCard': '@/domains/community/components/comment',
  'CommentHeader': '@/domains/community/components/comment',
  'CommentContent': '@/domains/community/components/comment',
  'CommentActions': '@/domains/community/components/comment',
  'CommentReplyList': '@/domains/community/components/comment/reply',
  'CommentReplyWrite': '@/domains/community/components/comment/reply',
  'ReplyForm': '@/domains/community/components/comment/reply',
  'CategorySelector': '@/domains/community/components/post',
  'PostEditor': '@/domains/community/components/post/edit',

  // Constants/Types
  'POST_CATEGORIES': '@/domains/community/types/community',
  'DEFAULT_CATEGORY_ID': '@/domains/community/types/community',

  // Validation
  'validatePost': '@/domains/community/validation',
};

function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file imports from the wrong path
    if (!content.includes("from '@/domains/community/types/post'")) {
      return false; // No need to fix this file
    }

    console.log(`Fixing imports in: ${filePath}`);

    let lines = content.split('\n');
    let newLines = [];
    let importsToAdd = new Map(); // Map of import path to array of imports
    let typesImports = []; // Regular types that should still come from types

    for (let line of lines) {
      // Skip lines that import from types/post
      if (line.includes("from '@/domains/community/types/post'")) {
        // Extract imports from this line
        const importMatch = line.match(/import\s*\{([^}]+)\}\s*from/);
        if (importMatch) {
          const imports = importMatch[1].split(',').map(imp => imp.trim());

          for (let imp of imports) {
            const cleanImport = imp.trim();
            if (importMappings[cleanImport]) {
              // This import should go to a specific location
              const targetPath = importMappings[cleanImport];
              if (!importsToAdd.has(targetPath)) {
                importsToAdd.set(targetPath, []);
              }
              importsToAdd.get(targetPath).push(cleanImport);
            } else {
              // This is probably a regular type, keep it for types import
              typesImports.push(cleanImport);
            }
          }
        }
        // Skip this line (don't add to newLines)
        continue;
      }

      newLines.push(line);
    }

    // Find where to insert new imports (after existing imports but before other code)
    let insertIndex = 0;
    for (let i = 0; i < newLines.length; i++) {
      if (newLines[i].startsWith('import ') || newLines[i].trim() === '') {
        insertIndex = i + 1;
      } else {
        break;
      }
    }

    // Build new import lines
    let newImportLines = [];

    // Add types import if we have any
    if (typesImports.length > 0) {
      newImportLines.push(`import { ${typesImports.join(', ')} } from '@/domains/community/types';`);
    }

    // Add other imports
    for (let [importPath, imports] of importsToAdd) {
      newImportLines.push(`import { ${imports.join(', ')} } from '${importPath}';`);
    }

    // Insert new imports
    newLines.splice(insertIndex, 0, ...newImportLines);

    const newContent = newLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');

    return true;
  } catch (error) {
    console.error(`Error fixing file ${filePath}:`, error.message);
    return false;
  }
}

function findFilesToFix(directory) {
  const files = [];

  function traverse(dir) {
    const items = fs.readdirSync(dir);

    for (let item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  traverse(directory);
  return files;
}

// Main execution
const communityDir = '/Users/songsiho/pickdam_frontend/src/domains/community';
const files = findFilesToFix(communityDir);

let fixedCount = 0;
for (let file of files) {
  if (fixImportsInFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed imports in ${fixedCount} files.`);