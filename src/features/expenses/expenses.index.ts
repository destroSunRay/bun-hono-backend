import { CreateRouteControllers } from '@/lib/hono-openapi/openapi-route-controller';
import { expenses } from './expenses.model';

export const expensesRoutes = new CreateRouteControllers('expenses', expenses);
