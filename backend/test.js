import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import User from './models/User.js';

async function test() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected');

    const user = new User({
      fullName: 'Test',
      email: 'test@test.com',
      phone: '123',
      hostelName: 'Test',
      roomNumber: '1',
      password: 'password123'
    });

    await user.save();
    console.log('Saved');
  } catch (error) {
    console.error(error);
  }
}

test();