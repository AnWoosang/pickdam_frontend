const fs = require('fs');

const files = [
  '/Users/songsiho/pickdam_frontend/src/domains/community/hooks/usePostDetailPage.ts',
  '/Users/songsiho/pickdam_frontend/src/domains/community/hooks/usePostHeader.ts',
  '/Users/songsiho/pickdam_frontend/src/domains/community/hooks/usePostLikeButton.ts',
  '/Users/songsiho/pickdam_frontend/src/domains/community/hooks/usePostWritePage.ts'
];

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('"use client";') || content.startsWith('"use client";')) {
      return; // Skip if no "use client" or already at top
    }

    console.log(`Fixing: ${filePath}`);

    let lines = content.split('\n');
    let clientDirectiveLine = '';
    let otherLines = [];

    for (let line of lines) {
      if (line.trim() === '"use client";') {
        clientDirectiveLine = line;
      } else {
        otherLines.push(line);
      }
    }

    if (clientDirectiveLine) {
      const newContent = [clientDirectiveLine, '', ...otherLines].join('\n');
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
});

console.log('Done fixing remaining "use client" directives.');