const fs = require('fs');
const path = require('path');

function fixUseClientInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file has 'use client' not at the beginning
    if (!content.includes("'use client'") || content.startsWith("'use client'")) {
      return false; // No need to fix this file
    }

    console.log(`Fixing 'use client' position in: ${filePath}`);

    let lines = content.split('\n');
    let useClientLine = '';
    let otherLines = [];

    for (let line of lines) {
      if (line.trim() === "'use client';") {
        useClientLine = line;
      } else {
        otherLines.push(line);
      }
    }

    // Reconstruct with 'use client' first
    if (useClientLine) {
      const newContent = [useClientLine, '', ...otherLines].join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }

    return false;
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
  if (fixUseClientInFile(file)) {
    fixedCount++;
  }
}

console.log(`Fixed 'use client' position in ${fixedCount} files.`);