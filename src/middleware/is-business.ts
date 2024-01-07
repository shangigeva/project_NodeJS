import { RequestHandler } from "express";
import { extractToken } from "./is-admin";
import { auth } from "../service/auth-service";
import { User } from "../database/model/user";
import { BizCardsError } from "../error/biz-cards-error";

const isBusinessUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = extractToken(req);
    const { email } = auth.verifyJWT(token);
    const userBusiness = await User.findOne({ email });
    if (!userBusiness) throw new BizCardsError("User does not exist", 401);
    req.user = userBusiness;
    const isBusiness = userBusiness?.isBusiness;
    if (isBusiness) {
      return next();
    }
    throw new BizCardsError("User Must be a business", 401);
    // if (id == userBusiness.id || userBusiness.isBusiness) return next();
    // else {
    //   throw new BizCardsError(
    //     "you should be a business user to create a card",
    //     401
    //   );
    // }
  } catch (e) {
    next(e);
  }
};
export { isBusinessUser };
