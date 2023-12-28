import { useRouter } from "next/router";
import { useState } from "react";
import LayoutAdmin from "~/components/Layout/LayoutAdmin";
import { api } from "~/utils/api";
import slug from "~/utils/slug";

type S = Record<string, string>;

export default function ArtistCreate() {
  const router = useRouter();
  const [data, setData] = useState<S | null>(null);
  const create = api.admin.artists.create.useMutation({
    onSuccess(data) {
      if (data) {
        void router.replace(`/admin/artists/${data.toString()}`);
      }
    },
  });

  const setFieldData = (field: string) => (text: string) => {
    setData((prev) => ({ ...prev, [field]: text }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data?.name || !data.countryCode || !data.category) {
      return;
    }
    create.mutate({
      name: data.name,
      countryCode: data.countryCode,
      categories: [{ name: data.category, slug: slug(data.category) }],
      image: data.image,
      description: data.description,
      spotify: data.spotify,
      youtube: data.youtube,
    });
  };

  return (
    <LayoutAdmin>
      <h1>Create</h1>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-4">
          <InputField
            label="Name"
            id="name"
            type="text"
            onChangeText={setFieldData("name")}
          />
          <InputField
            label="Country Code"
            id="countryCode"
            type="text"
            onChangeText={setFieldData("countryCode")}
          />
          <InputField
            label="Category"
            id="categories"
            type="text"
            onChangeText={setFieldData("category")}
          />
          <InputField
            label="Image"
            id="image"
            type="text"
            onChangeText={setFieldData("image")}
          />
          <InputField
            label="Description"
            id="description"
            type="text"
            onChangeText={setFieldData("description")}
          />
          <InputField
            label="Spotify"
            id="spotify"
            type="text"
            onChangeText={setFieldData("spotify")}
          />
          <InputField
            label="Youtube"
            id="youtube"
            type="text"
            onChangeText={setFieldData("youtube")}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </LayoutAdmin>
  );
}

function InputField({
  label,
  id,
  type,
  onChangeText,
}: {
  label: string;
  id: string;
  type: string;
  onChangeText?: (text: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        onChange={(e) => onChangeText?.(e.currentTarget.value)}
      />
    </div>
  );
}
