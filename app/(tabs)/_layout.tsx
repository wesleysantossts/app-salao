import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { CalendarIcon, ChartIcon, ProfileIcon, SalonIcon } from '@/components/tab-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agendamentos',
          tabBarIcon: ({ color }) => <CalendarIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estatísticas',
          tabBarIcon: ({ color }) => <ChartIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="salon"
        options={{
          title: 'Salão',
          tabBarIcon: ({ color }) => <SalonIcon color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
