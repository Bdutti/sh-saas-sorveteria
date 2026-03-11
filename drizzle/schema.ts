import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Categorias de Produtos
 */
export const productCategories = mysqlTable(
  "productCategories",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_productCategories_userId").on(table.userId),
  })
);

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

/**
 * Tabela de Produtos
 */
export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    categoryId: int("categoryId").references(() => productCategories.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: int("price").notNull(), // preço de venda em centavos
    cost: int("cost"), // preço de custo em centavos
    stock: int("stock").default(0).notNull(),
    minStock: int("minStock").default(0),
    sku: varchar("sku", { length: 100 }),
    barcode: varchar("barcode", { length: 100 }),
    active: int("active").default(1).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_products_userId").on(table.userId),
    skuIdx: index("idx_products_sku").on(table.sku),
    barcodeIdx: index("idx_products_barcode").on(table.barcode),
    activeIdx: index("idx_products_active").on(table.active),
  })
);

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Tabela de Clientes (CRM)
 */
export const customers = mysqlTable(
  "customers",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 2 }),
    zipCode: varchar("zipCode", { length: 10 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_customers_userId").on(table.userId),
    emailIdx: index("idx_customers_email").on(table.email),
    phoneIdx: index("idx_customers_phone").on(table.phone),
  })
);

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

/**
 * Tabela de Vendas
 */
export const sales = mysqlTable(
  "sales",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    customerId: int("customerId").references(() => customers.id),
    totalAmount: int("totalAmount").notNull(), // em centavos
    discount: int("discount").default(0), // em centavos
    paymentMethod: mysqlEnum("paymentMethod", [
      "dinheiro",
      "cartao_credito",
      "cartao_debito",
      "pix",
      "boleto",
      "outro",
    ]).default("dinheiro"),
    status: mysqlEnum("status", ["pendente", "concluida", "cancelada"]).default(
      "concluida"
    ),
    notes: text("notes"),
    saleDate: timestamp("saleDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_sales_userId").on(table.userId),
    saleDateIdx: index("idx_sales_saleDate").on(table.saleDate),
    customerIdIdx: index("idx_sales_customerId").on(table.customerId),
    statusIdx: index("idx_sales_status").on(table.status),
  })
);

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

/**
 * Tabela de Itens de Venda
 */
export const saleItems = mysqlTable(
  "saleItems",
  {
    id: int("id").autoincrement().primaryKey(),
    saleId: int("saleId").notNull().references(() => sales.id),
    productId: int("productId").notNull().references(() => products.id),
    quantity: int("quantity").notNull(),
    unitPrice: int("unitPrice").notNull(), // em centavos
    subtotal: int("subtotal").notNull(), // em centavos
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    saleIdIdx: index("idx_saleItems_saleId").on(table.saleId),
    productIdIdx: index("idx_saleItems_productId").on(table.productId),
  })
);

export type SaleItem = typeof saleItems.$inferSelect;
export type InsertSaleItem = typeof saleItems.$inferInsert;

/**
 * Tabela de Transações de Caixa
 */
export const cashTransactions = mysqlTable(
  "cashTransactions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    type: mysqlEnum("type", ["entrada", "saida"]).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description"),
    amount: int("amount").notNull(), // em centavos
    paymentMethod: mysqlEnum("paymentMethod", [
      "dinheiro",
      "cartao_credito",
      "cartao_debito",
      "pix",
      "boleto",
      "outro",
    ]).default("dinheiro"),
    reference: varchar("reference", { length: 255 }),
    transactionDate: timestamp("transactionDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_cashTransactions_userId").on(table.userId),
    transactionDateIdx: index("idx_cashTransactions_transactionDate").on(
      table.transactionDate
    ),
    typeIdx: index("idx_cashTransactions_type").on(table.type),
  })
);

export type CashTransaction = typeof cashTransactions.$inferSelect;
export type InsertCashTransaction = typeof cashTransactions.$inferInsert;

/**
 * Tabela de Alertas de Estoque
 */
export const stockAlerts = mysqlTable(
  "stockAlerts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    productId: int("productId").notNull().references(() => products.id),
    alertType: varchar("alertType", { length: 50 }).default("low_stock").notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    notificationMethod: varchar("notificationMethod", { length: 50 })
      .default("email")
      .notNull(),
    recipientEmail: varchar("recipientEmail", { length: 320 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastNotifiedAt: timestamp("lastNotifiedAt"),
    notes: text("notes"),
  },
  (table) => ({
    userIdIdx: index("idx_stockAlerts_userId").on(table.userId),
    productIdIdx: index("idx_stockAlerts_productId").on(table.productId),
    statusIdx: index("idx_stockAlerts_status").on(table.status),
  })
);

export type StockAlert = typeof stockAlerts.$inferSelect;
export type InsertStockAlert = typeof stockAlerts.$inferInsert;

/**
 * Tabela de Backups
 */
export const backups = mysqlTable(
  "backups",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileSize: int("fileSize").notNull(),
    fileUrl: text("fileUrl"),
    backupType: varchar("backupType", { length: 50 }).default("manual").notNull(),
    status: varchar("status", { length: 50 }).default("completed").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
    notes: text("notes"),
  },
  (table) => ({
    userIdIdx: index("idx_backups_userId").on(table.userId),
    createdAtIdx: index("idx_backups_createdAt").on(table.createdAt),
  })
);

export type Backup = typeof backups.$inferSelect;
export type InsertBackup = typeof backups.$inferInsert;

/**
 * Tabela de Importações de Produtos
 */
export const productImports = mysqlTable(
  "productImports",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    totalRows: int("totalRows").notNull(),
    successRows: int("successRows").default(0),
    failedRows: int("failedRows").default(0),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    errorLog: text("errorLog"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    userIdIdx: index("idx_productImports_userId").on(table.userId),
    statusIdx: index("idx_productImports_status").on(table.status),
  })
);

export type ProductImport = typeof productImports.$inferSelect;
export type InsertProductImport = typeof productImports.$inferInsert;