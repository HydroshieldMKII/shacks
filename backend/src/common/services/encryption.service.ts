import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly masterKey: string;

  constructor() {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable not set');
    }

    this.masterKey = process.env.ENCRYPTION_KEY;
  }

  private generateUserKey(userPassword: string): string {
    // Combine master key + user password for encryption key
    return CryptoJS.SHA256(this.masterKey + userPassword).toString();
  }

  encrypt(password: string, userPassword: string): string {
    const userKey = this.generateUserKey(userPassword);
    return CryptoJS.AES.encrypt(password, userKey).toString();
  }

  decrypt(encryptedPassword: string, userPassword: string): string {
    const userKey = this.generateUserKey(userPassword);
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, userKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
