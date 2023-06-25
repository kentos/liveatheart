import { useState, useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import _ from 'lodash';
import SegmentedButton from './SegmentedButton';

type ItemLayout = { x: number; width: number };
let width = 0;

export default function SegmentedButtons<T>({
  buttons,
  active,
  onChange,
}: {
  buttons: readonly T[];
  active: T;
  onChange: (value: T) => void;
}) {
  const scrollView = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<T>(active);
  const [items, setItems] = useState<Record<number, ItemLayout>>([]);

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  useEffect(() => {
    // On first render, scroll to the active button
    if (Object.keys(items).length > 0 && scrollView.current) {
      const ix = buttons.findIndex((b) => b === active);
      const { x: offset, width: itemWidth } = items[ix] || { x: 0, width: 0 };
      if (offset > 0) {
        scrollView.current.scrollTo({ x: offset - itemWidth, animated: false });
      }
    }
  }, [items]);

  useEffect(() => {
    if (scrollView.current) {
      const ix = buttons.findIndex((b) => b === active);
      const { x: offset, width: itemWidth } = items[ix] || { x: 0, width: 0 };
      if (offset > 0) {
        scrollView.current.scrollTo({ x: offset - itemWidth, animated: true });
      }
    }
  }, [scrollView.current, active]);

  return (
    <ScrollView
      ref={scrollView}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexDirection: 'row', paddingVertical: 8 }}
      onLayout={(e) => {
        width = e.nativeEvent.layout.width;
      }}
    >
      {buttons.map((b, ix) => (
        <View
          key={String(b)}
          onLayout={(e) => {
            e.persist();
            setItems((items) => ({
              ...items,
              [ix]: { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width },
            }));
          }}
        >
          <SegmentedButton
            key={String(b)}
            text={String(b)}
            active={selected === b}
            onPress={() => setSelected(b)}
          />
        </View>
      ))}
    </ScrollView>
  );
}
