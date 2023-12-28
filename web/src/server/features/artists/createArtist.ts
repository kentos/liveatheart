import { type Db, type WithoutId } from "@heja/shared/mongodb";
import collections from "~/server/collections";
import { type Artist } from "./types";
import { ulid } from "ulidx";

type ArtistData = {
  name: string;
  countryCode: string;
  description?: string;
  image?: string;
  spotify?: string;
  youtube?: string;
  categories: { name: string; slug: string }[];
};

export default async function createArtist(db: Db, data: ArtistData) {
  const result = await collections.artists<WithoutId<Artist>>(db).insertOne({
    name: data.name,
    countryCode: data.countryCode,
    externalid: "internal_" + ulid(),
    description: data.description ?? "",
    image: data.image,
    spotify: data.spotify,
    youtube: data.youtube,
    categories: data.categories,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!result.insertedId) {
    throw new Error("Artist not created");
  }
  return result.insertedId;
}
