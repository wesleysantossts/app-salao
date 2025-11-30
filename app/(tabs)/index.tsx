import { useState } from 'react';
import { Alert, Modal } from 'react-native';
import styled from 'styled-components/native';
import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/app-context';
import { AppointmentCard } from '@/components/appointment-card';
import { DatePicker } from '@/components/date-picker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '@/types';

export default function AppointmentsScreen() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    service: '',
    time: '',
    price: '',
  });

  const filteredAppointments = appointments.filter(
    (apt) => apt.date === format(selectedDate, 'yyyy-MM-dd')
  ).sort((a, b) => a.time.localeCompare(b.time));

  const handleOpenModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        service: appointment.service,
        time: appointment.time,
        price: appointment.price.toString(),
      });
    } else {
      setEditingAppointment(null);
      setFormData({ clientName: '', clientPhone: '', service: '', time: '', price: '' });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.clientName || !formData.service || !formData.time || !formData.price) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const appointmentData = {
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      service: formData.service,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: formData.time,
      price: parseFloat(formData.price),
      status: 'scheduled' as const,
    };

    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, appointmentData);
    } else {
      await addAppointment({
        id: Date.now().toString(),
        ...appointmentData,
      });
    }

    setModalVisible(false);
    setFormData({ clientName: '', clientPhone: '', service: '', time: '', price: '' });
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => await deleteAppointment(id),
        },
      ]
    );
  };

  const handleStatusChange = async (appointment: Appointment) => {
    const statuses: Array<'scheduled' | 'completed' | 'cancelled'> = ['scheduled', 'completed', 'cancelled'];
    const currentIndex = statuses.indexOf(appointment.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    await updateAppointment(appointment.id, { status: nextStatus });
  };

  return (
    <Container>
      <Header>
        <ThemedText type="title">Agendamentos</ThemedText>
        <DateTitle>
          {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
        </DateTitle>
      </Header>

      <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <List contentContainerStyle={{ padding: 20 }}>
        {filteredAppointments.length === 0 ? (
          <EmptyState>
            <EmptyText>Nenhum agendamento para este dia</EmptyText>
          </EmptyState>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onPress={() => {
                Alert.alert(
                  appointment.clientName,
                  'O que deseja fazer?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Editar', onPress: () => handleOpenModal(appointment) },
                    { text: 'Alterar Status', onPress: () => handleStatusChange(appointment) },
                    { text: 'Excluir', style: 'destructive', onPress: () => handleDelete(appointment.id) },
                  ]
                );
              }}
            />
          ))
        )}
      </List>

      <FAB onPress={() => handleOpenModal()}>
        <FABText>+</FABText>
      </FAB>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <ModalOverlay>
          <ModalContent>
            <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
              {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
            </ThemedText>

            <Input
              value={formData.clientName}
              onChangeText={(text: string) => setFormData({ ...formData, clientName: text })}
              placeholder="Nome do cliente *"
              placeholderTextColor="#999"
            />

            <Input
              value={formData.clientPhone}
              onChangeText={(text: string) => setFormData({ ...formData, clientPhone: text })}
              placeholder="Telefone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />

            <Input
              value={formData.service}
              onChangeText={(text: string) => setFormData({ ...formData, service: text })}
              placeholder="Serviço *"
              placeholderTextColor="#999"
            />

            <Input
              value={formData.time}
              onChangeText={(text: string) => setFormData({ ...formData, time: text })}
              placeholder="Horário (ex: 14:00) *"
              placeholderTextColor="#999"
            />

            <Input
              value={formData.price}
              onChangeText={(text: string) => setFormData({ ...formData, price: text })}
              placeholder="Valor *"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <ButtonRow>
              <SecondaryButton onPress={() => setModalVisible(false)}>
                <SecondaryButtonText>Cancelar</SecondaryButtonText>
              </SecondaryButton>
              <PrimaryButton onPress={handleSave}>
                <PrimaryButtonText>Salvar</PrimaryButtonText>
              </PrimaryButton>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: 60px;
  gap: 4px;
`;

const DateTitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-transform: capitalize;
`;

const List = styled.ScrollView`
  flex: 1;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 60px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #999;
`;

const FAB = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #007AFF;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

const FABText = styled.Text`
  font-size: 32px;
  color: #fff;
  font-weight: 300;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background-color: #fff;
  border-radius: 16px;
  padding: 20px;
  gap: 16px;
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #fff;
  color: #000;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 8px;
`;

const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  background-color: #007AFF;
`;

const PrimaryButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  align-items: center;
  background-color: #f0f0f0;
`;

const SecondaryButtonText = styled.Text`
  color: #000;
  font-size: 16px;
  font-weight: 600;
`;
