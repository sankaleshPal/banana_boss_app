/**
 * LoadingSkeleton — animated pulse skeletons matching banana_boss web app's loading UI.
 *
 * Web pattern (UnifiedSales.tsx, BillingsView.tsx, DuesView.tsx, ModesView.tsx):
 *  - animate-pulse on grey/white rounded blocks
 *  - Shapes mirror the real content layout exactly
 *  - Subtle border + near-white background for card types
 *  - Thin flat grey bars for list/table row types
 */
import React from 'react';
import { View, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import { colors } from '@/theme';

// ─── Shared pulse wrapper ─────────────────────────────────────────────────────

function Pulse({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <MotiView
      from={{ opacity: 0.35 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 900,
        delay,
        loop: true,
        repeatReverse: true,
      }}
    >
      {children}
    </MotiView>
  );
}

// ─── Skeleton atoms ───────────────────────────────────────────────────────────

/** A white card placeholder with border — mirrors the web's card skeleton */
function CardBlock({
  height = 112,
  radius = 18,
  delay = 0,
  width,
}: {
  height?: number;
  radius?: number;
  delay?: number;
  width?: number | string;
}) {
  return (
    <Pulse delay={delay}>
      <View
        style={{
          height,
          width: width as any,
          backgroundColor: colors.surface.card,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: colors.surface.borderSoft,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        }}
      />
    </Pulse>
  );
}

/** A flat grey bar — mirrors the web's list/table row skeleton */
function BarBlock({
  height = 56,
  radius = 12,
  delay = 0,
}: {
  height?: number;
  radius?: number;
  delay?: number;
}) {
  return (
    <Pulse delay={delay}>
      <View
        style={{
          height,
          backgroundColor: 'rgba(26,22,18,0.05)',
          borderRadius: radius,
        }}
      />
    </Pulse>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export type SkeletonType =
  | 'metric-card'   // SalesDashboard, NetSalesSummary — horizontal scroll of metric cards
  | 'bill-row'      // BillsList, BillDetail — list of bill rows
  | 'report-table'  // All report screens — table header + data rows
  | 'report-card'   // Generic 2-col grid of cards
  | 'card-grid';    // Dues, PaymentModes — 2-col grid of tall cards

interface LoadingSkeletonProps {
  type: SkeletonType;
  count?: number;
}

export const LoadingSkeleton = React.memo(function LoadingSkeleton({
  type,
  count = 4,
}: LoadingSkeletonProps) {

  // ── metric-card ─────────────────────────────────────────────────────────────
  // Mirrors: UnifiedSales.tsx loading state
  //   - A big full-width block (header/date-picker area)
  //   - Section label line
  //   - Horizontal row of metric card blocks
  if (type === 'metric-card') {
    const cards = Array.from({ length: count });
    return (
      <View style={{ marginTop: 12 }}>
        {/* Big header block */}
        <Pulse delay={0}>
          <View
            style={{
              height: 80,
              backgroundColor: colors.surface.card,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.surface.borderSoft,
              marginBottom: 24,
              shadowColor: colors.primaryDark,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          />
        </Pulse>

        {/* Section label line */}
        <Pulse delay={100}>
          <View
            style={{
              height: 10,
              width: 120,
              backgroundColor: colors.surface.borderSoft,
              borderRadius: 6,
              marginBottom: 14,
            }}
          />
        </Pulse>

        {/* Horizontal metric cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {cards.map((_, i) => (
              <CardBlock
                key={i}
                height={110}
                radius={18}
                width={130}
                delay={i * 80}
              />
            ))}
          </View>
        </ScrollView>

        {/* Second section */}
        <Pulse delay={200}>
          <View
            style={{
              height: 10,
              width: 140,
              backgroundColor: colors.surface.borderSoft,
              borderRadius: 6,
              marginTop: 24,
              marginBottom: 14,
            }}
          />
        </Pulse>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => (
              <CardBlock
                key={i}
                height={110}
                radius={18}
                width={130}
                delay={300 + i * 80}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── bill-row ────────────────────────────────────────────────────────────────
  // Mirrors: BillingsView.tsx — "h-14 bg-base-200 border-2 rounded-xl animate-pulse"
  if (type === 'bill-row') {
    const items = Array.from({ length: count });
    return (
      <View style={{ gap: 8, marginTop: 12 }}>
        {items.map((_, i) => (
          <Pulse key={i} delay={i * 60}>
            <View
              style={{
                height: 64,
                backgroundColor: 'rgba(26,22,18,0.05)',
                borderRadius: 14,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                gap: 12,
              }}
            >
              {/* Left content block */}
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ height: 10, width: '55%', backgroundColor: 'rgba(26,22,18,0.08)', borderRadius: 5 }} />
                <View style={{ height: 8,  width: '35%', backgroundColor: 'rgba(26,22,18,0.05)', borderRadius: 4 }} />
              </View>
              {/* Right amount block */}
              <View style={{ height: 14, width: 64, backgroundColor: 'rgba(26,22,18,0.08)', borderRadius: 6 }} />
            </View>
          </Pulse>
        ))}
      </View>
    );
  }

  // ── report-table ────────────────────────────────────────────────────────────
  // Mirrors: ReportTableView / all report screens — header + data rows
  if (type === 'report-table') {
    const rows = Array.from({ length: count });
    return (
      <View style={{ marginTop: 12 }}>
        {/* Table header */}
        <BarBlock height={40} radius={10} delay={0} />
        <View style={{ height: 6 }} />
        {rows.map((_, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <BarBlock height={36} radius={8} delay={60 + i * 50} />
          </View>
        ))}
      </View>
    );
  }

  // ── card-grid ───────────────────────────────────────────────────────────────
  // Mirrors: DuesView.tsx + ModesView.tsx — "h-28 bg-white rounded-3xl animate-pulse"
  if (type === 'card-grid') {
    const items = Array.from({ length: count });
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 12,
        }}
      >
        {items.map((_, i) => (
          <CardBlock key={i} height={110} radius={22} width="47%" delay={i * 70} />
        ))}
      </View>
    );
  }

  // ── report-card (fallback) ──────────────────────────────────────────────────
  const items = Array.from({ length: count });
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
      {items.map((_, i) => (
        <CardBlock key={i} height={90} radius={14} width="47%" delay={i * 70} />
      ))}
    </View>
  );
});
