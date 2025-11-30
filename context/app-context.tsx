import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Appointment } from '@/types';

interface AppContextType {
  user: User | null;
  appointments: Appointment[];
  updateUser: (user: User) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  loadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_USER_KEY = '@salon:user';
const STORAGE_APPOINTMENTS_KEY = '@salon:appointments';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_USER_KEY);
      const appointmentsData = await AsyncStorage.getItem(STORAGE_APPOINTMENTS_KEY);

      if (userData) setUser(JSON.parse(userData));
      if (appointmentsData) setAppointments(JSON.parse(appointmentsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateUser = async (newUser: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addAppointment = async (appointment: Appointment) => {
    try {
      const newAppointments = [...appointments, appointment];
      await AsyncStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppointments));
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const updateAppointment = async (id: string, updatedData: Partial<Appointment>) => {
    try {
      const newAppointments = appointments.map(apt =>
        apt.id === id ? { ...apt, ...updatedData } : apt
      );
      await AsyncStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppointments));
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const newAppointments = appointments.filter(apt => apt.id !== id);
      await AsyncStorage.setItem(STORAGE_APPOINTMENTS_KEY, JSON.stringify(newAppointments));
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        appointments,
        updateUser,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        loadData,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
