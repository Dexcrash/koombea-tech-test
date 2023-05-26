import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { HashService } from './hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private hashService: HashService,
  ) {}

  //Signup user method with username and password
  async insertUser(userName: string, password: string): Promise<User> {
    const username = userName.toLowerCase();
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }
  //log in user using the findOne method
  async getUser(userName: string): Promise<User> {
    const username = userName.toLowerCase();
    const user = await this.userModel.findOne({ username });
    return user;
  }
}
