import { ObjectId } from "bson";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { alphabetical } from "radash";
import { useMemo } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { api } from "~/utils/api";

export default function ProgramIndex() {
  const searchParams = useSearchParams();
  const allDates = api.admin.program.getAll.useQuery();
  const artists = api.admin.artists.getAll.useQuery();
  const venues = api.admin.venues.getAll.useQuery();

  const venueId = searchParams.get("venue")
    ? new ObjectId(searchParams.get("venue") ?? "")
    : undefined;
  const slots = api.admin.program.slotsByVenue.useQuery(
    { venueId: venueId! },
    { enabled: !!venueId },
  );

  const allArtists = useMemo(
    () => alphabetical(artists.data ?? [], (a) => a.name),
    [artists.data],
  );
  const allVenues = useMemo(
    () => alphabetical(venues.data ?? [], (v) => v.name),
    [venues.data],
  );

  return (
    <LayoutAdmin>
      <div className="mb-4 flex gap-4">
        <h1>Program</h1>
        <SelectVenue />
        {/* <AddDateForm /> */}
      </div>

      <div className="grid grid-cols-4 gap-1">
        {allDates.data?.map((date) => (
          <div>
            <div className="bg-blue-100 p-2 font-semibold">
              {format(date.date, "yyyy-MM-dd (EEEE)")}
            </div>
            <div className="flex flex-col">
              {date.slots?.map((slot) => (
                <div className="flex gap-2 border-b p-2">
                  <div className="w-10 pt-2">{format(slot.date, "HH:mm")}</div>
                  <div className="flex-1">
                    <select className="w-full">
                      <option className="text-white"></option>
                      {allArtists.map((artist) => (
                        <option key={artist._id.toString()}>
                          {artist.name}
                        </option>
                      ))}
                    </select>

                    <select className="w-full">
                      <option></option>
                      {allVenues.map((venue) => (
                        <option key={venue._id.toString()}>{venue.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutAdmin>
  );
}

// function AddDateForm() {
//   const dateRef = useRef<HTMLInputElement>(null);
//   const addDate = api.admin.program.addDate.useMutation();

//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!dateRef.current?.value) return;

//     addDate.mutate({
//       date: parseISO(dateRef.current.value),
//     });
//   };

//   return (
//     <form onSubmit={onSubmit}>
//       <input type="datetime-local" ref={dateRef} />
//       <input type="submit" value="Add date" />
//     </form>
//   );
// }

function SelectVenue() {
  const venues = api.admin.venues.getAll.useQuery();
  const searchParams = useSearchParams();
  const router = useRouter();

  const listVenues = useMemo(
    () => alphabetical(venues.data ?? [], (v) => v.name),
    [venues.data],
  );

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const venueId = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (!venueId) {
      params.delete("venue");
    } else {
      params.set("venue", venueId);
    }
    void router.push({ query: params.toString() });
  };

  const currentVenue = searchParams.get("venue");

  return (
    <select
      onChange={onChange}
      value={currentVenue ?? undefined}
      className="w-96"
    >
      <option></option>
      {listVenues.map((venue) => (
        <option key={venue._id.toString()} value={venue._id.toString()}>
          {venue.name}
        </option>
      ))}
    </select>
  );
}
