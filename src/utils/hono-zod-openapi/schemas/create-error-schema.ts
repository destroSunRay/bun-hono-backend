import { z } from "@hono/zod-openapi";

import type { ZodIssue, ZodSchema } from "../helpers/types.ts";

const createErrorSchema = <T extends ZodSchema>(schema: T) => {
  let invalidInput: unknown = {};
  if (schema.def.type === "array" && "element" in schema) {
    // @ts-expect-error: element may not exist on all schemas
    invalidInput = [schema.element.def.type === "string" ? 123 : "invalid"];
  }
  const { error } = schema.safeParse(invalidInput);

  const example = error
    ? {
        name: error.name,
        issues: error.issues.map((issue: ZodIssue) => ({
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          })
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
};

export default createErrorSchema;
