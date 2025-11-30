import styled from 'styled-components/native';
import { Appointment } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
}

const statusColors = {
  scheduled: '#007AFF',
  completed: '#34C759',
  cancelled: '#FF3B30',
};

const statusLabels = {
  scheduled: 'Agendado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export function AppointmentCard({ appointment, onPress }: AppointmentCardProps) {
  return (
    <CardContainer onPress={onPress} disabled={!onPress}>
      <CardContent>
        <Header>
          <ClientName numberOfLines={1}>{appointment.clientName}</ClientName>
          <StatusBadge color={statusColors[appointment.status]}>
            <StatusText>{statusLabels[appointment.status]}</StatusText>
          </StatusBadge>
        </Header>

        <Service>{appointment.service}</Service>

        <InfoContainer>
          <InfoText>⏰ {appointment.time}</InfoText>
          <InfoText>📱 {appointment.clientPhone}</InfoText>
        </InfoContainer>

        <Footer>
          <Price>R$ {appointment.price.toFixed(2)}</Price>
        </Footer>
      </CardContent>
    </CardContainer>
  );
}

const CardContainer = styled.TouchableOpacity`
  margin-bottom: 12px;
`;

const CardContent = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ClientName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #000;
  flex: 1;
  margin-right: 8px;
`;

const StatusBadge = styled.View<{ color: string }>`
  background-color: ${props => props.color};
  padding: 4px 12px;
  border-radius: 12px;
`;

const StatusText = styled.Text`
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`;

const Service = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const InfoContainer = styled.View`
  gap: 4px;
  margin-bottom: 8px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: #666;
`;

const Footer = styled.View`
  border-top-width: 1px;
  border-top-color: #e0e0e0;
  padding-top: 8px;
`;

const Price = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #34C759;
`;
