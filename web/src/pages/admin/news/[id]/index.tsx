import { ObjectId } from "bson";
import { useRouter } from "next/router";
import ItemDisplay from "~/components/ItemDisplay";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { type RouterOutputs, api } from "~/utils/api";

type Item = RouterOutputs["admin"]["news"]["getOne"];

export default function NewsItem() {
  const router = useRouter();
  const item = api.admin.news.getOne.useQuery(
    { id: new ObjectId(router.query.id as string) },
    { staleTime: Infinity, enabled: Boolean(router.query.id) },
  );

  const update = api.admin.news.update.useMutation({
    onSuccess: () => {
      void item.refetch();
    },
  });

  return (
    <LayoutAdmin>
      {item.data && (
        <ItemDisplay<Item>
          data={item.data}
          fields={["title", "content", "image", "link", "published"]}
          customFields={[
            {
              field: "hearts",
              Component: (node) => node.hearts?.length ?? "0",
            },
          ]}
          onUpdate={async <K = keyof Item,>(field: K, value: unknown) => {
            await update.mutateAsync({
              id: new ObjectId(item.data._id),
              fields: {
                [String(field)]: value,
              },
            });
          }}
        />
      )}
    </LayoutAdmin>
  );
}
