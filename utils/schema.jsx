import { integer, numeric, pgTable, serial, varchar } from 'drizzle-orm/pg-core'; // Added varchar import

// creating table called (budgets) in neon/drizzle database
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: varchar('amount').notNull(),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull()
});

// creating table called (Expenses) in neon/drizzle database
export const Expenses = pgTable('Expense', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull().default(0),
  // forign key
  budgetsId: integer('budgetsId').references(()=>budgets.id),
  createdAt: varchar('createdAt').notNull()
});
