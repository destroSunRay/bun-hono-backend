import { z } from 'zod';

import { CreateRouteControllers } from '@/lib/hono-openapi/openapi-route-controller';
import { tasks } from './tasks.model';

export const tasksRoutes = new CreateRouteControllers('tasks', tasks, {
  routeConfig: {
    tags: ['Tasks'],
  },
});

const { selectSchema, insertSchema, patchSchema } = tasksRoutes.getSchemas;

export type TaskSelectSchema = z.infer<typeof selectSchema>;
export type TaskInsertSchema = z.infer<typeof insertSchema>;
export type TaskPatchSchema = z.infer<typeof patchSchema>;

export default tasksRoutes.router;
