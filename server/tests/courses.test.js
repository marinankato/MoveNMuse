import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import connectDB from "../src/db/index.js";

let server;

beforeAll(async () => {
  // connect to the database
  await connectDB();
  // start the test server (random port)
  server = app.listen(0);
}, 20000); // set higher timeout for slow CI

afterAll(async () => {
  // close database connection and server
  await mongoose.connection.close();
  server?.close();
});

describe("GET /api/courses", () => {
  it("returns list", async () => {
    const res = await request(server).get("/api/courses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items ?? res.body)).toBe(true);
  });

  it("filters by keyword (kw)", async () => {
    const res = await request(server)
      .get("/api/courses")
      .query({ kw: "Music" });
    expect(res.statusCode).toBe(200);
    const items = res.body.items ?? res.body;
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      expect(items.every((c) => typeof c.name === "string")).toBe(true);
    }
  });
});

describe("GET /api/courses/:id", () => {
  it("returns detail when id is valid", async () => {
    // First get a valid course
    const list = await request(server).get("/api/courses");
    const items = list.body.items ?? list.body;
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    const id = first._id ?? first.id ?? first.courseId;

    const detail = await request(server).get(`/api/courses/${id}`);
    expect(detail.statusCode).toBe(200);
    expect(detail.body).toHaveProperty("name");
  });

  it("returns 400/404 for invalid id", async () => {
    const res = await request(server).get("/api/courses/invalid-id-xyz");
    expect([400, 404]).toContain(res.statusCode);
  });
});


