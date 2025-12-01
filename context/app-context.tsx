import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Appointment, SalonConfig, Service, WorkingHours } from '@/types';
import { onAuthStateChanged } from '@/services/auth';
import type { User as FirebaseUser } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  authUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  appointments: Appointment[];
  salonConfig: SalonConfig | null;
  updateUser: (user: User) => Promise<void>;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  updateSalonConfig: (config: SalonConfig) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateWorkingHours: (hours: WorkingHours[]) => Promise<void>;
  loadData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_USER_KEY = '@salon:user';
const STORAGE_APPOINTMENTS_KEY = '@salon:appointments';
const STORAGE_SALON_CONFIG_KEY = '@salon:config';

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [salonConfig, setSalonConfig] = useState<SalonConfig | null>(null);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_USER_KEY);
      const appointmentsData = await AsyncStorage.getItem(STORAGE_APPOINTMENTS_KEY);
      const salonConfigData = await AsyncStorage.getItem(STORAGE_SALON_CONFIG_KEY);

      if (userData) setUser(JSON.parse(userData));
      if (appointmentsData) setAppointments(JSON.parse(appointmentsData));
      if (salonConfigData) setSalonConfig(JSON.parse(salonConfigData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      setAuthUser(firebaseUser);

      if (firebaseUser) {
        const existingUser = await AsyncStorage.getItem(STORAGE_USER_KEY);
        if (!existingUser) {
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            phone: firebaseUser.phoneNumber || '',
            salonName: '',
            address: '',
          };
          await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
          setUser(newUser);
        }
        await loadData();
      } else {
        setUser(null);
        setAppointments([]);
        setSalonConfig(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
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

  const updateSalonConfig = async (config: SalonConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_SALON_CONFIG_KEY, JSON.stringify(config));
      setSalonConfig(config);
    } catch (error) {
      console.error('Error updating salon config:', error);
    }
  };

  const addService = async (service: Service) => {
    try {
      const currentConfig = salonConfig || {
        id: Date.now().toString(),
        salonName: '',
        slug: '',
        workingHours: [],
        services: [],
      };
      const newServices = [...currentConfig.services, service];
      const newConfig = { ...currentConfig, services: newServices };
      await AsyncStorage.setItem(STORAGE_SALON_CONFIG_KEY, JSON.stringify(newConfig));
      setSalonConfig(newConfig);
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const updateService = async (id: string, updatedData: Partial<Service>) => {
    try {
      if (!salonConfig) return;
      const newServices = salonConfig.services.map(svc =>
        svc.id === id ? { ...svc, ...updatedData } : svc
      );
      const newConfig = { ...salonConfig, services: newServices };
      await AsyncStorage.setItem(STORAGE_SALON_CONFIG_KEY, JSON.stringify(newConfig));
      setSalonConfig(newConfig);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const deleteService = async (id: string) => {
    try {
      if (!salonConfig) return;
      const newServices = salonConfig.services.filter(svc => svc.id !== id);
      const newConfig = { ...salonConfig, services: newServices };
      await AsyncStorage.setItem(STORAGE_SALON_CONFIG_KEY, JSON.stringify(newConfig));
      setSalonConfig(newConfig);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const updateWorkingHours = async (hours: WorkingHours[]) => {
    try {
      if (!salonConfig) return;
      const newConfig = { ...salonConfig, workingHours: hours };
      await AsyncStorage.setItem(STORAGE_SALON_CONFIG_KEY, JSON.stringify(newConfig));
      setSalonConfig(newConfig);
    } catch (error) {
      console.error('Error updating working hours:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        authUser,
        isAuthenticated: !!authUser,
        isLoading,
        appointments,
        salonConfig,
        updateUser,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        updateSalonConfig,
        addService,
        updateService,
        deleteService,
        updateWorkingHours,
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
