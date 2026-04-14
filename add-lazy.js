import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('<img ')) {
        const originalContent = content;
        content = content.replace(/<img\s+(?!loading)/g, '<img loading="lazy" ');
        if (content !== originalContent) {
           fs.writeFileSync(fullPath, content);
           console.log(`Lazy loaded images in: ${fullPath}`);
        }
      }
    }
  }
}
processDir('./src');
