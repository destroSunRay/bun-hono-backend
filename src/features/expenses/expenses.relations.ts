import { relations } from 'drizzle-orm';

import { expenses } from './expenses.model';
import { commonRelations } from '@/utils/db/commonRelations';

export const expensesRelations = relations(expenses, ({ one, many }) => ({
  ...commonRelations(one, expenses),
  // TODO: Define your relations here
}));
