import { type FormEvent, useRef, useState, useEffect } from "react";
import Row from "./Row";
import { parseISO } from "date-fns";
import { useRouter } from "next/router";

type Props<T extends object> = {
  data: T;
  fields: Readonly<(keyof T)[]>;
  customFields?: { field: string; Component: (node: T) => React.ReactNode }[];
  customActions?: {
    name: string;
    onClick: () => void;
  }[];
  onUpdate?: <K = keyof T>(field: K, value: unknown) => Promise<void>;
  children?: React.ReactNode;
};

export default function ItemDisplay<T extends object>({
  data,
  fields,
  customFields,
  customActions,
  onUpdate,
  children,
}: Props<T>) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState<keyof T | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [inputRef, editing]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditing(null);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (onUpdate && inputRef.current?.value && editing) {
      setIsSaving(true);
      const before = data[editing];
      const value = transformValue(inputRef.current.value, before);
      await onUpdate(editing, value);
      setIsSaving(false);
    }
    setEditing(null);
  };

  const onReset = () => {
    setEditing(null);
  };

  return (
    <>
      <form onSubmit={onSubmit} onReset={onReset}>
        <div className="flex justify-between border border-b-0 border-gray-300 bg-blue-100 p-2">
          <div>
            <button
              type="button"
              disabled={!!editing}
              onClick={() => router.back()}
            >
              &laquo; Back
            </button>
          </div>
          {customActions && (
            <div className="flex gap-2">
              {customActions.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  disabled={!!editing}
                  onClick={a.onClick}
                >
                  {a.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <table className="w-full">
          <tbody>
            {fields.map((f) => {
              return (
                <Row
                  key={String(f)}
                  ref={inputRef}
                  fieldName={String(f)}
                  disabled={isSaving}
                  value={data[f]}
                  onClick={() => setEditing(f)}
                  isEditing={editing === f}
                />
              );
            })}
            {customFields?.map((f) => (
              <Row
                key={String(f.field)}
                fieldName={String(f.field)}
                value={f.Component(data)}
                disabled={false}
                isEditing={false}
              />
            ))}
          </tbody>
        </table>
      </form>
      {children}
      <ItemMetadata item={data} />
    </>
  );
}

const metadataFields = [
  "createdAt",
  "updatedAt",
  "_id",
  "published",
  "deletedAt",
] as const;
type MetadataField = (typeof metadataFields)[number];

function ItemMetadata<T extends object>({ item }: { item: T }) {
  const meta = Object.keys(item).filter((k) =>
    metadataFields.includes(k as MetadataField),
  );

  if (meta.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border px-4 py-2 ">
      <h2>Metadata</h2>
      <table>
        <tbody>
          {meta.map((k) => (
            <Row key={k} fieldName={k} value={item[k as keyof T]} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function transformValue(after: unknown, before?: unknown) {
  if (before instanceof Date) {
    return parseISO(String(after));
  }
  return after;
}
