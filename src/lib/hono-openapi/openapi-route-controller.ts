import type { PgTableWithColumns } from 'drizzle-orm/pg-core';
import z, { ZodObject } from 'zod';
import { and, count, eq, isNull, getTableColumns, Column } from 'drizzle-orm';

import { db } from '@/db';
import { OpenAPIRouteConfig } from './openapi-route-config';
import { createRouter } from '../createApp';
import { AppOpenAPI, AppRouteHandler } from '@/utils/hono-zod-openapi/types';
import * as HttpStatus from '@/utils/consts/http-status-codes';
import logger from '@/services/log.service';

export class CreateRouteControllers {
  // Static methods
  /** Common where clause for soft-deleted records and organization filtering */
  static commonWhereClause = (
    table: PgTableWithColumns<any>,
    organizationId: string
  ) => {
    return [isNull(table.deleted_at), eq(table.organizationId, organizationId)];
  };

  // Private properties
  private openAPIRouteConfig: OpenAPIRouteConfig;
  private table: PgTableWithColumns<any>;
  private entity: string;
  private schemas: {
    selectSchema: ZodObject<any>;
    patchSchema: ZodObject<any>;
    insertSchema: ZodObject<any>;
  };
  private dependentEntities: PgTableWithColumns<any>[] = [];
  private disableRouteCreation: {
    getAll?: boolean;
    getById?: boolean;
    post?: boolean;
    patchById?: boolean;
    deleteById?: boolean;
  } = {};

  // Public properties
  public router!: AppOpenAPI;
  public get getSchemas() {
    return this.schemas;
  }

  constructor(
    entity: string,
    table: PgTableWithColumns<any>,
    options?: {
      router?: AppOpenAPI;
      routeConfig?: {
        tags?: string[];
        dependentEntities?: PgTableWithColumns<any>[];
        disableRouteCreation?: {
          getAll?: boolean;
          getById?: boolean;
          post?: boolean;
          patchById?: boolean;
          deleteById?: boolean;
        };
        entitySchemas?: {
          selectSchema?: ZodObject<any>;
          insertSchema?: ZodObject<any>;
          patchSchema?: ZodObject<any>;
        };
      };
    }
  ) {
    this.table = table;
    this.entity = entity;
    this.openAPIRouteConfig = new OpenAPIRouteConfig(
      entity,
      table,
      options?.routeConfig
    );
    this.router = options?.router || createRouter();
    this.dependentEntities = options?.routeConfig?.dependentEntities || [];
    this.disableRouteCreation =
      options?.routeConfig?.disableRouteCreation || {};
    // Use provided schemas or generate from table columns
    this.schemas = {
      selectSchema:
        options?.routeConfig?.entitySchemas?.selectSchema ||
        this.openAPIRouteConfig.getSchemas.selectSchema,
      insertSchema:
        options?.routeConfig?.entitySchemas?.insertSchema ||
        this.openAPIRouteConfig.getSchemas.insertSchema,
      patchSchema:
        options?.routeConfig?.entitySchemas?.patchSchema ||
        this.openAPIRouteConfig.getSchemas.patchSchema,
    };
    this.createRouteHandlers();
  }

