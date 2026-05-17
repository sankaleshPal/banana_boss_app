/**
 * DateRangePicker — bottom-sheet preset picker with billing-timing support.
 *
 * Mirrors the logic of banana_boss's DateRangeDropdown:
 *  - Named presets (Today / Yesterday / Week / Month): tap -> apply + close.
 *  - Billing times from the outlet detail (billingStartTime / billingEndTime)
 *    are applied automatically to every preset, exactly as the web dashboard does.
 *  - When billing times load / change, the current named preset is re-applied
 *    with corrected timestamps (no user action required).
 */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useOutletDetails } from '@/queries/outlets';
import { formatDateShort, getBusinessDayRange } from '@/utils/date';
import type { DateRangeValue, DateRangePreset } from '@/stores/appStore';
import { fonts } from '@/theme';

// Preset raw-range helpers (calendar-only, no billing offset)
function getTodayRaw(): { from: number; to: number } {
  const from = new Date(); from.setHours(0, 0, 0, 0);
  const to   = new Date(); to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}
function getYesterdayRaw(): { from: number; to: number } {
  const from = new Date(); from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0);
  const to   = new Date(); to.setDate(to.getDate() - 1); to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}
function getThisWeekRaw(): { from: number; to: number } {
  const now  = new Date();
  const from = new Date(now); from.setDate(now.getDate() - 7); from.setHours(0, 0, 0, 0);
  const to   = new Date(now); to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}
function getThisMonthRaw(): { from: number; to: number } {
  const now  = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1); from.setHours(0, 0, 0, 0);
  const to   = new Date(now); to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}
function getRawRange(preset: DateRangePreset): { from: number; to: number } {
  switch (preset) {
    case 'today':      return getTodayRaw();
    case 'yesterday':  return getYesterdayRaw();
    case 'this_week':  return getThisWeekRaw();
    case 'this_month': return getThisMonthRaw();
    default:           return getTodayRaw();
  }
}

const PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: 'Today',      value: 'today' },
  { label: 'Yesterday',  value: 'yesterday' },
  { label: 'This Week',  value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
];

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  outletId?: string | null;
  /** Render the trigger button in light-on-dark style (for dark headers) */
  dark?: boolean;
}

export const DateRangePicker = React.memo(function DateRangePicker({
  value,
  onChange,
  outletId,
  dark = false,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const { data: outletDetail } = useOutletDetails(outletId ?? null);
  const billingStart = outletDetail?.billingStartTime ?? 0;
  const billingEnd   = outletDetail?.billingEndTime   ?? 0;

  // Apply billing offset to a raw calendar range
  const applyBilling = useCallback(
    (raw: { from: number; to: number }): { from: number; to: number } => {
      const { from, to } = getBusinessDayRange(
        new Date(raw.from),
        new Date(raw.to),
        billingStart,
        billingEnd,
      );
      return { from: from.getTime(), to: to.getTime() };
    },
    [billingStart, billingEnd],
  );

  // Re-apply when billing times load / change (mirrors banana_boss DateRangeDropdown)
  useEffect(() => {
    if (!billingStart && !billingEnd) return;
    if (value.preset === 'custom') return;
    const raw = getRawRange(value.preset);
    const { from, to } = applyBilling(raw);
    if (from !== value.from || to !== value.to) {
      onChange({ from, to, preset: value.preset });
    }
  }, [billingStart, billingEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectPreset = useCallback(
    (preset: DateRangePreset) => {
      const raw = getRawRange(preset);
      const { from, to } = applyBilling(raw);
      onChange({ from, to, preset });
      setOpen(false);
    },
    [applyBilling, onChange],
  );

  // Label for the trigger
  const label =
    value.preset === 'custom'
      ? `${formatDateShort(value.from)} – ${formatDateShort(value.to)}`
      : PRESETS.find((p) => p.value === value.preset)?.label ?? 'Select date';

  const hasBilling = billingStart > 0 || billingEnd > 0;

  // Trigger button styling
  const triggerBg     = dark ? 'rgba(255,255,255,0.12)' : '#FFFFFF';
  const triggerText   = dark ? '#FFFFFF' : '#111827';
  const triggerBorder = dark ? 'transparent' : 'rgba(0,0,0,0.08)';
  const iconColor     = dark ? '#FFFFFF' : '#6B7280';

  return (
    <>
      {/* ── Trigger ──────────────────────────────────────────────── */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.75}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: triggerBg,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: triggerBorder,
          alignSelf: 'flex-start',
          gap: 6,
        }}
      >
        <Icon name="calendar" size={14} color={iconColor} />
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, fontWeight: '500', color: triggerText }}>{label}</Text>
        <Icon name="chevron-down" size={13} color={iconColor} />
      </TouchableOpacity>

      {/* ── Modal sheet ──────────────────────────────────────────── */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
          onPress={() => setOpen(false)}
        >
          <Pressable onPress={() => {}}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingTop: 8,
                paddingBottom: 40,
              }}
            >
              {/* drag handle */}
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#E5E7EB',
                  alignSelf: 'center',
                  marginBottom: 16,
                }}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.bold,
                  fontWeight: '700',
                  color: '#111827',
                  paddingHorizontal: 20,
                  marginBottom: 16,
                  letterSpacing: -0.3,
                }}
              >
                Select Date Range
              </Text>

              {PRESETS.map((p) => {
                const active = value.preset === p.value;
                return (
                  <TouchableOpacity
                    key={p.value}
                    onPress={() => selectPreset(p.value)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                      backgroundColor: active ? '#F9FAFB' : 'transparent',
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: active ? '#111827' : '#D1D5DB',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 14,
                      }}
                    >
                      {active && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#111827',
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: active ? fonts.bold : fonts.medium,
                        fontWeight: active ? '700' : '500',
                        color: active ? '#111827' : '#374151',
                        flex: 1,
                      }}
                    >
                      {p.label}
                    </Text>
                    {active && (
                      <Icon name="check" size={16} color="#111827" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {hasBilling && (
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 16,
                    backgroundColor: '#FEF9C3',
                    borderRadius: 10,
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 8,
                  }}
                >
                  <Icon name="clock" size={13} color="#92400E" style={{ marginTop: 1 }} />
                  <Text style={{ fontSize: 12, color: '#78350F', flex: 1, lineHeight: 18 }}>
                    Billing shift applied — dates use your outlet's configured start &amp; end times.
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
});
