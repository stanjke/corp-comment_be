import { type ObjectId } from "mongoose";

export type LoginPayloadType = {
  id: unknown | ObjectId;
  login: string;
};
