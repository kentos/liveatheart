import Link from "next/link";
import { alphabetical } from "radash";
import { useMemo } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import Table from "~/components/Table";
import { type RouterOutputs, api } from "~/utils/api";

type Venue = RouterOutputs["admin"]["venues"]["getAll"][0];

export default function VenuesIndex() {
  const venues = api.admin.venues.getAll.useQuery();

  const list = useMemo(
    () => alphabetical(venues.data ?? [], (v) => v.name),
    [venues.data],
  );

  return (
    <LayoutAdmin>
      <h1>Venues</h1>
      <Table<Venue>
        data={list}
        columns={["name", "type", "address"]}
        baseUrl="/admin/venues"
        transformers={{
          name: (name, venue) => (
            <Link href={`/admin/venues/${venue._id.toString()}`}>{name}</Link>
          ),
        }}
      />
    </LayoutAdmin>
  );
}
