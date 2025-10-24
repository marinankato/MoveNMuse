// Marina
process.env.JWT_SECRET = 'testsecret';

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/user.model.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let token;

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

  await User.create({
    userId: '1',
    firstName: 'John',
    lastName: 'Test',
    email: 'test@example.com',
    role: 'customer',
    phoneNo: '0412345678',
    loginDate: new Date('2025-10-16T00:00:00Z'),
    logoutDate: null,
    password: 'pass',
  });

  const res = await request(app)
  .post('/api/auth/login')
  .send({ email: 'test@example.com', password: 'pass' }); 
  token = res.body.token;
  console.log('Login status:', res.status);
  console.log('Login body:', res.body);
});

describe('Account Route - Get User Info', () => {
  test('should return user info when token is valid', async () => {
    const res = await request(app)
      .get('/api/account')
      .set('Authorization', `Bearer ${token}`);

    console.log('Account response:', res.body);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.firstName).toBe('John');
    expect(res.body.user.lastName).toBe('Test');
    expect(res.body.user.phoneNo).toBe('0412345678');
  });

  test('should return 401 if token is missing', async () => {
    const res = await request(app).get('/api/account');
    expect(res.status).toBe(401);
  });

  test('should return 401 if token is invalid', async () => {
    const res = await request(app)
      .get('/api/account')
      .set('Authorization', 'Bearer faketoken');

    expect(res.status).toBe(401);
  });
});
