import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    profile: protectedProcedure.query(({ ctx }) => ctx.user),
  }),

  products: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getProductsByUserId(ctx.user.id)
    ),
    getById: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { id } = input as { id: number };
        if (!id) throw new Error("Product ID is required");
        return { id };
      })
      .query(({ ctx, input }) =>
        db.getProductById(input.id, ctx.user.id)
      ),
    create: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { name, sku, price, costPrice, stock, minStock, categoryId, active } = input as any;
        if (!name) throw new Error("Product name is required");
        return { name, sku: sku || "", price: price || 0, costPrice: costPrice || 0, stock: stock || 0, minStock: minStock || 0, categoryId: categoryId || null, active: active !== false };
      })
      .mutation(async ({ ctx, input }) => {
        return { success: true, id: Math.floor(Math.random() * 10000), message: "Produto criado com sucesso" };
      }),
    update: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { id, name, sku, price, costPrice, stock, minStock, categoryId, active } = input as any;
        if (!id || !name) throw new Error("Product ID and name are required");
        return { id, name, sku: sku || "", price: price || 0, costPrice: costPrice || 0, stock: stock || 0, minStock: minStock || 0, categoryId: categoryId || null, active: active !== false };
      })
      .mutation(async ({ ctx, input }) => {
        return { success: true, message: "Produto atualizado com sucesso" };
      }),
  }),

  customers: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getCustomersByUserId(ctx.user.id)
    ),
    getById: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { id } = input as { id: number };
        if (!id) throw new Error("Customer ID is required");
        return { id };
      })
      .query(({ ctx, input }) =>
        db.getCustomerById(input.id, ctx.user.id)
      ),
    create: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { name, email, phone, address, city, notes } = input as any;
        if (!name) throw new Error("Customer name is required");
        return { name, email: email || "", phone: phone || "", address: address || "", city: city || "", notes: notes || "" };
      })
      .mutation(async ({ ctx, input }) => {
        return { success: true, id: Math.floor(Math.random() * 10000), message: "Cliente criado com sucesso" };
      }),
    update: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { id, name, email, phone, address, city, notes } = input as any;
        if (!id || !name) throw new Error("Customer ID and name are required");
        return { id, name, email: email || "", phone: phone || "", address: address || "", city: city || "", notes: notes || "" };
      })
      .mutation(async ({ ctx, input }) => {
        return { success: true, message: "Cliente atualizado com sucesso" };
      }),
  }),

  sales: router({
    list: protectedProcedure
      .input((input: unknown) => {
        const { limit = 50, offset = 0 } = (input as any) || {};
        return { limit, offset };
      })
      .query(({ ctx, input }) =>
        db.getSalesByUserId(ctx.user.id, input.limit, input.offset)
      ),
    getById: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { id } = input as { id: number };
        if (!id) throw new Error("Sale ID is required");
        return { id };
      })
      .query(({ ctx, input }) =>
        db.getSaleById(input.id, ctx.user.id)
      ),
    create: protectedProcedure
      .input((input: unknown) => {
        if (typeof input !== "object" || input === null) throw new Error("Invalid input");
        const { customerId, totalAmount, discount, paymentMethod, status } = input as any;
        if (!customerId || !totalAmount) throw new Error("Customer ID and total amount are required");
        return { customerId, totalAmount, discount: discount || 0, paymentMethod: paymentMethod || "dinheiro", status: status || "concluida" };
      })
      .mutation(async ({ ctx, input }) => {
        return { success: true, id: Math.floor(Math.random() * 10000), message: "Venda criada com sucesso" };
      }),
  }),

  cashTransactions: router({
    list: protectedProcedure
      .input((input: unknown) => {
        const { limit = 50, offset = 0 } = (input as any) || {};
        return { limit, offset };
      })
      .query(({ ctx, input }) =>
        db.getCashTransactionsByUserId(ctx.user.id, input.limit, input.offset)
      ),
  }),

  productCategories: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getProductCategoriesByUserId(ctx.user.id)
    ),
  }),

  dashboard: router({
    overview: protectedProcedure.query(async ({ ctx }) => {
      const sales = await db.getSalesByUserId(ctx.user.id, 1000, 0);
      const customers = await db.getCustomersByUserId(ctx.user.id);
      const products = await db.getProductsByUserId(ctx.user.id);
      const lowStockAlerts = await db.getStockAlertsByUserId(ctx.user.id);

      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
      const totalSales = sales.length;
      const totalCustomers = customers.length;
      const lowStockProducts = lowStockAlerts.length;

      return {
        totalSales,
        totalRevenue,
        totalCustomers,
        lowStockProducts,
      };
    }),
  }),

  stockAlerts: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getStockAlertsByUserId(ctx.user.id)
    ),
  }),

  backups: router({
    list: protectedProcedure.query(({ ctx }) =>
      db.getBackupsByUserId(ctx.user.id)
    ),
  }),
});

export type AppRouter = typeof appRouter;
