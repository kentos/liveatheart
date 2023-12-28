import { type ObjectId, type Db } from "@heja/shared/mongodb";
import collections from "../collections";
import { type News } from "./types";

export async function getAllNews(db: Db) {
  const news = await collections
    .news(db)
    .find({}, { sort: { published: -1 } })
    .toArray();
  return news;
}

export async function heartArticle(
  db: Db,
  articleId: ObjectId,
  userId: string,
) {
  const result = await collections
    .news(db)
    .findOneAndUpdate(
      { _id: articleId },
      { $addToSet: { hearts: userId } },
      { returnDocument: "after" },
    );
  if (!result.ok) {
    throw new Error("Article not updated");
  }
  if (!result.value) {
    throw new Error("Article not found");
  }
  return result.value;
}

export async function removeHeartArticle(
  db: Db,
  articleId: ObjectId,
  userId: string,
) {
  return collections
    .news(db)
    .findOneAndUpdate(
      { _id: articleId },
      { $pull: { hearts: userId } },
      { returnDocument: "after" },
    );
}

export async function updateArticle(
  db: Db,
  id: ObjectId,
  fields: { [key in keyof Partial<News>]: News[key] },
) {
  delete fields._id;
  delete fields.createdAt;

  if (Object.keys(fields).length === 0) {
    throw new Error("No fields to update");
  }

  const result = await collections
    .news(db)
    .findOneAndUpdate(
      { _id: id },
      { $set: fields },
      { returnDocument: "after" },
    );
  if (!result.ok) {
    throw new Error("Article not updated");
  }
  if (!result.value) {
    throw new Error("Article not found");
  }
  return result.value;
}
