import { z } from "zod";

const jsonContent = <T extends z.ZodSchema>(
  schema: T,
  description: string,
  options?: { required?: boolean }
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required: options?.required ?? false,
  };
};

const successResponseSchema = <T extends z.ZodSchema>(
  schema: T,
  pagination: boolean = false
) => {
  return pagination
    ? z.object({
        success: z.boolean().openapi({
          example: true,
        }),
        data: schema,
        pagination: z
          .object({
            totalPages: z.number().int().min(1).openapi({ example: 10 }),
            page: z.number().int().min(1).openapi({ example: 1 }),
            limit: z.number().int().min(1).openapi({ example: 10 }),
          })
          .optional(),
      })
    : z.object({
        success: z.boolean().openapi({
          example: true,
        }),
        data: schema,
      });
};

export const successJsonContent = <T extends z.ZodSchema>(
  schema: T,
  description: string,
  options?: { required?: boolean; pagination?: boolean }
) => {
  return jsonContent(
    successResponseSchema(schema, options?.pagination),
    description,
    options
  );
};

export default jsonContent;
