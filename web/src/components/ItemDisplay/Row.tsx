import { format } from "date-fns";
import { title } from "radash";
import React, { type ForwardedRef, forwardRef, useState } from "react";

type RowProps = {
  fieldName: string;
  value: unknown;
  disabled?: boolean;
  onClick?: () => void;
  isEditing?: boolean;
};

type ForwardRefTypes = HTMLInputElement & HTMLTextAreaElement;

export default forwardRef(function RowItem(
  { fieldName, value, onClick, disabled, isEditing }: RowProps,
  ref: ForwardedRef<ForwardRefTypes>,
) {
  return (
    <tr key={String(fieldName)}>
      <td className="w-36 whitespace-nowrap bg-blue-100 text-blue-900">
        {title(String(fieldName))}
      </td>
      <td
        className="hover:bg-slate-50"
        onClick={onClick}
        role={onClick ? "button" : "none"}
      >
        {isEditing ? (
          <GenericInputField
            ref={ref}
            value={value}
            disabled={disabled ?? false}
          />
        ) : (
          <GenericDisplayValue value={value} />
        )}
      </td>
    </tr>
  );
});

function GenericDisplayValue({ value }: { value: unknown }) {
  if (typeof value === "boolean") {
    return <div>{value ? "True" : "False"}</div>;
  }
  if (!value) {
    return <div>+ Add</div>;
  }
  if (React.isValidElement(value)) {
    return value;
  }
  return formatField(value);
}

type GenericInputFieldProps = {
  value: unknown;
  disabled: boolean;
};

const GenericInputField = forwardRef(function (
  { value, disabled }: GenericInputFieldProps,
  ref: ForwardedRef<ForwardRefTypes>,
) {
  if (value instanceof Date) {
    return (
      <>
        <input
          type="datetime-local"
          ref={ref}
          disabled={disabled}
          defaultValue={format(String(value), "yyyy-MM-dd hh:mm")}
        />
        <RowActions />
      </>
    );
  }
  return (
    <>
      <TextInput
        ref={ref}
        type={String(value).length > 100 ? "textarea" : "text"}
        defaultValue={value}
      />
      <RowActions />
    </>
  );
});

type TextInput = {
  type: "text" | "textarea";
  defaultValue?: unknown;
  disabled?: boolean;
};

const TextInput = forwardRef(function (
  { type, defaultValue, disabled }: TextInput,
  ref: ForwardedRef<ForwardRefTypes>,
) {
  const [Comp, setComp] = useState<"input" | "textarea">(
    type === "text" ? "input" : "textarea",
  );
  return (
    <div className="flex items-center gap-2">
      <Comp
        ref={ref}
        className="flex-1"
        defaultValue={formatField(defaultValue)}
        disabled={disabled}
        rows={8}
      />
      <div
        className="text-2xl"
        role="button"
        onClick={() =>
          setComp((prev) => (prev === "input" ? "textarea" : "input"))
        }
      >
        🔁
      </div>
    </div>
  );
});

function RowActions() {
  return (
    <div className="mt-2 flex gap-1">
      <button type="submit">Save</button>
      <button type="reset">X Cancel</button>
    </div>
  );
}

function formatField(value: unknown) {
  if (!value) {
    return "";
  }
  if (value instanceof Date) {
    return format(value, "yyyy-MM-dd hh:mm");
  }
  if (value instanceof Array) {
    return value.join(", ");
  }
  return String(value);
}
