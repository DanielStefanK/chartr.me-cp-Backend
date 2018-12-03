# GraphQL-API

### running in dev

- copy the content of the `sample.env` to an `.env` file
- change the content of the `.env` file to you enviroment
- run `npm install`
- run `npm run dev`
- dev server is avalable on `localhost:4000`

---

### Deploying a new datamodel

- change `datamodel.prisma` to your needs
- run `npm run deploy` (`.env` file must be present and must have valid data)
  - if post deploy hook fails run `graphql get-schema -p prisma` maually

---

### Commiting

- if your editor does not format on save please run `npm run lint` before commiting
- fix all errors occure on the linting proccess

### Deploying a prisma server

- Requirements:
  - `docker`
  - `docker-compose`
- uncomment the line with `# managementApiSecret: geheim` and enter a solid secret
- the secret must equal the equal `PRISMA_MANAGEMENT_API_SECRET` in your `.env` file
- run `docker-compose up -d` (`docker-compose up -d -f ./docker-compose.traefik.yml` when using a traefik proxy)
- server should be awailable on port `4466` (or on the traefik frontend)
- (TODO: use external DB)

---
