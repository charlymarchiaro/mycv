import {Test, TestingModule} from "@nestjs/testing";
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UsersService} from "./users.service";
import {User} from "./user.entity";
import {randomBytes} from "crypto";


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => Promise.resolve(
         users.filter(user => user.email === email)
      ),
      create: (email: string, password: string) => {
        const user = {id: Date.now(), email, password} as User;
        users.push(user);
        return Promise.resolve(user)
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ]
    }).compile();

    service = module.get(AuthService);

    await service.signup('example2@email.com', '2');
  });


  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'testpassword');

    expect(user.password).not.toEqual('testpassword');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await expect(service.signup('example2@email.com', '2'))
       .rejects.toThrow(BadRequestException);
  });

  it('throws an error if signin is called with a non-existent email', async () => {
    await expect(service.signin('_@_.com', '_'))
       .rejects.toThrow(UnauthorizedException);
  });

  it('throws an error if an invalid password is provided', async () => {
    await expect(service.signin('example2@email.com', '_'))
       .rejects.toThrow(UnauthorizedException);
  });

  it('returns a user if valid credentials are provided', async () => {
    const user = await service.signin('example2@email.com', '2');
    expect(user).toBeDefined();
  });
});
