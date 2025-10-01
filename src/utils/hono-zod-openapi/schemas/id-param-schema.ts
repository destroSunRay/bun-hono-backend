import { z } from "@hono/zod-openapi";

const IdParamsSchema = z.object({
  id: z.coerce
    .number()
    .min(1)
    .openapi({
      param: {
        name: "id",
        in: "path",
        required: true,
      },
      required: ["id"],
      example: 42,
    }),
});

export default IdParamsSchema;
