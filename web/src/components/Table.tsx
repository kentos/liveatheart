import { type ObjectId } from "bson";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { keys, omit, title } from "radash";
import { useCallback, useEffect, useMemo, useState } from "react";

const defaultTransformer = (value: unknown) => String(value);

export default function Table<T extends { _id: ObjectId }>({
  columns,
  data,
  transformers,
  features,
  baseUrl,
  allowFilter = true,
}: {
  columns: (keyof T)[];
  data: T[];
  transformers?: {
    [key in keyof T]?: (value: T[key], node: T) => React.ReactNode;
  };
  features?: ("edit" | "delete")[];
  baseUrl?: string;
  allowFilter?: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [filter, setFilter] = useState(extractSearchParams<Partial<T>>(params));

  useEffect(() => {
    if (filter) {
      const params = new URLSearchParams(filter);
      void router.push({ query: params.toString() });
    }
  }, [filter]);

  const listData = useMemo(() => {
    if (data && filter) {
      return data.filter((d) => {
        return (keys(filter) as (keyof T)[]).every((key) => {
          const value = d[key];
          const filterValue = filter[key];
          return String(value)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      });
    }
    return data ?? ([] as T[]);
  }, [data, filter]);

  const onSetFilter = useCallback((field: keyof T, value: string) => {
    if (!value) {
      // @ts-expect-error omit is bad
      setFilter((all) => omit(all, [field]));
    } else {
      setFilter((all) => {
        return { ...all, [field]: value };
      });
    }
  }, []);

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={String(c)}>
                {title(String(c))}
                <br />
                {allowFilter && (
                  <input
                    type="text"
                    defaultValue={filter[c]}
                    onChange={(e) => {
                      onSetFilter(c, e.target.value);
                    }}
                  />
                )}
              </th>
            ))}
            {features && <th></th>}
          </tr>
        </thead>
        <tbody>
          {listData.map((d) => (
            <tr key={d._id.toString()}>
              {columns.map((c) => {
                const value = d[c];
                if (value) {
                  if (transformers?.[c]) {
                    return (
                      <td key={c.toString()}>{transformers[c]?.(value, d)}</td>
                    );
                  }
                  return (
                    <td key={c.toString()}>{defaultTransformer(value)}</td>
                  );
                }
                return <td key={c.toString()} />;
              })}
              {features && (
                <td className="gap-2">
                  {features.includes("edit") && (
                    <Link
                      className="mx-1 inline-block"
                      href={`${baseUrl}/${d._id.toString()}`}
                    >
                      ✏️
                    </Link>
                  )}
                  {features.includes("delete") && (
                    <Link
                      className="mx-1 inline-block"
                      href={`${baseUrl}/${d._id.toString()}/delete`}
                    >
                      🗑️
                    </Link>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function extractSearchParams<T>(params: URLSearchParams) {
  const obj = {} as Record<keyof T, string>;
  for (const [key, value] of params.entries()) {
    obj[key as keyof T] = value;
  }
  return obj;
}
