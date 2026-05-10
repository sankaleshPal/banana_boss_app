import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { EmptyState } from '@/components/shared';

export function NpcScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  return (
    <ScreenWrapper>
      <TopBar title="NPC" showBack onBack={() => navigation.goBack()} />
      <EmptyState title="NPC Management" subtitle="Non-paying customer records will appear here." icon="users" />
    </ScreenWrapper>
  );
}
