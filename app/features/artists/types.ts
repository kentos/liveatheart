type SlotCombined = Slot & Pick<Artist, 'id' | 'name'>;

interface Slot {
  venue_id: string;
  date: string;
}

interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  city: string;
  country: string;
  description: string;
  slots?: Slot[];
}
