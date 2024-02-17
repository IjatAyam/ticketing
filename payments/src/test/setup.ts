import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';

declare global {
  var getCookie: (userId?: string) => string[];
}

config();

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'very-secret-key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.getCookie = userId => {
  const id = userId ?? new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id,
    email: 'test@test.com',
  };

  const token = sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
