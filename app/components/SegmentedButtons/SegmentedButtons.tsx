import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import _ from 'lodash';
import SegmentedButton from './SegmentedButton';

export default function SegmentedButtons<T>({
  buttons,
  active,
  onChange,
}: {
  buttons: readonly T[];
  active: T;
  onChange: (value: T) => void;
}) {
  const [selected, setSelected] = useState<T>(active);
  useEffect(() => {
    onChange(selected);
  }, [selected]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexDirection: 'row', paddingVertical: 8 }}
    >
      {buttons.map((b) => (
        <SegmentedButton
          key={String(b)}
          text={String(b)}
          active={selected === b}
          onPress={() => setSelected(b)}
        />
      ))}
    </ScrollView>
  );
}
