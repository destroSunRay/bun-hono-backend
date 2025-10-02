import { expensesRoutes } from '@/features/expenses/expenses.index';
import { tasksRoutes } from '@/features/tasks/tasks.index';

export default [tasksRoutes.router, expensesRoutes.router] as const;
