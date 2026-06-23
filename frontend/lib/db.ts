// Mock db client - replace with actual Prisma or DB client
// This is a stub that prevents import errors during development

type WhereClause = Record<string, unknown>;
type SelectClause = Record<string, boolean>;
type OrderByClause = Record<string, string>;

interface FindUniqueArgs {
  where?: WhereClause;
  select?: SelectClause;
}

interface FindManyArgs {
  where?: WhereClause;
  select?: SelectClause;
  orderBy?: OrderByClause;
  skip?: number;
  take?: number;
}

interface CountArgs {
  where?: WhereClause;
}

function createModel() {
  return {
    findUnique: async (_args: FindUniqueArgs) => null,
    findMany: async (_args: FindManyArgs) => [],
    count: async (_args: CountArgs) => 0,
    create: async (args: { data: unknown }) => args.data,
    update: async (args: { data: unknown }) => args.data,
    delete: async (_args: FindUniqueArgs) => null,
  };
}

export const db = {
  user: createModel(),
  product: createModel(),
  category: createModel(),
  invoice: createModel(),
  auditLog: createModel(),
};
