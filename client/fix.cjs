const fs = require('fs');
const path = require('path');

const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.jsx')) results.push(file);
  });
  return results;
};

const files = walk('C:/Users/prath/OneDrive/Desktop/Clinet_Work/client/src');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('useTenantContext')) {
    // 1. determine depth
    const parts = f.split(path.sep);
    const srcIndex = parts.indexOf('src');
    const depth = parts.length - srcIndex - 2;
    let importPath = './config';
    if (depth > 0) importPath = '../'.repeat(depth) + 'config';

    // 2. replace import
    c = c.replace(/import\s*\{\s*useTenantContext\s*\}\s*from\s*['"][.\/]+context\/TenantContext['"];?\r?\n?/g, `import { tenant } from '${importPath}';\n`);
    
    // 3. remove hook call
    c = c.replace(/(\s*)const\s*\{\s*tenant\s*\}\s*=\s*useTenantContext\(\);\r?\n?/g, '');

    fs.writeFileSync(f, c);
    console.log('Fixed', f);
  }
});
