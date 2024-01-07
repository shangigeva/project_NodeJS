import { Schema } from "mongoose";
import { IAddress } from "../../@types/user";

const addressSchema = new Schema<IAddress>({
  city: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },

  state: {
    type: String,
    required: false,
    default: "",
    minlength: 0,
    maxlength: 256,
  },

  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },

  street: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },

  zip: {
    type: String,
    required: false,
    default: "0",
    minlength: 2,
    maxlength: 256,
  },

  houseNumber: {
    type: Number,
    required: true,
    min: 2,
    max: 256,
  },
});

export { addressSchema };
