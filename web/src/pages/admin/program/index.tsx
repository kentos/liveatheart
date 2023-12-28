import { format, parseISO } from "date-fns";
import { useMemo, useRef } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { api } from "~/utils/api";

export default function ProgramIndex() {
  const allDates = api.admin.program.getAll.useQuery();
  const artists = api.admin.artists.getAll.useQuery();

  const allArtists = useMemo(() => artists.data ?? [], [artists.data]);

  return (
    <LayoutAdmin>
      <h1>Program</h1>
      <AddDateForm />
      <table>
        <thead>
          <tr>
            {allDates.data?.map((date) => (
              <th key={date._id.toString()}>
                {format(date.date, "yyyy-MM-dd")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {allDates.data?.map((date, ix) => (
              <td key={ix} className="p-0">
                <table className="w-full border-none p-0">
                  <tbody>
                    {date.slots?.map((slot) => (
                      <tr>
                        <td
                          className="border-l-0 border-t-0"
                          title={slot.date.toUTCString()}
                        >
                          {format(slot.date, "HH:mm")}
                        </td>
                        <td className="border-r-0 border-t-0">
                          <select className="w-full">
                            <option></option>
                            {allArtists.map((artist) => (
                              <option key={artist._id.toString()}>
                                {artist.name}
                              </option>
                            ))}
                          </select>
                          <select className="w-full">
                            <option></option>
                            <option>Venue goes here</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </LayoutAdmin>
  );
}

function AddDateForm() {
  const dateRef = useRef<HTMLInputElement>(null);
  const addDate = api.admin.program.addDate.useMutation();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!dateRef.current?.value) return;

    addDate.mutate({
      date: parseISO(dateRef.current.value),
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="datetime-local" ref={dateRef} />
      <input type="submit" value="Add date" />
    </form>
  );
}
