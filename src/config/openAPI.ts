import packageJSON from "../../package.json";
import env from "./env";

export default {
  openapi: "3.1.1",
  info: {
    title: "My API",
    version: packageJSON.version,
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}`,
    },
  ],
  components: {
    securitySchemes: {
      apiKeyCookie: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Authentication cookie for session management",
      },
    },
  },
  security: [
    {
      apiKeyCookie: [],
    },
  ],
};
