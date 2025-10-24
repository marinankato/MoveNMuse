// Marina
import User from '../models/user.model.js';

export async function getNextUserId() {
  const lastUser = await User.findOne().sort({ userId: -1 }); // Get highest userId
  return lastUser ? lastUser.userId + 1 : 1;
}