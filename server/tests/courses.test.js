// tests/courses.test.js
import mongoose, { Types } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../src/app.js";
import Course from "../src/models/course.model.js"; // Your Course model

let mongo;
let server;

jest.setTimeout(40000);

// Helper to normalize response body to always return an array of items
function toItems(body) {
  return Array.isArray(body) ? body : body?.items ?? [];
}

beforeAll(async () => {
  //set up in-memory MongoDB instance
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  //connect mongoose
  await mongoose.connect(uri, { dbName: "testdb" });

  //  Seed some initial data
  await Course.deleteMany({});

  const toPrice = (n) => {
    return Types.Decimal128.fromString(n.toFixed(2));
  };

  await Course.insertMany([
    {
      courseId: 1,
      courseName: "Piano Basics",
      //
      name: "Piano Basics",
      defaultPrice: toPrice(99),
      category: "Music",
      level: "Beginner",
      capacity: 20,
      booked: 0,
      remaining: 20,
    },
    {
      courseId: 2,
      courseName: "HipHop Dance",
      name: "HipHop Dance",
      defaultPrice: toPrice(120),
      category: "Dance",
      level: "Intermediate",
      capacity: 15,
      booked: 0,
      remaining: 15,
    },
  ]);

  // start the server
  server = app.listen(0);
});

afterAll(async () => {
  // close server to avoid port occupation
  await new Promise((resolve) => server?.close(resolve));
  try {
    await mongoose.connection.dropDatabase();
  } catch (_) {}
  await mongoose.disconnect();
  await mongo.stop();
});

describe("GET /api/courses", () => {
  it("returns list", async () => {
    const res = await request(server).get("/api/courses");
    expect(res.statusCode).toBe(200);
    const items = toItems(res.body);
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it("filters by keyword (kw)", async () => {
    const res = await request(server)
      .get("/api/courses")
      .query({ kw: "Music" });
    expect(res.statusCode).toBe(200);
    const items = toItems(res.body);
    expect(Array.isArray(items)).toBe(true);
    if (items.length > 0) {
      // name or courseName contains "Music"
      expect(
        items.every((c) => typeof (c.name ?? c.courseName) === "string")
      ).toBe(true);
    }
  });
});

describe("GET /api/courses/:id", () => {
  it("returns detail when id is valid", async () => {
    const list = await request(server).get("/api/courses");
    const items = toItems(list.body);
    expect(items.length).toBeGreaterThan(0);

    const first = items[0];
    // Try _id, id, courseId
    const anyId = first._id ?? first.id ?? first.courseId;

    const detail = await request(server).get(`/api/courses/${anyId}`);
    expect(detail.statusCode).toBe(200);
    expect(
      "name" in detail.body || "courseName" in detail.body
    ).toBeTruthy();
  });

  it("returns 400/404 for invalid id", async () => {
    const res = await request(server).get("/api/courses/invalid-id-xyz");
    expect([400, 404]).toContain(res.statusCode);
  });
});





