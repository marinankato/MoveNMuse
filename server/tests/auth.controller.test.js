import { loginUser } from '../src/controllers/auth.controller.js';
import User from '../src/models/user.model.js';
import jwt from 'jsonwebtoken';

// Mock User model and jwt.sign
jest.mock('../src/models/user.model.js');
jest.mock('jsonwebtoken');

describe('loginUser controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('returns 400 if email or password missing', async () => {
    req.body = {}; // no email or password

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email and password are required." });
  });

  test('returns 401 if user not found or password mismatch', async () => {
    req.body = { email: 'test@example.com', password: 'pass' };
    User.findOne.mockResolvedValue(null); // user not found

    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password." });

    // now test user found but wrong password
    User.findOne.mockResolvedValue({ password: 'different', save: jest.fn() });

    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid email or password." });
  });

  test('returns 200 and token when login successful', async () => {
    req.body = { email: 'test@example.com', password: 'pass' };

    const mockSave = jest.fn();
    const user = {
      userId: '123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      role: 'user',
      phoneNo: '1234567890',
      loginDate: null,
      logoutDate: null,
      password: 'pass',
      save: mockSave,
    };

    User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue('mocked-token');

    await loginUser(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.userId,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      }),
      expect.any(String),
      { expiresIn: "1d" }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      token: 'mocked-token',
      user: expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        role: 'user',
        phoneNo: '1234567890',
      }),
    });
  });

  test('returns 500 if there is an exception', async () => {
    req.body = { email: 'test@example.com', password: 'pass' };
    User.findOne.mockRejectedValue(new Error('DB error'));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error." });
  });
});
