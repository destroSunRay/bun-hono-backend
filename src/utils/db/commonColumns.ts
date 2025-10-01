import {
  serial,
  integer,
  text,
  timestamp,
  pgTable,
  PgTableWithColumns,
  PgTable,
} from "drizzle-orm/pg-core";
import { user, organization } from "../../features/auth/auth.model";

const id = serial("id").primaryKey();
export const userId = text("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" });
export const organizationId = text("organization_id")
  .notNull()
  .references(() => organization.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  });

const created_at = timestamp("created_at", { withTimezone: true })
  .defaultNow()
  .notNull();
const updated_at = timestamp("updated_at", { withTimezone: true })
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull();
const deleted_at = timestamp("deleted_at", { withTimezone: true });

const created_by = text("created_by").references(() => user.id);
const updated_by = text("updated_by").references(() => user.id);
const deleted_by = text("deleted_by").references(() => user.id);

export const necessaryColumns = {
  id,
  organizationId,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by,
};

export const pgTableWithNecessaryColumns = pgTable("your_table_name", {
  ...necessaryColumns,
});
