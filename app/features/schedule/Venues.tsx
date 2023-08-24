import { LayoutAnimation, ScrollView, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../libs/trpc';
import { Title } from '../../components/Texts';
import SegmentedButtons from '../../components/SegmentedButtons/SegmentedButtons';
import { Day, days } from './types';
import { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {list2.map((venue) => (
          <TouchableOpacity
            key={venue._id.toString()}
            onPress={() => navigation.navigate('VenueSchedule', { venueId: venue._id })}
          >
            <View
              style={{
                backgroundColor: 'white',
                borderBottomColor: Colors.light.border,
                borderBottomWidth: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Title>{venue.name}</Title>
              <FontAwesome size={12} color={Colors.light.tint} name={'chevron-right'} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
