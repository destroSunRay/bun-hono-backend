import { createRoute } from '@hono/zod-openapi';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import z, { ZodObject } from 'zod';

import * as HttpStatus from '@/utils/consts/http-status-codes';
import * as HttpPhrases from '@/utils/consts/http-status-phrases';
import jsonContent, {
  successJsonContent,
} from '@/utils/hono-zod-openapi/helpers/json-content';
import IdParamsSchema from '@/utils/hono-zod-openapi/schemas/id-param-schema';
import createErrorSchema from '@/utils/hono-zod-openapi/schemas/create-error-schema';

export class OpenAPIRouteConfig {
  // Static properties
  static selectSchemaOmitColumns = {
    organizationId: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    created_by: true,
    updated_by: true,
    deleted_by: true,
  } as const;

  static insertSchemaOmitColumns = {
    id: true,
    ...OpenAPIRouteConfig.selectSchemaOmitColumns,
  } as const;

  // Private properties
  private entity: string;
  private table: PgTableWithColumns<any>;
  private tags: string[];
  private schemas!: {
    selectSchema: ZodObject<any>;
    patchSchema: ZodObject<any>;
    insertSchema: ZodObject<any>;
  };

  // Public methods
  public get getSchemas() {
    return this.schemas;
  }

  constructor(
    entity: string,
    table: PgTableWithColumns<any>,
    options?: {
      tags?: string[];
      entitySchemas?: {
        selectSchema?: ZodObject<any>;
        insertSchema?: ZodObject<any>;
        patchSchema?: ZodObject<any>;
      };
    }
  ) {
    this.entity = entity;
    this.tags = options?.tags
      ? Array.from(
          new Set([
            entity.charAt(0).toUpperCase() + entity.slice(1),
            ...options.tags,
          ])
        )
      : [entity];
    this.table = table;
    this.generateSchemas(options?.entitySchemas);
  }

