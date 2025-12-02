import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/app-context';
import { Service, WorkingHours } from '@/types';
import { useEffect, useState } from 'react';
import { Alert, Modal, Switch } from 'react-native';
import styled from 'styled-components/native';

const DAYS_OF_WEEK = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function SalonScreen() {
  const { salonConfig, updateSalonConfig, addService, updateService, deleteService, updateWorkingHours } = useApp();
  const [salonName, setSalonName] = useState('');
  const [slug, setSlug] = useState('');
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '' });

  useEffect(() => {
    if (salonConfig) {
      setSalonName(salonConfig.salonName);
      setSlug(salonConfig.slug);
      setWorkingHours(salonConfig.workingHours.length > 0 ? salonConfig.workingHours : getDefaultWorkingHours());
    } else {
      setWorkingHours(getDefaultWorkingHours());
    }
  }, [salonConfig]);

  function getDefaultWorkingHours(): WorkingHours[] {
    return DAYS_OF_WEEK.map(day => ({
      day,
      isOpen: day !== 'Domingo',
      openTime: '09:00',
      closeTime: '18:00',
    }));
  }

  const handleSaveSalonInfo = async () => {
    if (!salonName || !slug) {
      Alert.alert('Erro', 'Nome do salão e apelido são obrigatórios');
      return;
    }

    const config = {
      id: salonConfig?.id || Date.now().toString(),
      salonName,
      slug,
      workingHours,
      services: salonConfig?.services || [],
    };

    await updateSalonConfig(config);
    Alert.alert('Sucesso', 'Informações do salão atualizadas!');
  };

  const handleSaveWorkingHours = async () => {
    await updateWorkingHours(workingHours);
    Alert.alert('Sucesso', 'Horários de funcionamento atualizados!');
  };

  const toggleDayOpen = (index: number) => {
    const newHours = [...workingHours];
    newHours[index].isOpen = !newHours[index].isOpen;
    setWorkingHours(newHours);
  };

  const updateDayTime = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const newHours = [...workingHours];
    newHours[index][field] = value;
    setWorkingHours(newHours);
  };

  const handleOpenServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
      });
    } else {
      setEditingService(null);
      setServiceForm({ name: '', description: '', price: '' });
    }
    setServiceModalVisible(true);
  };

  const handleSaveService = async () => {
    if (!serviceForm.name || !serviceForm.price) {
      Alert.alert('Erro', 'Nome e preço são obrigatórios');
      return;
    }

    const serviceData = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price),
    };

    if (editingService) {
      await updateService(editingService.id, serviceData);
    } else {
      await addService({
        id: Date.now().toString(),
        ...serviceData,
      });
    }

    setServiceModalVisible(false);
    setServiceForm({ name: '', description: '', price: '' });
  };

  const handleDeleteService = async (id: string) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => await deleteService(id),
        },
      ]
    );
  };

  return (
    <Container>
      <Content>
        <Section>
          <SectionTitle>
            <ThemedText type="subtitle">Informações Básicas</ThemedText>
          </SectionTitle>

          <InputGroup>
            <Label>Nome do Salão *</Label>
            <Input
              value={salonName}
              onChangeText={setSalonName}
              placeholder="Digite o nome do salão"
              placeholderTextColor="#999"
            />
          </InputGroup>

          <InputGroup>
            <Label>Apelido (URL) *</Label>
            <Input
              value={slug}
              onChangeText={(text: string) => setSlug(text.toLowerCase().replace(/\s/g, '-'))}
              placeholder="meu-salao"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
            {slug && <URLPreview>URL: salao.app/{slug}</URLPreview>}
          </InputGroup>

          <SaveButton onPress={handleSaveSalonInfo}>
            <SaveButtonText>Salvar Informações</SaveButtonText>
          </SaveButton>
        </Section>

        <Section>
          <SectionHeader>
            <ThemedText type="subtitle">Horários de Funcionamento</ThemedText>
          </SectionHeader>

          {workingHours.map((day, index) => (
            <DayRow key={day.day}>
              <DayInfo>
                <DayName>{day.day}</DayName>
                <Switch
                  value={day.isOpen}
                  onValueChange={() => toggleDayOpen(index)}
                  trackColor={{ false: '#ccc', true: '#007AFF' }}
                  thumbColor="#fff"
                />
              </DayInfo>
              {day.isOpen && (
                <TimeInputs>
                  <TimeInput
                    value={day.openTime}
                    onChangeText={(text: string) => updateDayTime(index, 'openTime', text)}
                    placeholder="09:00"
                    placeholderTextColor="#999"
                  />
                  <TimeLabel>às</TimeLabel>
                  <TimeInput
                    value={day.closeTime}
                    onChangeText={(text: string) => updateDayTime(index, 'closeTime', text)}
                    placeholder="18:00"
                    placeholderTextColor="#999"
                  />
                </TimeInputs>
              )}
            </DayRow>
          ))}

          <SaveButton onPress={handleSaveWorkingHours}>
            <SaveButtonText>Salvar Horários</SaveButtonText>
          </SaveButton>
        </Section>

        <Section>
          <SectionHeader>
            <ThemedText type="subtitle">Serviços Oferecidos</ThemedText>
            <AddButton onPress={() => handleOpenServiceModal()}>
              <AddButtonText>+ Adicionar</AddButtonText>
            </AddButton>
          </SectionHeader>

          {salonConfig?.services.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceHeader>
                <ServiceName>{service.name}</ServiceName>
                <ServicePrice>R$ {service.price.toFixed(2)}</ServicePrice>
              </ServiceHeader>
              {service.description ? (
                <ServiceDescription>{service.description}</ServiceDescription>
              ) : null}
              <ServiceActions>
                <ActionButton onPress={() => handleOpenServiceModal(service)}>
                  <ActionButtonText>Editar</ActionButtonText>
                </ActionButton>
                <ActionButton onPress={() => handleDeleteService(service.id)}>
                  <ActionButtonText style={{ color: '#FF3B30' }}>Excluir</ActionButtonText>
                </ActionButton>
              </ServiceActions>
            </ServiceCard>
          ))}

          {(!salonConfig?.services || salonConfig.services.length === 0) && (
            <EmptyState>
              <EmptyText>Nenhum serviço cadastrado</EmptyText>
            </EmptyState>
          )}
        </Section>
      </Content>

      <Modal visible={serviceModalVisible} animationType="slide" transparent>
        <ModalOverlay>
          <ModalContent>
            <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </ThemedText>

            <Input
              value={serviceForm.name}
              onChangeText={(text: string) => setServiceForm({ ...serviceForm, name: text })}
              placeholder="Nome do serviço *"
              placeholderTextColor="#999"
            />

            <TextArea
              value={serviceForm.description}
              onChangeText={(text: string) => setServiceForm({ ...serviceForm, description: text })}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <Input
              value={serviceForm.price}
              onChangeText={(text: string) => setServiceForm({ ...serviceForm, price: text })}
              placeholder="Preço *"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />

            <ButtonRow>
              <SecondaryButton onPress={() => setServiceModalVisible(false)}>
                <SecondaryButtonText>Cancelar</SecondaryButtonText>
              </SecondaryButton>
              <PrimaryButton onPress={handleSaveService}>
                <PrimaryButtonText>Salvar</PrimaryButtonText>
              </PrimaryButton>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding-bottom: 80px;
