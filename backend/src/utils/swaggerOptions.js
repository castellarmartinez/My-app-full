const { module: config } = require("../config");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "My APP Live",
      version: "1.0.0",
      description: "Third proyect for Acamica's Backend Bootcamp.",
    },

    servers: [
      {
        url: config.URL_HOST,
        description: "Local server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

module.exports = swaggerOptions;
