import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly masterKey: string;
  private readonly algorithm = 'aes-256-cbc';

  constructor() {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable not set');
    }

    this.masterKey = process.env.ENCRYPTION_KEY;
  }

  private generateUserKey(userPassword: string): Buffer {
    // Combine master key + user password for encryption key
    // Generate a 32-byte key using SHA-256
    return createHash('sha256')
      .update(this.masterKey + userPassword)
      .digest();
  }

  encrypt(password: string, userPassword: string): string {
    const key = this.generateUserKey(userPassword);
    const iv = randomBytes(16); // Generate random initialization vector
    
    const cipher = createCipheriv(this.algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data (IV is needed for decryption)
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedPassword: string, userPassword: string): string {
    const key = this.generateUserKey(userPassword);
    
    // Split IV and encrypted data
    const parts = encryptedPassword.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = createDecipheriv(this.algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
