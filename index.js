const port = 8010;
const sqlite3 = require('sqlite3').verbose();
require('./winston');

const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const xenditApp = require('./src/app');

db.serialize(() => {
  buildSchemas(db);

  const app = xenditApp(db);

  app.listen(port, () => console.log(`App started and listening on port ${port}`));
});
