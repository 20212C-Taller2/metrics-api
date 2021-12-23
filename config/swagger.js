module.exports = {
  openapi: "3.0.2",
  info: {
    version: "1.0.0",
    title: "Metrics API",
    description: "Metrics microservice API available endpoints",
    contact: {
      name: "Pablo Massuh",
      email: "pablomassuh@homtail.com ",
    },
  },
  host: "ubademy-metrics-api.herokuapp.com",
  basePath: "/",
  tags: [
    {
      name: "admin",
      description: "The following endpoints provides support for backoffice application",
    },
  ],
  paths: {
    "/service/:name": {
      get: {
        tags: ["admin"],
        summary: "Get metrics",
        description: "Get a list of all actions and count for the given service",
        parameters: [
          {
            name: "start",
            in: "query",
            schema: {
              type: "string",
              example: "2021-12-22",
            },
          },
          {
            name: "end",
            in: "query",
            schema: {
              type: "string",
              example: "2021-12-24",
            },
          },
        ],
        responses: {
          200: {
            description: "OK metrics",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResponseMetrics",
                },
              },
            },
          },
          500: {
            description: "Error: Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ResponseMetrics: {
        type: "object",
        properties: {
          metrics: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Metric",
            },
            example: [
              { operation: "user-login", count: 10 },
              { operation: "user-blocked", count: 4 },
            ],
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "the cause of the error",
            example: "There was an error with metrics.",
          },
        },
      },
      // Properties
      Metric: {
        type: "object",
        properties: {
          operation: {
            type: "string",
            example: "user-login",
          },
          count: {
            type: "integer",
            example: 5,
          },
        },
      },
    },
  },
};
