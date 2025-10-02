#!/bin/bash

feature_name=$1
feature_path="src/features/$feature_name"

# Check if feature name is provided
if [ -z "$feature_name" ]; then
  echo "Feature name is required"
  exit 1
fi

# Check if feature already exists
if [ -d "$feature_path" ]; then
  echo "Feature '$feature_name' already exists"
  exit 1
fi

# Create feature directory and index.ts file
mkdir -p "$feature_path"

touch "$feature_path/$feature_name.index.ts"
touch "$feature_path/$feature_name.model.ts"
touch "$feature_path/$feature_name.relations.ts"
touch "$feature_path/$feature_name.zod-schemas.ts"
touch "$feature_path/$feature_name.openapi.ts"
touch "$feature_path/$feature_name.controllers.ts"
touch "$feature_path/$feature_name.routes.ts"
touch "$feature_path/$feature_name.services.ts"
touch "$feature_path/$feature_name.tests.ts"

# Add export to src/db/schema/index.ts
echo "\n\nexport * from \"@/features/$feature_name/$feature_name.model\";" >> src/db/schema/index.ts
echo "export * from \"@/features/$feature_name/$feature_name.relations\";" >> src/db/schema/index.ts


# Add boilerplate code to model file
echo "import { necessaryColumns } from '@/utils/db/commonColumns';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const ${feature_name} = pgTable('${feature_name}', {
  ...necessaryColumns,
  // TODO: Define your columns here
});

export default ${feature_name};" > "$feature_path/$feature_name.model.ts"

# Add boilerplate code to relations file
echo "import { relations } from 'drizzle-orm';

import { ${feature_name} } from './${feature_name}.model';
import { commonRelations } from '@/utils/db/commonRelations';

export const ${feature_name}Relations = relations(${feature_name}, ({ one, many }) => ({
  ...commonRelations(one, ${feature_name}),
  // TODO: Define your relations here
}));" > "$feature_path/$feature_name.relations.ts"

# Add boilerplate code to index file
echo "import { CreateRouteControllers } from '@/lib/hono-openapi/openapi-route-controller';
import { ${feature_name} } from './${feature_name}.model';

export const ${feature_name}Routes = new CreateRouteControllers('${feature_name}', ${feature_name});" > "$feature_path/$feature_name.index.ts"