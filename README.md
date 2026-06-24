# OneCart (AAPKI APPNI DUKAN)

An e-commerce web application built with **Node.js + Express + EJS**.

## Features
- **Home page** with the title `OneCart (AAPKI APPNI DUKAN)` and a **Login** button at the top-right corner.
- **Category bar**: Clothes, Accessories, Electronic appliances, Grocery, Home Decor.
- **Product suggestions** grid below the category bar.
- Clicking a product opens its **product page in a new tab** (`target="_blank"`).
- **Login page** (centered card) with validation:
  - **Username** must be an email id — it must contain `@`, otherwise an error is shown.
  - **Password** must contain at least one **uppercase**, one **lowercase**, and one **special character**.
  - Validation runs both client-side (`public/js/login.js`) and server-side (`server.js`).

## Project structure
```
new1/
├── server.js                  # Express app & routes
├── package.json
├── views/                     # EJS templates (index, login, product, partials)
├── public/                    # static assets (css, js)
├── test/smoke.test.js         # dependency-free smoke test (npm test)
├── Dockerfile                 # multi-stage container build
├── .dockerignore
├── .npmrc                     # Nexus npm registry config (template)
└── .github/workflows/ci-cd.yml
```

## Run locally
```bash
npm install
npm start          # http://localhost:3000
npm test           # smoke tests
```

> Note: the committed `.npmrc` points at a placeholder Nexus host. For a plain
> local install without Nexus, run:
> `npm install --registry https://registry.npmjs.org/`

## Docker
```bash
docker build -t onecart .
docker run -p 3000:3000 onecart
```

## Nexus Repository Manager
`.npmrc` configures npm to use your Nexus **npm group** repo for installs and a
**npm hosted** repo for publishing. Replace `your-nexus-host:8081` with your URL.
The auth token is **not** committed — it is supplied via the `NPM_TOKEN`
environment variable (a GitHub secret in CI).

## CI/CD (GitHub Actions)
`.github/workflows/ci-cd.yml` has three jobs:
1. **build-and-test** – installs deps from Nexus and runs `npm test`.
2. **publish-to-nexus** – publishes the package to the Nexus hosted npm repo.
3. **docker-build-push** – builds the image and pushes it to your Docker registry.

### Required GitHub secrets
| Secret | Description |
|---|---|
| `NEXUS_REGISTRY` | Nexus npm **group** URL (for installs) |
| `NEXUS_PUBLISH_REGISTRY` | Nexus npm **hosted** URL (for publish) |
| `NEXUS_NPM_TOKEN` | Nexus npm bearer token |
| `DOCKER_REGISTRY` | Docker registry host |
| `DOCKER_USERNAME` / `DOCKER_PASSWORD` | Docker registry credentials |
