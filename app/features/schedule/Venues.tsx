import { LayoutAnimation, ScrollView, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../libs/trpc';
import { Title } from '../../components/Texts';
import SegmentedButtons from '../../components/SegmentedButtons/SegmentedButtons';
import { Day, days } from './types';
import { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

function useVenues() {
  const d = trpc.program.getVenues.useQuery();
  return {
    venues: d.data || [],
    refetch: d.refetch,
  };
}

function useVenueSchedule(venueId?: string, day?: Day) {
  const d = trpc.program.getScheduleByVenue.useQuery(
    {
      venueId,
      day,
    },
    { enabled: !!venueId && !!day }
  );
  return {
    schedule: d.data?.program || [],
    refetch: d.refetch,
  };
}

export default function Venues() {
  const { venues: list2 } = useVenues();
  const [day, setDay] = useState<Day>('Wed');
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const datta = useVenueSchedule(selectedVenue, day);

  console.log(datta);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginVertical: 8 }}>
        <SegmentedButtons buttons={days} active={day} onChange={setDay} />
      </View>

      {!!selectedVenue && (
        <TouchableOpacity onPress={() => setSelectedVenue(null)}>
          <View
            style={{
              borderTopColor: Colors.light.border,
              backgroundColor: 'white',
              borderTopWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FontAwesome
              size={12}
              color={Colors.light.text}
              name={'chevron-left'}
              style={{ marginRight: 8 }}
            />
            <Title>{list2.find((v) => v._id === selectedVenue)?.name}</Title>
          </View>
        </TouchableOpacity>
      )}

      {!selectedVenue && (
        <ScrollView>
          {list2.map((venue) => (
            <TouchableOpacity
              key={venue._id.toString()}
              onPress={() => setSelectedVenue(venue._id)}
            >
              <View
                style={{
                  borderTopColor: Colors.light.border,
                  backgroundColor: 'white',
                  borderTopWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Title>{venue.name}</Title>
                <FontAwesome size={12} color={Colors.light.text} name={'chevron-right'} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
