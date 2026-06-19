import swaggerJSDoc from "swagger-jsdoc";
import config from "./config";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blogger",
      version: "1.0.0",
      description: "Blogging platform API documentation",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication and registration" },
      { name: "Blogs", description: "Blogging Endpoints" },
    ],
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
