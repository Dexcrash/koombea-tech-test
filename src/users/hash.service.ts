import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
