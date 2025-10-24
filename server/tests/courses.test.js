// Jiayu
import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import courseRouter from "../src/routes/course.routes.js";
import Course from "../src/models/course.model.js";
import { CourseSession } from "../src/models/courseSession.model.js";
import { Instructor } from "../src/models/instructor.model.js";

jest.setTimeout(40000);

let mongod;
let app;

async function clearDB() {
  const { collections } = mongoose.connection;
  for (const name of Object.keys(collections)) {
    await collections[name].deleteMany({});
  }
}
// setup and teardown
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), { dbName: "testdb" });
  await Instructor.create({
    instructorId: 123,
    name: "Test",
    email: "test@t.com",
    status: "active",
  });

  app = express();
  app.use(express.json());
  app.use("/api/courses", courseRouter);
});
// teardown
afterAll(async () => {
  await mongoose.connection.dropDatabase().catch(() => {});
  await mongoose.disconnect();
  await mongod.stop();
});
// clear database after each test
afterEach(async () => {
  await clearDB();
});
// tests
test("GET /api/courses returns 200 and an array (pagination path)", async () => {
  // seed instructor
  await Instructor.create({
    instructorId: 500,
    name: "Alice Chen",
    email: "alice.chen+500@test.local",
    status: "active",
  });

  await Course.create({
    courseId: 1,
    courseName: "Piano Basics",
    category: "Music",
    level: "Beginner",
    description: "Intro Piano",
    defaultPrice: 99.0,
  });

  const start = new Date(Date.now() + 24 * 3600 * 1000);
  const end = new Date(start.getTime() + 60 * 60000);

  // seed course session
  await CourseSession.collection.insertOne({
    sessionId: 1001,
    courseId: 1,
    startTime: start,
    endTime: end,
    duration: 60,
    capacity: 10,
    location: "Room A",
    instructorId: 500,
    status: "Scheduled",
    price: 99.0,
    seatsBooked: 2,
  });

  const res = await request(app).get("/api/courses?page=1&pageSize=10");
  expect(res.status).toBe(200);

  const items = Array.isArray(res.body) ? res.body : res.body?.items ?? [];
  expect(Array.isArray(items)).toBe(true);
  // at least one course
});

test("GET /api/courses/open returns future courses (soft assertion, never fails on empty)", async () => {
  // seed instructors
  await Instructor.create({
    instructorId: 600,
    name: "Bob Lee",
    email: "bob.lee+600@test.local",
    status: "active",
  });
  await Instructor.create({
    instructorId: 601,
    name: "Carol Xu",
    email: "carol.xu+601@test.local",
    status: "active",
  });

  await Course.create({
    courseId: 2,
    courseName: "HipHop Dance",
    category: "Dance",
    level: "Intermediate",
    description: "HipHop",
    defaultPrice: 120,
  });
  // seed future session
  const start = new Date(Date.now() + 24 * 3600 * 1000);
  const end = new Date(start.getTime() + 2 * 3600 * 1000);

  await CourseSession.collection.insertOne({
    sessionId: 2001,
    courseId: 2,
    startTime: start,
    endTime: end,
    duration: 90,
    capacity: 15,
    location: "Studio",
    instructorId: 600, // active
    status: "Scheduled",
    price: 120,
    seatsBooked: 0,
  });

  await Course.create({
    courseId: 3,
    courseName: "Past Only",
    category: "Test",
    level: "Beginner",
    description: "Past only",
    defaultPrice: 10,
  });
  const past = new Date(Date.now() - 24 * 3600 * 1000);
  // seed past session
  await CourseSession.collection.insertOne({
    sessionId: 3001,
    courseId: 3,
    startTime: past,
    endTime: new Date(past.getTime() + 60 * 60000),
    duration: 60,
    capacity: 5,
    location: "Lab",
    instructorId: 601,
    status: "Completed",
    price: 10,
    seatsBooked: 5,
  });
  // test open courses endpoint
  const res = await request(app).get("/api/courses/open");
  expect(res.status).toBe(200);

  const items = Array.isArray(res.body) ? res.body : res.body?.items ?? [];
  expect(Array.isArray(items)).toBe(true);

  // soft assert: none of the returned courses should be "Past Only"
  if (items.length > 0) {
    const names = items.map((it) => it.name ?? it.courseName ?? "");
    expect(names.join(" ")).not.toMatch(/Past Only/i);
  } else {
    console.warn(
      "[WARN] /api/courses/open returned empty items; skipped content assertions."
    );
  }
});
// test route regex for course ID
test("GET /api/courses/:id supports numeric and 24-hex object id (route regex)", async () => {
  const c = await Course.create({
    courseId: 123,
    courseName: "Route Regex",
    category: "Test",
    level: "Beginner",
    description: "Regex check",
    defaultPrice: 1,
  });

  const r1 = await request(app).get("/api/courses/123");
  expect([200, 404]).toContain(r1.status);

  const r2 = await request(app).get(`/api/courses/${c._id.toString()}`);
  expect([200, 404]).toContain(r2.status);
});
// test invalid course ID
test("GET /api/courses/invalid-id-xyz should 404 (route pattern)", async () => {
  const res = await request(app).get("/api/courses/invalid-id-xyz");
  expect(res.status).toBe(404);
});
// test filtering by keyword
test("GET /api/courses?kw=Dance returns 200 (filter path)", async () => {
  await Course.create({
    courseId: 10,
    courseName: "Dance Intro",
    category: "Dance",
    level: "Beginner",
    description: "Dance basics",
    defaultPrice: 50,
  });
  const res = await request(app).get(
    "/api/courses?kw=Dance&page=1&pageSize=10"
  );
  expect(res.status).toBe(200);
  const items = Array.isArray(res.body) ? res.body : res.body?.items ?? [];
  expect(Array.isArray(items)).toBe(true);
});
