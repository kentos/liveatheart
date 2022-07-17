type SlotCombined = Slot & Pick<Artist, '_id' | 'name'>;

interface Slot {
  venue_id: string;
  date: string;
}

interface Concert {
  _id: ObjectId;
  venue: {
    _id: ObjectId;
    name: string;
  };
  day: 'wednesday' | 'thursday' | 'friday' | 'saturday';
  time: string;
  eventAt: Date;
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
  concerts?: Concert[];
  countryCode?: string;
}
