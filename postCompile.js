import fs from 'fs';
import path from 'path';

function addJsExtension(dir) {
  // Helper
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      addJsExtension(path.join(dir, file.name));
    } else if (file.name.endsWith('.js')) {
      const filePath = path.join(dir, file.name);
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/from\s+['"](.+?)['"]/g, (match, p1) => {
        if (p1.startsWith('.') && !p1.endsWith('.js')) {
          return `from '${p1}.js'`;
        }
        return match;
      });
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

addJsExtension('./dist');
