const fs = require('fs');
const path = require('path');
const swaggerSpec = require('../src/config/swagger');

const outputDir = path.join(__dirname, '..', 'docs');
const outputFile = path.join(outputDir, 'openapi.json');

const defaultBackendUrl = process.env.OPENAPI_SERVER_URL || 'http://localhost:5000';

const docsServers = [
	{
		url: '{backendUrl}/api/v1',
		description: 'Backend URL (editable in Swagger UI)',
		variables: {
			backendUrl: {
				default: defaultBackendUrl,
				description: 'Set this to your running backend URL'
			}
		}
	}
];

const docsSpec = {
	...swaggerSpec,
	// Static docs on GitHub Pages need absolute API server URLs.
	servers: docsServers
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(docsSpec, null, 2)}\n`);

console.log(`OpenAPI spec generated at ${outputFile}`);
