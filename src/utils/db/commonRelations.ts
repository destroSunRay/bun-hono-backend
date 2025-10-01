import { user, organization } from "../../features/auth/auth.model";
import { PgTableWithColumns } from "drizzle-orm/pg-core";

export const commonRelations = (
  one: Function,
  table: PgTableWithColumns<any>
) => ({
  organization: one(organization, {
    fields: [table.organizationId],
    references: [organization.id],
  }),
  created_by: one(user, {
    fields: [table.created_by],
    references: [user.id],
  }),
  updated_by: one(user, {
    fields: [table.updated_by],
    references: [user.id],
  }),
  deleted_by: one(user, {
    fields: [table.deleted_by],
    references: [user.id],
  }),
});