  private createRouteHandlers() {
    // GET all route handler
    const getAllRouteConfig = this.openAPIRouteConfig.getAllRoute();

    const getAllRouteHandler: AppRouteHandler<
      typeof getAllRouteConfig
    > = async (c) => {
      const { organizationId } = c.var;
      const { limit, pageNumber } = c.req.valid('query');
      const [items, totalCount] = await Promise.all([
        db
          .select()
          .from(this.table)
          .where(
            and(
              ...CreateRouteControllers.commonWhereClause(
                this.table,
                organizationId!
              )
            )
          )
          .offset((pageNumber - 1) * limit)
          .limit(limit),
        db
          .select({ totalCount: count() })
          .from(this.table)
          .where(
            and(
              ...CreateRouteControllers.commonWhereClause(
                this.table,
                organizationId!
              )
            )
          ),
      ]);
      const result = {
        success: true,
        data: z.array(this.schemas.selectSchema).parse(items),
        pagination: {
          totalPages: Math.ceil(totalCount[0].totalCount / limit),
          page: pageNumber,
          limit: limit,
        },
      };
      return c.json(result, HttpStatus.OK);
    };

    // GET by ID route handler
    const getByIdRouteConfig = this.openAPIRouteConfig.getByIdRoute();

    const getByIdRouteHandler: AppRouteHandler<
      typeof getByIdRouteConfig
    > = async (c) => {
      const { id } = c.req.valid('param');
      const item = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.id, id),
            ...CreateRouteControllers.commonWhereClause(
              this.table,
              c.var.organizationId!
            )
          )
        )
        .limit(1);
      if (item.length === 0) {
        return c.json(
          { success: false, error: `${this.entity} not found` },
          HttpStatus.NOT_FOUND
        );
      }
      const result = {
        success: true,
        data: this.schemas.selectSchema.parse(item[0]),
      };
      return c.json(result, HttpStatus.OK);
    };

    // POST route handler
    const postRouteConfig = this.openAPIRouteConfig.postRoute();

    const postRouteHandler: AppRouteHandler<typeof postRouteConfig> = async (
      c
    ) => {
      const newItem = c.req.valid('json');
      const { organizationId, userId } = c.var;
      const result = await db
        .insert(this.table)
        .values({
          ...newItem,
          organizationId,
          createdBy: userId,
          updatedBy: userId,
        })
        .returning();
      const response = {
        success: true,
        data: this.schemas.selectSchema.parse(result[0]),
      };
      return c.json(response, HttpStatus.CREATED);
    };

    // PATCH by ID route handler
    const patchByIdRouteConfig = this.openAPIRouteConfig.patchByIdRoute();

    const patchByIdRouteHandler: AppRouteHandler<
      typeof patchByIdRouteConfig
    > = async (c) => {
      const { id } = c.req.valid('param');
      const { organizationId, userId } = c.var;
      const patchData = c.req.valid('json');

      const item = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.id, id),
            ...CreateRouteControllers.commonWhereClause(
              this.table,
              organizationId!
            )
          )
        )
        .limit(1);
      if (item.length === 0) {
        return c.json(
          { success: false, error: `${this.entity} not found` },
          HttpStatus.NOT_FOUND
        );
      }
      const updatedData = { ...item[0], ...patchData };
      const result = await db
        .update(this.table)
        .set({ ...updatedData, updated_by: userId })
        .where(eq(this.table.id, id))
        .returning();
      const response = {
        success: true,
        data: this.schemas.selectSchema.parse(result[0]),
      };
      return c.json(response, HttpStatus.OK);
    };

    // DELETE by ID route handler
    const deleteByIdRouteConfig = this.openAPIRouteConfig.deleteByIdRoute();

    const deleteByIdRouteHandler: AppRouteHandler<
      typeof deleteByIdRouteConfig
    > = async (c) => {
      const { id } = c.req.valid('param');
      const { organizationId, userId } = c.var;
      const item = await db
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.id, id),
            ...CreateRouteControllers.commonWhereClause(
              this.table,
              organizationId!
            )
          )
        )
        .limit(1);
      if (item.length === 0) {
        return c.json(
          { success: false, error: `${this.entity} not found` },
          HttpStatus.NOT_FOUND
        );
      }
      const entityId = `${this.entity.slice(0, -1)}Id`;
      await Promise.all([
        db
          .update(this.table)
          .set({ deleted_at: new Date(), deleted_by: userId })
          .where(
            and(
              eq(this.table.id, id),
              ...CreateRouteControllers.commonWhereClause(
                this.table,
                organizationId!
              )
            )
          ),
        ...(this.dependentEntities
          .filter((depEntity) =>
            getTableColumns(depEntity).some(
              (col: Column) => col.name === entityId
            )
          )
          .map((depEntity) =>
            db
              .update(depEntity)
              .set({ deleted_at: new Date(), deleted_by: userId })
              .where(
                and(
                  eq(depEntity[entityId], id),
                  ...CreateRouteControllers.commonWhereClause(
                    depEntity,
                    organizationId!
                  )
                )
              )
          ) || []),
      ]);
      return c.body(null, HttpStatus.NO_CONTENT);
    };

    // Assign route handlers to route configs
    if (!this.disableRouteCreation.getAll) {
      this.router.openapi(getAllRouteConfig, getAllRouteHandler);
    }
    if (!this.disableRouteCreation.getById) {
      this.router.openapi(getByIdRouteConfig, getByIdRouteHandler);
    }
    if (!this.disableRouteCreation.post) {
      this.router.openapi(postRouteConfig, postRouteHandler);
    }
    if (!this.disableRouteCreation.patchById) {
      this.router.openapi(patchByIdRouteConfig, patchByIdRouteHandler);
    }
    if (!this.disableRouteCreation.deleteById) {
      this.router.openapi(deleteByIdRouteConfig, deleteByIdRouteHandler);
    }

    logger.debug(`Routes created for entity: ${this.entity}`);
  }
}
