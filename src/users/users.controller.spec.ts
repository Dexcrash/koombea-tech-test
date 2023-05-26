import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { HashService } from './hash.service';
import { CanActivate } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './users.schema';

const userModel = {
  username: 'testuser',
  password: 'test12345',
};

class UserModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([userModel]);
  static findOne = jest.fn().mockResolvedValue(userModel);
  static findOneAndUpdate = jest.fn().mockResolvedValue(userModel);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let guard: AuthenticatedGuard;

  beforeEach(async () => {
    const mockAuthenticatedGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        HashService,
        {
          provide: getModelToken(User.name),
          useValue: UserModel,
        },
      ],
    })
      .overrideGuard(AuthenticatedGuard)
      .useValue(mockAuthenticatedGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    guard = module.get<AuthenticatedGuard>(AuthenticatedGuard);
  });

  describe('addUser', () => {
    it('should add a user and return success message', async () => {
      // Arrange
      const userName = 'testuser';
      const userPassword = 'test12345';

      // Act
      const result = await controller.addUser(userPassword, userName);

      // Assert
      expect(service).toBeCalled();
      expect(result).toEqual({
        msg: 'User successfully registered',
        userName: userName,
      });
    });
  });

  describe('login', () => {
    it('should return user information after successful login', async () => {
      const mockRequest = {
        user: { id: 'mockUserId', username: 'testuser' },
        msg: 'User logged in',
      } as unknown as Request;

      jest.spyOn(guard, 'canActivate').mockReturnValue(Promise.resolve(true));

      const result = await controller.login(mockRequest);

      expect(result).toEqual(mockRequest);
    });
  });
});
