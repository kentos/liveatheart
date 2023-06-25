// interface Slot {
//   _id: ObjectId;
//   venue: {
//     externalid: string;
//     name: string;
//   };
//   day: 'wednesday' | 'thursday' | 'friday' | 'saturday';
//   date: string;
//   time: string;
//   eventAt: Date;
// }

// interface Artist {
//   _id: string;
//   name: string;
//   genre: string;
//   image: string;
//   city: string;
//   country: string;
//   description: string;
//   spotify?: string;
//   youtube?: string;
//   slots?: Slot[];
//   countryCode?: string;
// }

// type SlotCombined = Slot & Pick<Artist, '_id' | 'name'>;
