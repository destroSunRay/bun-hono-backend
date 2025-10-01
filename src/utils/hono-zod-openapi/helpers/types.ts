// import type { z } from "@hono/zod-openapi";
import { z } from "zod";

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodObject>;

export type ZodIssue = z.core.$ZodIssue;
export type ZodError = z.core.$ZodError;
