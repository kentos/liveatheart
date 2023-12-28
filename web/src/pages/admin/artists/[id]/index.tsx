import { ObjectId } from "bson";
import { noop } from "lodash";
import { useRouter } from "next/router";
import { alphabetical } from "radash";
import { useMemo, useState } from "react";
import ItemDisplay from "~/components/ItemDisplay";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import Modal from "~/components/Modal";
import { type RouterOutputs, api } from "~/utils/api";
import slug from "~/utils/slug";

export default function Artist() {
  const router = useRouter();
  const artist = api.admin.artists.getOne.useQuery({
    id: new ObjectId(router.query.id as string),
  });

  const update = api.admin.artists.update.useMutation({
    onSuccess: async () => {
      void artist.refetch();
    },
  });

  const _delete = api.admin.artists.delete.useMutation({
    onSuccess: async () => {
      void router.replace("/admin/artists");
    },
  });

  return (
    <LayoutAdmin>
      {artist.data && (
        <ItemDisplay
          data={artist.data}
          fields={[
            "name",
            "countryCode",
            "image",
            "description",
            "spotify",
            "youtube",
          ]}
          customActions={[
            {
              name: "Delete",
              onClick: () => {
                if (
                  artist.data?._id &&
                  confirm("Are you sure you want to delete this artist?")
                ) {
                  _delete.mutate({
                    id: new ObjectId(artist.data._id),
                  });
                }
              },
            },
            artist.data?.published === false
              ? {
                  name: "Publish",
                  onClick: () => {
                    if (
                      confirm("Are you sure you want to publish this artist?")
                    ) {
                      update.mutate({
                        id: new ObjectId(artist.data?._id),
                        fields: {
                          published: true,
                        },
                      });
                    }
                  },
                }
              : {
                  name: "Unpublish",
                  onClick: () => {
                    if (
                      confirm("Are you sure you want to unpublish this artist?")
                    ) {
                      update.mutate({
                        id: new ObjectId(artist.data?._id),
                        fields: {
                          published: false,
                        },
                      });
                    }
                  },
                },
          ]}
          customFields={[
            {
              field: "categories",
              Component: (node) => {
                return (
                  <EditCategory
                    artist={node}
                    onUpdate={async (category) => {
                      if (!artist.data?._id) {
                        return;
                      }
                      await update.mutateAsync({
                        id: new ObjectId(artist.data._id),
                        fields: {
                          categories: [
                            { name: category, slug: slug(category) },
                          ],
                        },
                      });
                    }}
                  />
                );
              },
            },
          ]}
          onUpdate={async (field, value) => {
            if (!artist.data?._id) {
              return;
            }
            await update.mutateAsync({
              id: new ObjectId(artist.data._id),
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

function EditCategory({
  artist,
  onUpdate,
}: {
  artist: RouterOutputs["admin"]["artists"]["getAll"]["0"];
  onUpdate?: (category: string) => void;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [current, setCurrent] = useState(artist.categories?.[0]?.name ?? "");

  return (
    <>
      <div role="button" onClick={() => setIsOpened(true)}>
        {artist.categories?.map((c) => c.name).join(", ") ?? ""}
      </div>
      {isOpened && (
        <Modal
          onClose={() => {
            setIsOpened(false);
            if (current !== artist.categories?.[0]?.name) {
              onUpdate?.(current);
            }
          }}
          title="Categories"
          action={current !== artist.categories?.[0]?.name ? "✔" : undefined}
        >
          <div>
            <CategoriesList
              setSelected={setCurrent}
              selectedCategory={current}
            />
          </div>
        </Modal>
      )}
    </>
  );
}

function CategoriesList({ setSelected = noop, selectedCategory = "" }) {
  const categories = api.admin.artists.categories.useQuery();

  const list = useMemo(() => {
    return alphabetical(categories.data ?? [], (x) => x);
  }, [categories.data]);

  return (
    <div>
      {list.map((category) => (
        <div key={category}>
          <input
            type="radio"
            checked={selectedCategory === category}
            onChange={() => {
              setSelected(category);
            }}
          />
          <label>{category}</label>
        </div>
      ))}
    </div>
  );
}
