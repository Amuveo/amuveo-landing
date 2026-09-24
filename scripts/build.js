const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'styles'), { recursive: true });
fs.mkdirSync(path.join(dist, 'scripts'), { recursive: true });
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
fs.copyFileSync(path.join(root, 'terms.html'), path.join(dist, 'terms.html'));
fs.copyFileSync(path.join(root, 'privacy-policy.html'), path.join(dist, 'privacy-policy.html'));
fs.copyFileSync(path.join(root, '404.html'), path.join(dist, '404.html'));
fs.copyFileSync(path.join(root, 'robots.txt'), path.join(dist, 'robots.txt'));
fs.copyFileSync(path.join(root, 'sitemap.xml'), path.join(dist, 'sitemap.xml'));
fs.copyFileSync(path.join(root, 'scripts', 'main.js'), path.join(dist, 'scripts', 'main.js'));

const sassEntrypoint = path.join(root, 'node_modules', 'sass', 'sass.js');
execFileSync(process.execPath, [sassEntrypoint,
  'styles/main.scss', 'dist/styles/main.css', '--style=compressed', '--no-source-map'
], { cwd: root, stdio: 'inherit' });

console.log('Guestlst landing page built in dist/');