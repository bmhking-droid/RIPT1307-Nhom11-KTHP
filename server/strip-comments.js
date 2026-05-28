const fs = require('fs');
const path = require('path');

// Parser xóa comment an toàn — bỏ qua nội dung bên trong string literals
function stripComments(code) {
  let result = '';
  let i = 0;
  const len = code.length;

  while (i < len) {
    const ch = code[i];

    // Template literal `...`
    if (ch === '`') {
      result += ch; i++;
      let depth = 0;
      while (i < len) {
        const c = code[i];
        if (c === '\\') { result += c + code[i + 1]; i += 2; continue; }
        if (c === '$' && code[i + 1] === '{') { depth++; result += c; i++; continue; }
        if (c === '{') { depth++; result += c; i++; continue; }
        if (c === '}' && depth > 0) { depth--; result += c; i++; continue; }
        if (c === '`' && depth === 0) { result += c; i++; break; }
        result += c; i++;
      }
      continue;
    }

    // String literal ' hoặc "
    if (ch === '"' || ch === "'") {
      result += ch; i++;
      while (i < len) {
        const c = code[i];
        if (c === '\\') { result += c + (code[i + 1] || ''); i += 2; continue; }
        result += c; i++;
        if (c === ch) break;
      }
      continue;
    }

    // Single-line comment //
    if (ch === '/' && code[i + 1] === '/') {
      while (i < len && code[i] !== '\n') i++;
      continue;
    }

    // Multi-line comment /* ... */
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < len) {
        if (code[i] === '*' && code[i + 1] === '/') { i += 2; break; }
        i++;
      }
      continue;
    }

    result += ch; i++;
  }

  return result;
}

// Gom dòng trống liên tiếp thành tối đa 1 dòng trống
function cleanupBlankLines(content) {
  return content
    .replace(/\r\n/g, '\n')          // normalize CRLF → LF
    .replace(/[ \t]+$/gm, '')        // xóa trailing spaces
    .replace(/\n{3,}/g, '\n\n')      // tối đa 1 dòng trống liên tiếp
    .replace(/^\n+/, '')             // xóa dòng trống đầu file
    .trimEnd() + '\n';
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const stripped = stripComments(original);
  const cleaned = cleanupBlankLines(stripped);
  fs.writeFileSync(filePath, cleaned, 'utf8');
  console.log(`✓ ${path.relative(process.cwd(), filePath)}`);
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'logs', 'uploads']);

function walkDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walkDir(full);
    } else if (entry.name.endsWith('.js')) {
      processFile(full);
    }
  }
}

const srcDir = path.join(__dirname, 'src');
console.log(`\nXóa comments trong: ${srcDir}\n`);
walkDir(srcDir);
console.log('\n✅ Hoàn tất!');
