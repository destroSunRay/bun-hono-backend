import { relations } from 'drizzle-orm';

import { tasks } from './tasks.model';
import { commonRelations } from '@/utils/db/commonRelations';

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  ...commonRelations(one, tasks),
}));
