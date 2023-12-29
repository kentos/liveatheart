import { type UseMutateFunction } from "@tanstack/react-query";
import { ObjectId } from "bson";
import { addMinutes, format, setHours } from "date-fns";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import ItemDisplay from "~/components/ItemDisplay";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { type RouterOutputs, api, type RouterInputs } from "~/utils/api";

type Item = RouterOutputs["admin"]["program"]["getOne"];

export default function ProgramDate() {
  const router = useRouter();
  const date = api.admin.program.getOne.useQuery(
    { id: new ObjectId(router.query.id as string) },
    { enabled: !!router.query.id },
  );

  const update = api.admin.program.updateDate.useMutation({
    onSuccess: () => {
      void date.refetch();
    },
  });

  return (
    <LayoutAdmin>
      {date.data && (
        <ItemDisplay
          fields={["date"]}
          data={date.data}
          onUpdate={async (field, value) => {
            if (!date.data?._id) {
              void update.mutate({
                id: new ObjectId(date.data._id),
                [String(field)]: value,
              });
            }
          }}
        >
          <DateConfiguration item={date.data} update={update.mutate} />
        </ItemDisplay>
      )}
    </LayoutAdmin>
  );
}

function DateConfiguration({
  item,
  update,
}: {
  item: Item;
  update: UseMutateFunction<
    boolean,
    unknown,
    RouterInputs["admin"]["program"]["updateDate"]
  >;
}) {
  const [slotsStart, setSlotsStart] = useState(
    item.configuration?.slotsStart ?? 0,
  );
  const [slotsDuration, setSlotsDuration] = useState(
    item.configuration?.slotsDuration ?? 0,
  );
  const [numSlots, setNumSlots] = useState(item.configuration?.numSlots ?? 0);

  const slots = useMemo(() => {
    if (!slotsStart || !slotsDuration || !numSlots) {
      return [];
    }
    let startDate = setHours(item.date, slotsStart);
    const slots: { date: Date }[] = [];
    for (let i = 0; i < numSlots; i++) {
      slots.push({ date: startDate });
      startDate = addMinutes(startDate, slotsDuration);
    }
    return slots;
  }, [slotsStart, slotsDuration, numSlots]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      slotsStart,
      slotsDuration,
      numSlots,
    });
    update({
      id: new ObjectId(item._id),
      configuration: {
        slotsStart,
        slotsDuration,
        numSlots,
      },
    });
  };

  return (
    <form className="flex gap-4" onSubmit={onSubmit}>
      <div className="flex-1">
        <div className="flex flex-col">
          <label>Slots starts at (hour)</label>
          <input
            name="configuration.slotsStart"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={slotsStart}
            onChange={(e) => setSlotsStart(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label className="block">Slots duration (minutes)</label>
          <input
            name="configuration.slotsDuration"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={slotsDuration}
            onChange={(e) => setSlotsDuration(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label>Number of slots</label>
          <input
            name="configuration.numSlots"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={numSlots}
            onChange={(e) => setNumSlots(Number(e.target.value))}
          />
        </div>

        <div>
          <em>
            This will be the default configuration which can be overridden at
            any time
          </em>
        </div>

        <button
          type="submit"
          disabled={!(slotsStart > 0 && slotsDuration > 0 && numSlots > 0)}
        >
          Save
        </button>
      </div>

      {slotsStart > 0 && slotsDuration > 0 && numSlots > 0 && (
        <div>
          <div>Slots</div>
          <>
            {slots.map((slot, ix) => (
              <div key={ix}>{format(slot.date, "yyyy-MM-dd HH:mm")}</div>
            ))}
          </>
        </div>
      )}
    </form>
  );
}
