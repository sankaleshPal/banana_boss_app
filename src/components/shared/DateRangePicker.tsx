import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDateRange } from '@/hooks/useDateRange';
import type { DateRangeValue, DateRangePreset } from '@/stores/appStore';

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
}

const presets: { label: string; value: DateRangePreset }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
];

export const DateRangePicker = React.memo(function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const { getRangeByPreset, formatRangeLabel } = useDateRange();

  const selectPreset = useCallback(
    (preset: DateRangePreset) => {
      const range = getRangeByPreset(preset);
      onChange({ ...range, preset });
      setOpen(false);
    },
    [getRangeByPreset, onChange],
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F3F4F6',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          alignSelf: 'flex-start',
        }}
      >
        <Icon name="calendar" size={14} color="#374151" style={{ marginRight: 6 }} />
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151' }}>
          {formatRangeLabel(value)}
        </Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Icon name="x" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {presets.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => selectPreset(p.value)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: value.preset === p.value ? '#FDE047' : '#F9FAFB',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: value.preset === p.value ? '700' : '600',
                    color: '#111827',
                  }}
                >
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
});
