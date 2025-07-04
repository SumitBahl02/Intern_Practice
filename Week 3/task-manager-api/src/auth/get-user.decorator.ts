import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Extend the Request interface to include the 'user' property
interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with your actual user type if available
}

export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return req.user;
  },
);
