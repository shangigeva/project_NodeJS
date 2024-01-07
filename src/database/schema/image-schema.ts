import { Schema } from "mongoose";
import { IImage } from "../../@types/user";

const imageSchema = new Schema<IImage>({
  alt: {
    type: String,
    minlength: 2,
    maxlength: 256,
    required: true,
  },
  url: {
    type: String,
    minlength: 14,
    required: true,
  },
});

export { imageSchema };
