import { CalendarIcon, ChartIcon, ProfileIcon, SalonIcon } from '@/components/tab-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#F2F2F7',
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 70 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          borderRadius: 24,
          marginHorizontal: 16,
          marginBottom: 16,
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Agendamentos',
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color, size }) => <CalendarIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Estatísticas',
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => <ChartIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="salon"
        options={{
          title: 'Salão',
          tabBarLabel: 'Salão',
          tabBarIcon: ({ color, size }) => <SalonIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
