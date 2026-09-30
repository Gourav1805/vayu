const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const APP_ROUTES = new Map([
  ['/overview', '/index.html'],
  ['/netra', '/pages/live-nowcast.html'],
  ['/netra/', '/pages/live-nowcast.html'],
  ['/live-nowcast', '/pages/live-nowcast.html'],
  ['/live-nowcast/', '/pages/live-nowcast.html'],
  ['/storm-intelligence', '/pages/vayu-app.html'],
  ['/initiation', '/pages/vayu-app.html'],
  ['/forecasts', '/pages/vayu-app.html'],
  ['/atmospheric-intelligence', '/pages/vayu-app.html'],
  ['/analytics', '/pages/vayu-app.html'],
  ['/provenance', '/pages/vayu-app.html'],
  ['/reports', '/pages/vayu-app.html'],
  ['/settings', '/pages/vayu-app.html'],
  ['/fusion', '/pages/vayu-app.html'],
  ['/ravi', '/pages/vayu-app.html'],
  ['/replay', '/pages/vayu-app.html']
]);

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (APP_ROUTES.has(reqPath)) {
    reqPath = APP_ROUTES.get(reqPath);
  }

  const filePath = path.join(BASE_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Aggressive caching for WebP animation frames, no-cache for html/css/js
    const headers = { 'Content-Type': contentType };
    if (ext === '.webp') {
      headers['Cache-Control'] = 'public, max-age=86400, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }

    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`DEVLOK / VAYU demo server running at http://localhost:${PORT} (original SatQuery experience at /satquery.html)`);
});
