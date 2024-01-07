import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IJWTPayloadUserId, IJWTPayload, IJWTDecoded } from "../@types/user";
import { Logger } from "../logs/logger";
import { User } from "../database/model/user";
const authService = {
  hashPassword: (plainTextPassword: string, rounds = 12) => {
    return bcrypt.hash(plainTextPassword, rounds);
  },
  validatePassword: (plainTextPassword: string, hash: string) => {
    return bcrypt.compare(plainTextPassword, hash);
  },
  handleFailedLogin: async (userId: string) => {
    // Increment failed login attempts and update timestamp
    await User.findByIdAndUpdate(userId, {
      $inc: { failedLoginAttempts: 1 },
      $set: { lastFailedLogin: new Date() },
    });
    // Check if the user should be blocked
    const user = await User.findById(userId);
    const maxAttempts = 3;
    const blockDuration = 24 * 60 * 60 * 1000;
    if (user) {
      if (user.failedLoginAttempts >= maxAttempts && user.lastFailedLogin) {
        const now = new Date();
        const timeDiff = now.getTime() - user.lastFailedLogin.getTime();
        if (timeDiff <= blockDuration) {
          // User is blocked
          throw new Error("User is blocked. Try again later.");
        } else {
          // Reset failed attempts if the block duration has passed
          await User.findByIdAndUpdate(userId, {
            $set: { failedLoginAttempts: 0, lastFailedLogin: null },
          });
        }
      }
    } else {
      throw new Error("User not found");
    }
  },
  generateJWT: (payload: IJWTPayload) => {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = "1d";
    return jwt.sign({ payload }, secret, { expiresIn });
  },
  generateJWTUserId: (payload: IJWTPayloadUserId) => {
    const secret = process.env.JWT_SECRET!;
    return jwt.sign({ payload }, secret);
  },
  verifyJWT: (token: string) => {
    try {
      const secret = process.env.JWT_SECRET!;
      Logger.info(jwt.verify(token, secret));
      const { payload } = jwt.verify(token, secret) as IJWTDecoded;
      return payload;
    } catch (error) {
      Logger.error("Error verifying JWT:", error);
      throw new Error("Invalid token");
    }
  },

  verifyJWTUserId: (token: string) => {
    try {
      const secret = process.env.JWT_SECRET!;
      const payload = jwt.verify(token, secret, { ignoreExpiration: true });
      return payload as IJWTPayloadUserId;
    } catch (error) {
      Logger.error("Error verifying JWT:", error);
      throw new Error("Invalid token");
    }
  },
};

export { authService as auth };
