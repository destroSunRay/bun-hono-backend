import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import openapiConfig from "@/config/openAPI";
import { AppOpenAPI } from "@/utils/hono-zod-openapi/types";

export default function configOpenApi(app: AppOpenAPI) {
  app.doc31("/docs", openapiConfig);

  app.get(
    "/scalar",
    Scalar({
      url: "/api/docs",
      theme: "kepler",
      // layout: "classic",
      defaultHttpClient: {
        targetKey: "node",
        clientKey: "axios",
      },
    })
  );
}
