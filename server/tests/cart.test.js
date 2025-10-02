import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app.js";
import { Cart } from "../src/models/cart.model.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: "jest-cart" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Cart.deleteMany({});
});

describe("Cart API - remove item", () => {
  test("DELETE /api/cart/:cartId/:itemId removes the item and returns updated cart", async () => {
    await Cart.create({
      cartId: 100,
      userId: 100,
      cartItems: [
        {
          itemId: 1,
          productType: "Course",
          productId: 101,
          occurrenceId: 1001,
        },
        {
          itemId: 2,
          productType: "Course",
          productId: 102,
          occurrenceId: 1002,
        },
      ],
    });

    const res = await request(app).delete("/api/cart/100/1");

    // Assert: HTTP OK + message present
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed/i);

    // Assert: response cart no longer has item 1, still has item 2
    expect(res.body.cart).toBeDefined();
    expect(res.body.cart.cartItems).toEqual(
      expect.arrayContaining([expect.objectContaining({ itemId: 2 })])
    );
    expect(res.body.cart.cartItems.some((i) => i.itemId === 1)).toBe(false);
  });

  describe("Cart API - update item occurrence", () => {
    test("PUT /api/cart/:cartId/:itemId updates the item and returns updated cart", async () => {
      await Cart.create({
        cartId: 100,
        userId: 100,
        cartItems: [
          {
            itemId: 1,
            productType: "Course",
            productId: 101,
            occurrenceId: 1001,
          },
          {
            itemId: 2,
            productType: "Course",
            productId: 102,
            occurrenceId: 1002,
          },
        ],
      });

      const res = await request(app).put("/api/cart/100/1").send({
        occurrenceId: 2001,
      });

      // Assert: HTTP OK + message present
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/updated/i);

      const updated = res.body.cart.cartItems;

      // Assert: response item 1 has new occurrenceId 2001
      expect(updated).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ itemId: 1, occurrenceId: 2001 }),
          expect.objectContaining({ itemId: 2, occurrenceId: 1002 }),
        ])
      );
    });
  });
});
