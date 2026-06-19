export type JwtPayload = {
  userId: string;
  email: string;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
};