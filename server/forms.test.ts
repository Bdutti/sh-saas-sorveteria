import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

type TrpcContext = {
  user: {
    id: number;
    openId: string;
    email: string;
    name: string;
    loginMethod: string;
    role: "admin" | "user";
    createdAt: Date;
    updatedAt: Date;
    lastSignedIn: Date;
  };
  req: any;
  res: any;
};

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    },
    res: {
      clearCookie: () => {},
    },
  };
}

describe("Product Procedures", () => {
  it("should create a product with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      name: "Sorvete Chocolate",
      sku: "SKU001",
      price: 1500,
      costPrice: 800,
      stock: 100,
      minStock: 10,
      categoryId: null,
      active: true,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Produto criado com sucesso");
    expect(result.id).toBeDefined();
  });

  it("should fail to create product without name", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.create({
        name: "",
        sku: "SKU001",
        price: 1500,
        costPrice: 800,
        stock: 100,
        minStock: 10,
        categoryId: null,
        active: true,
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Product name is required");
    }
  });

  it("should update a product with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.update({
      id: 1,
      name: "Sorvete Chocolate Premium",
      sku: "SKU001",
      price: 2000,
      costPrice: 1000,
      stock: 150,
      minStock: 20,
      categoryId: null,
      active: true,
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Produto atualizado com sucesso");
  });
});

describe("Customer Procedures", () => {
  it("should create a customer with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customers.create({
      name: "João Silva",
      email: "joao@example.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      notes: "Cliente VIP",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Cliente criado com sucesso");
    expect(result.id).toBeDefined();
  });

  it("should fail to create customer without name", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.customers.create({
        name: "",
        email: "joao@example.com",
        phone: "(11) 99999-9999",
        address: "Rua das Flores, 123",
        city: "São Paulo",
        notes: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Customer name is required");
    }
  });

  it("should update a customer with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customers.update({
      id: 1,
      name: "João Silva Santos",
      email: "joao.silva@example.com",
      phone: "(11) 98888-8888",
      address: "Avenida Paulista, 1000",
      city: "São Paulo",
      notes: "Cliente VIP - Preferência por sorvete de chocolate",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Cliente atualizado com sucesso");
  });
});

describe("Sale Procedures", () => {
  it("should create a sale with valid data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sales.create({
      customerId: 1,
      totalAmount: 5000,
      discount: 500,
      paymentMethod: "dinheiro",
      status: "concluida",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Venda criada com sucesso");
    expect(result.id).toBeDefined();
  });

  it("should fail to create sale without customer", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.sales.create({
        customerId: 0,
        totalAmount: 5000,
        discount: 0,
        paymentMethod: "dinheiro",
        status: "concluida",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Customer ID and total amount are required");
    }
  });

  it("should fail to create sale without total amount", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.sales.create({
        customerId: 1,
        totalAmount: 0,
        discount: 0,
        paymentMethod: "dinheiro",
        status: "concluida",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Customer ID and total amount are required");
    }
  });

  it("should support multiple payment methods", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const paymentMethods = ["dinheiro", "credito", "debito", "pix", "boleto"];

    for (const method of paymentMethods) {
      const result = await caller.sales.create({
        customerId: 1,
        totalAmount: 5000,
        discount: 0,
        paymentMethod: method,
        status: "concluida",
      });

      expect(result.success).toBe(true);
    }
  });
});