`;

const Content = styled.View`
  padding: 20px;
  gap: 24px;
`;

const Section = styled.View`
  gap: 16px;
`;

const SectionTitle = styled.View`
  margin-bottom: 8px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const InputGroup = styled.View`
  gap: 8px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #000;
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

const TextArea = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #fff;
  color: #000;
  height: 80px;
`;

const URLPreview = styled.Text`
  font-size: 12px;
  color: #007AFF;
  margin-top: 4px;
`;

const DayRow = styled.View`
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #e0e0e0;
  gap: 8px;
`;

const DayInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DayName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;

const TimeInputs = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const TimeInput = styled.TextInput`
  flex: 1;
  width: 100%;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 8px;
  font-size: 14px;
  background-color: #fff;
  color: #000;
  text-align: center;
`;

const TimeLabel = styled.Text`
  font-size: 14px;
  color: #666;
`;

const ServiceCard = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
  gap: 8px;
`;

const ServiceHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ServiceName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  flex: 1;
`;

const ServicePrice = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #34C759;
`;

const ServiceDescription = styled.Text`
  font-size: 14px;
  color: #666;
`;

const ServiceActions = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 4px;
`;

const ActionButton = styled.TouchableOpacity`
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  background-color: #f0f0f0;
  align-items: center;
`;

const ActionButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #007AFF;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 8px 16px;
  border-radius: 8px;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 8px;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const EmptyState = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 40px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  color: #999;
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
