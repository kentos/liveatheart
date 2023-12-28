import { type ObjectId } from "@heja/shared/mongodb";

export type ProgramDate = {
  _id: ObjectId;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type Program = {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
