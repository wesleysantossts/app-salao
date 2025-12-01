import { AppointmentCard } from '@/components/appointment-card';
import { DatePicker } from '@/components/date-picker';
import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/app-context';
import { Appointment } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Alert, Modal } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';
import styled from 'styled-components/native';

const TIME_MASK = [/\d/, /\d/, ':', /\d/, /\d/];

export default function AppointmentsScreen() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, salonConfig } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [showServicePicker, setShowServicePicker] = useState(false);
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
        price: (appointment.price * 100).toFixed(0),
      });
    } else {
      setEditingAppointment(null);
      setFormData({ clientName: '', clientPhone: '', service: '', time: '', price: '' });
    }
    setModalVisible(true);
    setShowServicePicker(false);
  };

  const handleSelectService = (serviceName: string, servicePrice: number) => {
    setFormData({
      ...formData,
      service: serviceName,
      price: (servicePrice * 100).toFixed(0),
    });
    setShowServicePicker(false);
  };

  const handleSave = async () => {
    if (!formData.clientName || !formData.service || !formData.time || !formData.price) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const priceValue = parseFloat(formData.price.replace(/\D/g, '')) / 100;

    const appointmentData = {
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      service: formData.service,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: formData.time,
      price: priceValue,
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

            <MaskInput
              value={formData.clientPhone}
              onChangeText={(masked: string) => setFormData({ ...formData, clientPhone: masked })}
              mask={Masks.BRL_PHONE}
              placeholder="Telefone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#fff',
                color: '#000',
              }}
            />

            {salonConfig && salonConfig.services.length > 0 ? (
              <ServicePickerContainer>
                <ServiceButton onPress={() => setShowServicePicker(!showServicePicker)}>
                  <ServiceButtonText>
                    {formData.service || 'Selecionar Serviço *'}
                  </ServiceButtonText>
                  <ServiceButtonIcon>{showServicePicker ? '▲' : '▼'}</ServiceButtonIcon>
                </ServiceButton>
                {showServicePicker && (
                  <ServiceList>
                    {salonConfig.services.map((service) => (
                      <ServiceOption
                        key={service.id}
                        onPress={() => handleSelectService(service.name, service.price)}>
                        <ServiceOptionName>{service.name}</ServiceOptionName>
                        <ServiceOptionPrice>R$ {service.price.toFixed(2)}</ServiceOptionPrice>
                      </ServiceOption>
                    ))}
                  </ServiceList>
                )}
              </ServicePickerContainer>
            ) : (
              <Input
                value={formData.service}
                onChangeText={(text: string) => setFormData({ ...formData, service: text })}
                placeholder="Serviço *"
                placeholderTextColor="#999"
              />
            )}

            <MaskInput
              value={formData.time}
              onChangeText={(masked: string) => setFormData({ ...formData, time: masked })}
              mask={TIME_MASK}
              placeholder="Horário (ex: 14:00) *"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                backgroundColor: '#fff',
                color: '#000',
              }}
            />

            <PriceInput
              value={(() => {
                const cleanValue = formData.price.replace(/\D/g, '');
                const numberValue = parseFloat(cleanValue || '0') / 100;
                return numberValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              })()}
              onChangeText={(text: string) => {
                const cleanValue = text.replace(/\D/g, '');
                setFormData({ ...formData, price: cleanValue });
              }}
              placeholder="Valor (R$) *"
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

const ServicePickerContainer = styled.View`
  gap: 8px;
`;

const ServiceButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  background-color: #fff;
`;

const ServiceButtonText = styled.Text`
  font-size: 16px;
  color: #000;
`;

const ServiceButtonIcon = styled.Text`
  font-size: 12px;
  color: #666;
`;

const ServiceList = styled.View`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  background-color: #fff;
  max-height: 200px;
`;

const ServiceOption = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const ServiceOptionName = styled.Text`
  font-size: 16px;
  color: #000;
  flex: 1;
`;

const ServiceOptionPrice = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #34C759;
`;

const PriceInput = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #fff;
  color: #000;
`;
