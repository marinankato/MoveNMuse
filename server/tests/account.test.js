import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js'; 
import User from '../src/models/user.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

describe('Account Route - Update User', () => {
  test('should update user details successfully', async () => {
    const user = await User.create({
        userId: '12',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        phoneNo: '1234567890',
        password: 'test1234',
    });

    const res = await request(app)
      .put('/api/user/update')
      .send({
        email: 'alice@example.com',
        firstName: 'Alicia',
        phoneNo: '0987654321',
      });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Alicia');
    expect(res.body.phoneNo).toBe('0987654321');
    expect(res.body.lastName).toBe('Smith');
  });

  test('should return 400 if email is missing', async () => {
    const res = await request(app)
      .put('/api/user/update')
      .send({ firstName: 'No Email' });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Email is required/i);
  });

  test('should return 404 if user does not exist', async () => {
    const res = await request(app)
      .put('/api/user/update')
      .send({
        email: 'nonexistent@example.com',
        firstName: 'Ghost',
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User not found/i);
  });
});
