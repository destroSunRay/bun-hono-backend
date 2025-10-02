import { necessaryColumns } from '@/utils/db/commonColumns';
import { date, pgTable, text } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  ...necessaryColumns,
  // TODO: Define your columns here
  title: text('title').notNull(),
  amount: text('amount').notNull(),
  category: text('category').notNull(),
  date: date('date').notNull(),
});

export default expenses;
