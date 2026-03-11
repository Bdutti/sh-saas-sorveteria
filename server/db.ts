import { eq, and, desc, gte, lte, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  customers,
  sales,
  saleItems,
  cashTransactions,
  productCategories,
  stockAlerts,
  backups,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getProductsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.userId, userId));
}

export async function getProductById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.id, id), eq(products.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Customer queries
export async function getCustomersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customers).where(eq(customers.userId, userId));
}

export async function getCustomerById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Sales queries
export async function getSalesByUserId(userId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(sales)
    .where(eq(sales.userId, userId))
    .orderBy(desc(sales.saleDate))
    .limit(limit)
    .offset(offset);
}

export async function getSaleById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(sales)
    .where(and(eq(sales.id, id), eq(sales.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Sale items queries
export async function getSaleItemsBySaleId(saleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(saleItems).where(eq(saleItems.saleId, saleId));
}

// Cash transactions queries
export async function getCashTransactionsByUserId(
  userId: number,
  limit = 50,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(cashTransactions)
    .where(eq(cashTransactions.userId, userId))
    .orderBy(desc(cashTransactions.transactionDate))
    .limit(limit)
    .offset(offset);
}

// Product categories queries
export async function getProductCategoriesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(productCategories)
    .where(eq(productCategories.userId, userId));
}

// Stock alerts queries
export async function getStockAlertsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(stockAlerts)
    .where(and(eq(stockAlerts.userId, userId), eq(stockAlerts.status, "active")));
}

// Backup queries
export async function getBackupsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(backups)
    .where(eq(backups.userId, userId))
    .orderBy(desc(backups.createdAt));
}
