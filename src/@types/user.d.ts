type IName = {
  first: string;
  middle?: string;
  last: string;
};

type IAddress = {
  street: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
  houseNumber: number;
};

type IImage = {
  alt: string;
  url: string;
};

type IUser = {
  name: IName;
  address: IAddress;
  image?: IImage;
  email: string;
  phone: string;
  password: string;
  isBusiness: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  _id?: string;
  failedLoginAttempts: number;
  lastFailedLogin: Date;
};

type ILogin = {
  email: string;
  password: string;
};

type IJWTDecoded = {
  payload: IJWTPayload;
  iat: number;
  exp: number;
};

type IJWTPayload = {
  email: string;
  isBusiness: boolean;
  isAdmin: boolean;
};
type IJWTPayloadUserId = {
  email: string;
  userId: string;
};

export {
  IUser,
  IName,
  IAddress,
  IImage,
  ILogin,
  IJWTDecoded,
  IJWTPayload,
  IJWTPayloadUserId,
};
