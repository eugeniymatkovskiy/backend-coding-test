const port = 8010;
const sqlite3 = require('sqlite3').verbose();
const expressSwaggerGen = require('express-swagger-generator');
require('./winston');

const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const xenditApp = require('./src/app');
const swaggerConf = require('./swagger');

db.serialize(() => {
  buildSchemas(db);

  const app = xenditApp(db);
  const expressSwagger = expressSwaggerGen(app);
  // please use /api-docs for getting swagger explanation
  expressSwagger(swaggerConf(port));

  app.listen(port, () => console.log(`App started and listening on port ${port}`));
});
