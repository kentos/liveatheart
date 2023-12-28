import Link from "next/link";
import { alphabetical } from "radash";
import { useMemo } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import Table from "~/components/Table";
import { type RouterOutputs, api } from "~/utils/api";

type Artist = RouterOutputs["admin"]["artists"]["getAll"][0];

export default function ArtistsIndex() {
  const artists = api.admin.artists.getAll.useQuery();

  const list = useMemo(() => {
    return alphabetical(
      artists.data ?? ([] as Artist[]),
      (artist) => artist.name,
    );
  }, [artists.data]);

  return (
    <LayoutAdmin>
      <div className="flex items-center gap-4">
        <h1>Artists</h1>
        <a href="/admin/artists/create">Create new</a>
      </div>
      {artists.data && (
        <Table<Artist>
          data={list}
          columns={["name", "countryCode", "categories", "image"]}
          baseUrl="/admin/artists"
          transformers={{
            name: (value, node) => (
              <Link href={`/admin/artists/${node._id.toString()}`}>
                {value}
              </Link>
            ),
            image(value) {
              return value?.substring(0, 25) + "..." ?? "No image";
            },
            categories: (value) => value?.map((v) => v.name).join(", "),
          }}
          features={["edit"]}
        />
      )}
    </LayoutAdmin>
  );
}
