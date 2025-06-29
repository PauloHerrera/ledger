import { eq } from "drizzle-orm";
import type { Database } from "../db";

export interface IBaseRepository<T, NewT extends Record<string, any>> {
  create(data: NewT): Promise<T>;
  findById(id: string): Promise<T>;
  findAll(): Promise<T[]>;
}

export class BaseRepository<T, NewT extends Record<string, any>>
  implements IBaseRepository<T, NewT>
{
  constructor(
    protected db: Database,
    protected table: any // drizzle table schema
  ) {}

  async create(data: NewT): Promise<T> {
    const result = await this.db.insert(this.table).values(data).returning();
    return result[0] as T;
  }

  async findById(id: string): Promise<T> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return result[0] as T;
  }

  async findAll(): Promise<T[]> {
    const result = await this.db.select().from(this.table);
    return result as T[];
  }
}
