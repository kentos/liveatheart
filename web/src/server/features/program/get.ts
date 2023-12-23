import { getConference } from "./getConference";
import { getDayparties } from "./getDayparties";
import { getEvents } from "./getEvents";
import { format } from "date-fns";
import { type Db, type ObjectId } from "@heja/shared/mongodb";
import { group } from "radash";

export async function getAllEvents(
  db: Db,
  from: Date,
  to: Date,
  venueId?: ObjectId,
) {
  const evs = await Promise.all([
    getEvents(db, from, to, venueId),
    getDayparties(db, from, to, venueId),
    getConference(db, from, to, venueId),
  ]);
  return evs.flat();
}

export async function groupedAllEventsByHour(db: Db, from: Date, to: Date) {
  const evs = await getAllEvents(db, from, to);
  const grouped = group(evs, getEventGroup);
  return grouped;
}

function getEventGroup(
  ev: Awaited<ReturnType<typeof getAllEvents>>[0],
): string {
  return format(ev.eventAt, "yyyy-MM-dd HH:mm");
}
