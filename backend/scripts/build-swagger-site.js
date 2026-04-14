const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const sourceSpec = path.join(docsDir, 'openapi.json');
const siteDir = path.join(__dirname, '..', 'docs-site');
const targetSpec = path.join(siteDir, 'openapi.json');
const indexFile = path.join(siteDir, 'index.html');
const noJekyllFile = path.join(siteDir, '.nojekyll');

if (!fs.existsSync(sourceSpec)) {
  console.error('Missing docs/openapi.json. Run "npm run docs:codegen" first.');
  process.exit(1);
}

fs.mkdirSync(siteDir, { recursive: true });
fs.copyFileSync(sourceSpec, targetSpec);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ClipSphere API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: './openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          displayRequestDuration: true,
          persistAuthorization: true
        });
      };
    </script>
  </body>
</html>
`;

fs.writeFileSync(indexFile, html);
fs.writeFileSync(noJekyllFile, '');

console.log(`Static Swagger site generated at ${siteDir}`);
