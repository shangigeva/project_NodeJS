import { IUser } from "../@types/user";
import { User } from "../database/model/user";
import { BizCardsError } from "../error/biz-cards-error";
import { auth } from "./auth-service";

const createUser = async (userData: IUser) => {
  const user = new User(userData);
  user.password = await auth.hashPassword(user.password);
  return user.save();
};
const validateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new BizCardsError("Bad credentials", 401);
  }
  // Check if the user is blocked
  const maxAttempts = 3;
  if (user.failedLoginAttempts >= maxAttempts && user.lastFailedLogin) {
    const now = new Date();
    const blockDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const timeDiff = now.getTime() - user.lastFailedLogin.getTime();
    if (timeDiff <= blockDuration) {
      // User is blocked
      throw new BizCardsError("User is blocked. Try again later.", 401);
    } else {
      // Reset failed attempts if the block duration has passed
      await User.findByIdAndUpdate(user._id, {
        $set: { failedLoginAttempts: 0, lastFailedLogin: null },
      });
    }
  }
  // Check the password:
  const isPasswordValid = await auth.validatePassword(password, user.password);
  if (!isPasswordValid) {
    // If the password is invalid, call handleFailedLogin
    await auth.handleFailedLogin(user._id);
    throw new BizCardsError("Bad credentials", 401);
  }

  // Generate the JWT
  const jwt = auth.generateJWT({
    email: user.email,
    isBusiness: user.isBusiness,
    isAdmin: user.isAdmin || false,
  });

  return { jwt };
};
export { createUser, validateUser };
