module.exports = (port) => ({
  swaggerDefinition: {
    info: {
      description: 'Xendit Coding Exercise',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: `localhost:${port}`,
    produces: [
      'application/json'
    ],
    schemes: ['http']
  },
  basedir: __dirname,
  files: ['./src/app.js']
});
