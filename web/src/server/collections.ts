import { type Db, type Document } from "@heja/shared/mongodb";
import {
  type LAHEvent,
  type Artist,
  type Venue,
} from "./features/artists/types";
import { type UserSession, type User } from "./features/users/types";
import { type Dayparty, type Conference, type News } from "./features/types";
import { type Deal } from "./features/deals/types";
import { type ProgramDate } from "./features/program/types";

const getCollection = <T extends Document>(db: Db, name: string) =>
  db.collection<T>(name);

export default {
  artists: <T extends Document = Artist>(db: Db) =>
    getCollection<T>(db, "artists"),
  conferences: <T extends Document = Conference>(db: Db) =>
    getCollection<T>(db, "conferences"),
  dayparties: <T extends Document = Dayparty>(db: Db) =>
    getCollection<T>(db, "dayparties"),
  deals: <T extends Document = Deal>(db: Db) => getCollection<T>(db, "deals"),
  events: <T extends Document = LAHEvent>(db: Db) =>
    getCollection<T>(db, "events"),
  news: <T extends Document = News>(db: Db) => getCollection<T>(db, "news"),
  programdates: <T extends Document = ProgramDate>(db: Db) =>
    getCollection<T>(db, "programdates"),
  users: <T extends Document = User>(db: Db) => getCollection<T>(db, "users"),
  usersessions: <T extends Document = UserSession>(db: Db) =>
    getCollection<T>(db, "usersessions"),
  venues: <T extends Document = Venue>(db: Db) =>
    getCollection<T>(db, "venues"),
};