  private generateSchemas(entitySchemas?: {
    selectSchema?: ZodObject<any>;
    insertSchema?: ZodObject<any>;
    patchSchema?: ZodObject<any>;
  }) {
    const selectSchema =
      entitySchemas?.selectSchema ||
      createSelectSchema(this.table).omit({
        ...OpenAPIRouteConfig.selectSchemaOmitColumns,
      });
    const insertSchema =
      entitySchemas?.insertSchema ||
      createInsertSchema(this.table).omit({
        ...OpenAPIRouteConfig.insertSchemaOmitColumns,
      });
    const patchSchema = entitySchemas?.patchSchema || insertSchema.partial();

    this.schemas = {
      selectSchema,
      insertSchema,
      patchSchema,
    };
  }
  // GET / Route
  public getAllRoute = () =>
    createRoute({
      path: `/${this.entity}`,
      method: 'get',
      tags: this.tags,
      summary: `Get all ${this.entity}`,
      request: {
        query: z.object({
          limit: z.coerce
            .number()
            .min(1)
            .max(100)
            .optional()
            .default(50)
            .openapi({
              param: {
                name: 'limit',
                in: 'query',
                required: false,
              },
              example: 50,
            }),
          pageNumber: z.coerce
            .number()
            .min(0)
            .optional()
            .default(1)
            .openapi({
              param: {
                name: 'pageNumber',
                in: 'query',
                required: false,
              },
              example: 1,
            }),
        }),
      },
      description: `Retrieve a list of all ${this.entity}`,
      responses: {
        [HttpStatus.OK]: successJsonContent(
          z.array(this.schemas.selectSchema),
          'List of all entities',
          { pagination: true }
        ),
        [HttpStatus.UNAUTHORIZED]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: 'Unauthorized. You are not logged in.',
            }),
          }),
          HttpPhrases.UNAUTHORIZED
        ),
        [HttpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
          createErrorSchema(
            z.object({
              limit: z.number().min(1).max(100).optional(),
              pageNumber: z.number().min(0).optional(),
              totalNumberOfPages: z.number().min(0).optional(),
            })
          ),
          'The validation error(s)'
        ),
      },
    });

  // GET /{id} Route
  public getByIdRoute = () =>
    createRoute({
      path: `/${this.entity}/{id}`,
      method: 'get',
      tags: this.tags,
      summary: `Get ${this.entity} by ID`,
      description: `Retrieve a single ${this.entity} by its ID`,
      request: {
        params: IdParamsSchema,
      },
      responses: {
        [HttpStatus.OK]: successJsonContent(
          this.schemas.selectSchema,
          'The requested entity'
        ),
        [HttpStatus.NOT_FOUND]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: `The requested ${this.entity} was not found.`,
            }),
          }),
          HttpPhrases.NOT_FOUND
        ),
        [HttpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
          createErrorSchema(this.schemas.selectSchema).or(
            createErrorSchema(IdParamsSchema)
          ),
          'The validation error(s)'
        ),
        [HttpStatus.UNAUTHORIZED]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: 'Unauthorized. You are not logged in.',
            }),
          }),
          HttpPhrases.UNAUTHORIZED
        ),
      },
    });

  // PATCH /{id} Route
  public patchByIdRoute = () =>
    createRoute({
      path: `/${this.entity}/{id}`,
      method: 'patch',
      tags: this.tags,
      summary: `Update ${this.entity} by ID`,
      description: `Update a single ${this.entity} by its ID`,
      request: {
        params: IdParamsSchema,
        body: jsonContent(
          this.schemas.patchSchema,
          `Patch data for ${this.entity}`
        ),
      },
      responses: {
        [HttpStatus.OK]: successJsonContent(
          this.schemas.selectSchema,
          'The updated entity'
        ),
        [HttpStatus.NOT_FOUND]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: `The requested ${this.entity} was not found.`,
            }),
          }),
          HttpPhrases.NOT_FOUND
        ),
        [HttpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
          createErrorSchema(this.schemas.selectSchema).or(
            createErrorSchema(IdParamsSchema)
          ),
          'The validation error(s)'
        ),
        [HttpStatus.UNAUTHORIZED]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: 'Unauthorized. You are not logged in.',
            }),
          }),
          HttpPhrases.UNAUTHORIZED
        ),
      },
    });

  // POST / Route
  public postRoute = () =>
    createRoute({
      path: `/${this.entity}`,
      method: 'post',
      tags: this.tags,
      summary: `Create a new ${this.entity}`,
      description: `Create a new ${this.entity}`,
      request: {
        body: jsonContent(
          this.schemas.insertSchema,
          `The ${this.entity} to create`
        ),
      },
      responses: {
        [HttpStatus.CREATED]: successJsonContent(
          this.schemas.selectSchema,
          'The created entity'
        ),
        [HttpStatus.UNPROCESSABLE_ENTITY]: jsonContent(
          createErrorSchema(this.schemas.insertSchema),
          'The validation error(s)'
        ),
        [HttpStatus.UNAUTHORIZED]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: 'Unauthorized. You are not logged in.',
            }),
          }),
          HttpPhrases.UNAUTHORIZED
        ),
      },
    });

  // DELETE /{id} Route
  public deleteByIdRoute = () =>
    createRoute({
      path: `/${this.entity}/{id}`,
      method: 'delete',
      tags: this.tags,
      summary: `Delete ${this.entity} by ID`,
      description: `Delete a single ${this.entity} by its ID`,
      request: {
        params: IdParamsSchema,
      },
      responses: {
        [HttpStatus.NO_CONTENT]: {
          description: 'No Content',
        },
        [HttpStatus.NOT_FOUND]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: `The requested ${this.entity} was not found.`,
            }),
          }),
          HttpPhrases.NOT_FOUND
        ),
        [HttpStatus.UNAUTHORIZED]: jsonContent(
          z.object({
            success: z.literal(false),
            error: z.string().openapi({
              example: 'Unauthorized. You are not logged in.',
            }),
          }),
          HttpPhrases.UNAUTHORIZED
        ),
      },
    });
}
