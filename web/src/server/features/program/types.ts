import { type ObjectId } from "@heja/shared/mongodb";

export type ProgramDate = {
  _id: ObjectId;
  date: Date;
  configuration?: {
    slotsDuration: number; // 60 minutes
    slotsStart: number; // 12
    numSlots: number; // 10 (creates one slot per duration from slotsStart)
  };
  createdAt: Date;
  updatedAt: Date;
};

export type Program = {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type Slot = {
  _id: ObjectId;
  date: Date;
  venueId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
