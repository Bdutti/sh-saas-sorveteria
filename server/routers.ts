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
