import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const randomBytesSize = 8;
const scryptAsyncNumber = 64;

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(randomBytesSize).toString('hex');
    const buf = (await scryptAsync(password, salt, scryptAsyncNumber)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, scryptAsyncNumber)) as unknown as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
