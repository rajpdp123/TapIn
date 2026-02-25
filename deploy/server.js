const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// In Railway, the HTML is copied into the deploy folder during build
// Locally, it references the parent directory
const htmlPath = fs.existsSync(path.join(__dirname, 'index.html'))
  ? path.join(__dirname, 'index.html')
  : path.join(__dirname, '..', 'tapin-prototype-standalone.html');

const html = fs.readFileSync(htmlPath, 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache',
  });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`TapIn PWA running on port ${PORT}`);
});
