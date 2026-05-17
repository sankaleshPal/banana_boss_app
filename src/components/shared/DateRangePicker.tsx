/**
 * DateRangePicker — bottom-sheet preset picker with billing-timing support.
 *
 * Mirrors the logic of banana_boss's DateRangeDropdown:
 *  - Named presets (Today / Yesterday / Week / Month): tap → apply + close.
 *  - Billing times from the outlet detail (billingStartTime / billingEndTime)
 *    are applied automatically to every preset, exactly as the web dashboard does.
 *  - When billing times load / change, the current named preset is re-applied
 *    with corrected timestamps (no user action required).
 */
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useOutletDetails } from '@/queries/outlets';
import { formatDateShort, getBusinessDayRange } from '@/utils/date';
import type { DateRangeValue, DateRangePreset } from '@/stores/appStore';

// ─── Preset helpers (same as banana_boss utils) ───────────────────────────────

function getTodayRaw(): { from: number; to: number } {
  const from = new Date(); from.setHours(0, 0, 0, 0);
  const to   = new Date(); to.setHours(23, 59, 59, 999);
  return { from: from.getTime(), to: to.getTime() };
}
function getYesterdayRaw(): { from: number; to: number } {
  const from = new Date(); from.setDate(from.getDate() - 1); from.setHours(0, 0, 0, 0);
  const to   = new Date(); to.setDate(to.getDate() - 1);     to.setHours(23, 59, 59, 999);
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  /** Pass the selected outlet's ID so billing times can be fetched and applied */
  outletId?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const DateRangePicker = React.memo(function DateRangePicker({
  value,
  onChange,
  outletId,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  // Fetch outlet billing times (same as banana_boss useOutletDetails)
  const { data: outletDetail } = useOutletDetails(outletId ?? null);
  const billingStart = outletDetail?.billingStartTime ?? 0;
  const billingEnd   = outletDetail?.billingEndTime   ?? 0;

  // ── Apply billing times to a raw midnight-to-midnight range ────────────────
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

  // When outlet billing times load/change, re-apply them to the current named
  // preset — matching banana_boss's useEffect on billingStart/billingEnd.
  useEffect(() => {
    if (!billingStart && !billingEnd) return;    // no billing config
    if (value.preset === 'custom') return;       // never override a custom range
    const raw = getRawRange(value.preset);
    const { from, to } = applyBilling(raw);
    if (from !== value.from || to !== value.to) {
      onChange({ from, to, preset: value.preset });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingStart, billingEnd]);

  // ── Preset selection ───────────────────────────────────────────────────────
  const selectPreset = useCallback(
    (preset: DateRangePreset) => {
      const raw = getRawRange(preset);
      const { from, to } = applyBilling(raw);
      onChange({ from, to, preset });
      setOpen(false);
    },
    [applyBilling, onChange],
  );

  // ── Trigger label ──────────────────────────────────────────────────────────
  const triggerLabel = (() => {
    switch (value.preset) {
      case 'today':      return 'Today';
      case 'yesterday':  return 'Yesterday';
      case 'this_week':  return `Week  ${formatDateShort(value.from)} – ${formatDateShort(value.to)}`;
      case 'this_month': return `Month  ${formatDateShort(value.from)} – ${formatDateShort(value.to)}`;
      case 'custom':     return `${formatDateShort(value.from)} – ${formatDateShort(value.to)}`;
      default:           return 'Select range';
    }
  })();

  return (
    <>
      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={s.trigger}
      >
        <Icon name="calendar" size={14} color="#374151" style={{ marginRight: 6 }} />
        <Text style={s.triggerText}>{triggerLabel}</Text>
        <Icon name="chevron-down" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* Bottom-sheet modal */}
      <Modal visible={open} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.sheet}>
            {/* Header */}
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Select Date Range</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Icon name="x" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Billing-time note */}
            {(billingStart !== 0 || billingEnd !== 0) && (
              <View style={s.billingNote}>
                <Icon name="clock" size={12} color="#6366F1" style={{ marginRight: 5 }} />
                <Text style={s.billingNoteText}>
                  Billing window applied: {billingStart % 60 === 0
                    ? `${billingStart / 60}:00` : `${Math.floor(billingStart/60)}:${String(billingStart%60).padStart(2,'0')}`
                  } – {billingEnd % 60 === 0
                    ? `${billingEnd / 60}:00` : `${Math.floor(billingEnd/60)}:${String(billingEnd%60).padStart(2,'0')}`
                  }
                </Text>
              </View>
            )}

            {/* Preset list */}
            {PRESETS.map((p) => {
              const isActive = value.preset === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  onPress={() => selectPreset(p.value)}
                  style={[s.presetRow, isActive && s.presetRowActive]}
                >
                  <Text style={[s.presetLabel, isActive && s.presetLabelActive]}>
                    {p.label}
                  </Text>
                  {isActive && <Icon name="check" size={16} color="#111827" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  trigger: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    alignSelf: 'flex-start' as const,
    marginVertical: 8,
  },
  triggerText: { fontSize: 13, fontWeight: '600' as const, color: '#374151' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end' as const,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800' as const, color: '#111827' },
  billingNote: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  billingNoteText: { fontSize: 11, fontWeight: '600' as const, color: '#4338CA' },
  presetRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
  },
  presetRowActive: { backgroundColor: '#FDE047' },
  presetLabel: { fontSize: 14, fontWeight: '600' as const, color: '#111827' },
  presetLabelActive: { fontWeight: '700' as const },
} as const;
