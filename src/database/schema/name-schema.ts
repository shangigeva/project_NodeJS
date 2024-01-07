import { Schema } from "mongoose";

import { IName } from "../../@types/user";

const nameSchema = new Schema<IName>({
  first: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },
  middle: {
    type: String,
    required: false,
    default: "",
    minlength: 2,
    maxlength: 256,
  },
  last: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },
});

export { nameSchema };
