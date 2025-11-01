import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Session,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user information from session',
  })
  @ApiResponse({
    status: 200,
    description: 'Current user information',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User not logged in',
  })
  getCurrentUser(@CurrentUser() user: { id: number; username: string }) {
    return user;
  }

  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with username and password. Sets session cookie on success.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful - Session cookie set',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
    @Req() req: Request,
  ) {
    const result = await this.usersService.login(loginDto);

    // Set session data
    session.userId = result.user.id;
    session.username = result.user.username;
    session.userPassword = loginDto.password; // Store password for encryption/decryption
    session.email = result.user.email;

    // Explicitly save the session to ensure cookie is set
    await new Promise<void>((resolve, reject) => {
      (req as any).session.save((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });

    return result;
  }

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create new user account',
    description:
      'Register a new user with username, email, and password. Automatically logs in on success.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully - Session cookie set',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'john_doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Username or email already exists',
  })
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const result = await this.usersService.signup(createUserDto);

    // Set session data
    session.userId = result.user.id;
    session.username = result.user.username;
    session.userPassword = createUserDto.password; // Store password for encryption/decryption
    session.email = createUserDto.email;

    return result;
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout current user',
    description: 'Destroys the user session and clears authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout(@Req() req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Logged out successfully' });
        }
      });
    });
  }
}
