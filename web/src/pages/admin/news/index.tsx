import { type ObjectId } from "bson";
import { sort } from "radash";
import { useMemo } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import Table from "~/components/Table";
import { type RouterOutputs, api } from "~/utils/api";

type NewsItem = RouterOutputs["admin"]["news"]["getAll"][0];

export default function NewsList() {
  const news = api.admin.news.getAll.useQuery();

  const list = useMemo(() => {
    if (news.data) {
      return sort(news.data, (item) => item.published.getTime() * -1);
    }
    return [] as NewsItem[];
  }, [news.data]);

  return (
    <LayoutAdmin>
      <h1>News</h1>
      {news.data && (
        <Table
          data={list}
          columns={["title", "hearts", "published"]}
          features={["edit", "delete"]}
          baseUrl="/admin/news"
          transformers={{
            _id: (value: ObjectId) => (
              <a href={`/admin/news/${value.toString()}`}>{value.toString()}</a>
            ),
            title: (value: string, node: { _id: ObjectId }) => (
              <a href={`/admin/news/${node._id.toString()}`}>{value}</a>
            ),
            hearts: (value: string[]) => value.length ?? 0,
            published: (value) => value.toLocaleDateString(),
          }}
        />
      )}
    </LayoutAdmin>
  );
}
