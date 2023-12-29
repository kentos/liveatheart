import { format } from "date-fns";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import Table from "~/components/Table";
import { api } from "~/utils/api";

export default function ProgramDates() {
  const dates = api.admin.program.getAll.useQuery();

  return (
    <LayoutAdmin>
      <h1>Program dates</h1>

      <Table
        data={dates.data ?? []}
        columns={["date", "configuration"]}
        transformers={{
          date: (date: Date) => format(date, "yyyy-MM-dd (EEEE)"),
          configuration(value) {
            return (
              <div>
                <div>Starts at {value?.slotsStart}:00</div>
                <div>
                  {value?.slotsDuration ?? 0} minutes per slot /{" "}
                  {value?.numSlots} number of slots
                </div>
              </div>
            );
          },
        }}
        baseUrl="/admin/program/dates"
        features={["edit", "delete"]}
        allowFilter={false}
      />
    </LayoutAdmin>
  );
}
