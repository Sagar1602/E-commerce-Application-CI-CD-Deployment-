// Minimal dependency-free smoke test so `npm test` works in CI without extra packages.
const assert = require('assert');
const http = require('http');

process.env.PORT = process.env.PORT || 4010;
const app = require('../server');

const server = app.listen(process.env.PORT, () => {
  runTests()
    .then(() => {
      console.log('All smoke tests passed.');
      server.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error('Smoke test failed:', err.message);
      server.close();
      process.exit(1);
    });
});

function get(pathName) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:${process.env.PORT}${pathName}`, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      })
      .on('error', reject);
  });
}

async function runTests() {
  const home = await get('/');
  assert.strictEqual(home.status, 200, 'Home page should return 200');
  assert.ok(home.body.includes('OneCart'), 'Home page should contain the title');

  const login = await get('/login');
  assert.strictEqual(login.status, 200, 'Login page should return 200');
  assert.ok(login.body.includes('Login'), 'Login page should render');

  const product = await get('/product/1');
  assert.strictEqual(product.status, 200, 'Product page should return 200');

  const health = await get('/health');
  assert.strictEqual(health.status, 200, 'Health endpoint should return 200');
}
