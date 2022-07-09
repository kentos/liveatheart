type SlotCombined = Slot & Pick<Artist, '_id' | 'name'>;

interface Slot {
  venue_id: string;
  date: string;
}

interface Artist {
  _id: string;
  name: string;
  genre: string;
  image: string;
  city: string;
  country: string;
  description: string;
  slots?: Slot[];
  spotify?: string;
  youtube?: string;
}
