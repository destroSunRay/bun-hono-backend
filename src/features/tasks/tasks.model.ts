import { necessaryColumns } from '@/utils/db/commonColumns';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  ...necessaryColumns,
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
});

export default tasks;
