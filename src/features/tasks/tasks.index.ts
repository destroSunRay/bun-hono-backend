import { CreateRouteControllers } from '@/lib/hono-openapi/openapi-route-controller';
import { tasks } from './tasks.model';

export const tasksRoutes = new CreateRouteControllers('tasks', tasks, {
  routeConfig: {
    tags: ['Tasks'],
  },
});
