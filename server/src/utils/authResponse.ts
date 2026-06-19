import UserModel from "../models/user.model";

export const buildAuthResponse = (
  user: InstanceType<typeof UserModel>,
  accessToken: string,
  refreshToken: string
) => ({
  user: {
    id: user._id.toString(),
    email: user.email,
  },
  accessToken,
  refreshToken,
});