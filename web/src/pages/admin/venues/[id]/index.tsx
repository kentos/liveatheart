import { ObjectId } from "bson";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import ItemDisplay from "~/components/ItemDisplay";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { type RouterOutputs, api } from "~/utils/api";

type Venue = RouterOutputs["admin"]["venues"]["getOne"];

export default function Venue() {
  const router = useRouter();
  const venue = api.admin.venues.getOne.useQuery(
    { id: new ObjectId(router.query.id as string) },
    { enabled: !!router.query.id },
  );

  const update = api.admin.venues.update.useMutation({
    onSuccess: () => {
      void venue.refetch();
    },
  });

  return (
    <LayoutAdmin>
      {venue.data && (
        <ItemDisplay<Venue>
          data={venue.data}
          fields={["name", "address", "color", "slug", "type"]}
          customFields={[
            {
              field: "coordinates",
              Component: (node) => (
                <>
                  {node.coordinates?.latitude}, {node.coordinates?.longitude}
                </>
              ),
            },
            {
              field: "pasteLink",
              Component: () => <ExtractUrl venue={venue.data} />,
            },
          ]}
          onUpdate={(field, value) => {
            if (venue.data?._id) {
              void update.mutate({
                id: new ObjectId(venue.data._id),
                fields: {
                  [String(field)]: value,
                },
              });
            }
            return Promise.resolve();
          }}
        />
      )}
    </LayoutAdmin>
  );
}

function ExtractUrl({ venue }: { venue: Venue }) {
  const [url, setUrl] = useState("");
  const extract = api.common.coordinatesFromUrl.useMutation({
    onSuccess(data) {
      console.log("EXTRACTED", data);
    },
  });

  const utils = api.useUtils();
  const update = api.admin.venues.update.useMutation({
    onSuccess: () => {
      void utils.admin.venues.getOne.refetch();
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (url) {
      extract.mutate({ url });
    }
  };

  return (
    <>
      <div className="flex">
        <input
          type="text"
          className="flex-1"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <button type="button" onClick={onSubmit} disabled={extract.isLoading}>
          Extract
        </button>
      </div>
      <div>
        {extract.data && (
          <>
            <div>
              {extract.data.longitude}, {extract.data.latitude}
              <button
                type="button"
                onClick={() =>
                  extract.data.latitude &&
                  extract.data.longitude &&
                  update.mutate({
                    id: new ObjectId(venue._id),
                    fields: {
                      coordinates: {
                        latitude: extract.data.latitude,
                        longitude: extract.data.longitude,
                      },
                    },
                  })
                }
              >
                Set as coordinates
              </button>
            </div>
            <div>
              {extract.data.name}{" "}
              <button
                type="button"
                onClick={() =>
                  extract.data.name &&
                  update.mutate({
                    id: new ObjectId(venue._id),
                    fields: {
                      address: extract.data.name,
                    },
                  })
                }
              >
                Set as address
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
