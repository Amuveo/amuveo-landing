const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const buildScript = path.join(root, 'scripts', 'build.js');
const port = 4001;

const watchedPaths = [
  'index.html',
  'terms.html',
  'privacy-policy.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'variables.scss',
  'styles',
  'scripts/main.js',
  'assets',
];

let lastSignature = '';

function collectFiles(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return [];
  if (fs.statSync(absolutePath).isFile()) return [absolutePath];

  return fs.readdirSync(absolutePath, { withFileTypes: true }).flatMap((entry) =>
    collectFiles(path.join(relativePath, entry.name))
  );
}

function sourceSignature() {
  return watchedPaths
    .flatMap(collectFiles)
    .map((filePath) => `${filePath}:${fs.statSync(filePath).mtimeMs}`)
    .join('|');
}

function rebuildIfNeeded() {
  const signature = sourceSignature();
  if (signature === lastSignature) return;

  execFileSync(process.execPath, [buildScript], { cwd: root, stdio: 'inherit' });
  lastSignature = signature;
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

http.createServer((request, response) => {
  try {
    rebuildIfNeeded();

    const requestPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const filePath = path.resolve(dist, relativePath);

    if (!filePath.startsWith(`${dist}${path.sep}`) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500);
    response.end('Build failed. Check the terminal for details.');
    console.error(error);
  }
}).listen(port, () => {
  console.log(`Guestlst dev server running at http://localhost:${port}`);
});