export interface RefreshToken {
  tokenHash: string;
  expiresAt: Date;
}

export interface IUser {
  email: string;
  passwordHash: string;
  refreshTokens: RefreshToken[];
}