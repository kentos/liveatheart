import { z } from "zod";
import { getAllArtists } from "../../features/artists/getAllArtists";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";
import { removeHeart, setHeart } from "../../features/artists/hearts";
import { collection, toObjectId } from "@heja/shared/mongodb";
import { type LAHEvent } from "../../features/artists/types";
import { format, subHours } from "date-fns";

function cleanCategories(a: {
  categories?: { name: string; slug: string; hidden: boolean }[];
}) {
  return (
    a.categories
      ?.filter((c) => !c.hidden && ![c.name, c.slug].includes("artists-2022"))
      .map((c) => c.name.replace("-", " "))
      .join(", ") ?? "Unknown"
  );
}

function handleSpotifyEmbed(spotifyUrl?: string) {
  if (!spotifyUrl) {
    return "";
  }
  if (
    spotifyUrl.includes("open.spotify.com") &&
    !spotifyUrl.includes("embed")
  ) {
    const url = new URL(spotifyUrl);
    return `https://open.spotify.com/embed${url.pathname}`;
  }
  return "";
}

export default createTRPCRouter({
  getAllArtists: publicProcedure.query(async ({ ctx: { db } }) => {
    const result = await getAllArtists(db);
    const slots = await collection<LAHEvent>("events")
      .find({ artistid: { $exists: true } }, { sort: { eventAt: 1 } })
      .toArray();
    return result.map((a) => ({
      _id: a._id.toString(),
      name: a.name,
      countryCode: a.countryCode ?? "",
      link: a.link,
      image: a.image,
      description: a.description,
      spotify: handleSpotifyEmbed(a.spotify),
      youtube: a.youtube,
      slots: slots
        .filter((s) => s.artistid?.equals(a._id))
        .map((s) => ({
          _id: s._id.toString(),
          venue: s.venue,
          day: (s.eventAt && format(subHours(s.eventAt, 6), "EEE")) || "",
          time: (s.eventAt && format(s.eventAt, "HH:mm")) || "",
        })),
      genre: cleanCategories(a),
    }));
  }),

  setHeart: protectedProcedure
    .input(z.object({ artistId: z.string() }))
    .mutation(async ({ ctx: { db, requester }, input }) => {
      return setHeart(db, toObjectId(input.artistId), requester);
    }),

  removeHeart: protectedProcedure
    .input(z.object({ artistId: z.string() }))
    .mutation(async ({ ctx: { db, requester }, input }) => {
      return removeHeart(db, toObjectId(input.artistId), requester);
    }),
});
