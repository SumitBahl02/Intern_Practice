export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends UserResponse {
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export interface JwtPayload {
  email: string;
  sub: number;
  role: string;
}
