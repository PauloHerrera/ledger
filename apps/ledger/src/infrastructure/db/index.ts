import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { account, accountRelations } from "./schemas/account";
import { entry } from "./schemas/entry";
import { journal, journalRelations } from "./schemas/journal";
import { ledger } from "./schemas/ledger";
import { transaction, transactionRelations } from "./schemas/transaction";
import {
  transactionEntries,
  transactionEntryRelations,
} from "./schemas/transactionEntry";

const schema = {
  account,
  accountRelations,
  entry,
  journal,
  journalRelations,
  ledger,
  transaction,
  transactionRelations,
  transactionEntries,
  transactionEntryRelations,
};

const connStr = process.env.DATABASE_URL;

if (!connStr) {
  throw new Error("DATABASE_URL is not set");
}

export const client = postgres(connStr, { prepare: false });

export const db = drizzle(client, { schema });

export type Database = typeof db;
