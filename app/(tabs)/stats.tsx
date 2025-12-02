import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/app-context';
import { eachMonthOfInterval, endOfMonth, format, startOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import styled from 'styled-components/native';

export default function StatsScreen() {
  const { appointments } = useApp();
  const screenWidth = Dimensions.get('window').width;

  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date(),
  });

  const monthlyData = last6Months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate >= monthStart && aptDate <= monthEnd;
    });

    const completedAppointments = monthAppointments.filter((apt) => apt.status === 'completed');
    const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.price, 0);

    return {
      month: format(month, 'MMM', { locale: ptBR }),
      totalAppointments: monthAppointments.length,
      completedAppointments: completedAppointments.length,
      revenue: totalRevenue,
    };
  });

  const appointmentsChartData = monthlyData.map((d) => d.totalAppointments);
  const revenueChartData = monthlyData.map((d) => d.revenue);

  const hasAppointmentsData = appointmentsChartData.some(v => v > 0);
  const hasRevenueData = revenueChartData.some(v => v > 0);

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter((apt) => apt.status === 'completed').length;
  const totalRevenue = appointments
    .filter((apt) => apt.status === 'completed')
    .reduce((sum, apt) => sum + apt.price, 0);
  const averageTicket = completedAppointments > 0 ? totalRevenue / completedAppointments : 0;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <Container>
      <CardsContainer>
        <Card>
          <CardValue>{totalAppointments}</CardValue>
          <CardLabel>Total de Agendamentos</CardLabel>
        </Card>

        <Card>
          <CardValue>{completedAppointments}</CardValue>
          <CardLabel>Atendimentos Realizados</CardLabel>
        </Card>

        <Card>
          <CardValue>R$ {totalRevenue.toFixed(2)}</CardValue>
          <CardLabel>Receita Total</CardLabel>
        </Card>

        <Card>
          <CardValue>R$ {averageTicket.toFixed(2)}</CardValue>
          <CardLabel>Ticket Médio</CardLabel>
        </Card>
      </CardsContainer>

      <ChartSection>
        <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
          Agendamentos por Mês
        </ThemedText>
        <BarChart
          data={{
            labels: monthlyData.map((d) => d.month),
            datasets: [
              {
                data: hasAppointmentsData ? appointmentsChartData : [0],
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          style={{ borderRadius: 16 }}
          showValuesOnTopOfBars
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
        />
      </ChartSection>

      <ChartSection>
        <ThemedText type="subtitle" style={{ marginBottom: 16 }}>
          Receita por Mês
        </ThemedText>
        <LineChart
          data={{
            labels: monthlyData.map((d) => d.month),
            datasets: [
              {
                data: hasRevenueData ? revenueChartData : [0],
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ borderRadius: 16 }}
          formatYLabel={(value) => `R$${value}`}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
        />
      </ChartSection>

      <MonthlyList>
        <ThemedText type="subtitle" style={{ marginBottom: 8 }}>
          Detalhes Mensais
        </ThemedText>
        {monthlyData.reverse().map((data, index) => (
          <MonthItem key={index}>
            <MonthHeader>
              <MonthName>{data.month}</MonthName>
              <MonthRevenue>R$ {data.revenue.toFixed(2)}</MonthRevenue>
            </MonthHeader>
            <MonthStats>
              <MonthStat>{data.totalAppointments} agendamentos</MonthStat>
              <MonthStat>{data.completedAppointments} concluídos</MonthStat>
            </MonthStats>
          </MonthItem>
        ))}
      </MonthlyList>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding-bottom: 80px;
`;

const CardsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  gap: 12px;
`;

const Card = styled.View`
  flex: 1;
  min-width: 45%;
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
  align-items: center;
`;

const CardValue = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #007AFF;
  margin-bottom: 4px;
`;

const CardLabel = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: center;
`;

const ChartSection = styled.View`
  padding: 20px;
  padding-top: 10px;
`;

const MonthlyList = styled.View`
  padding: 20px;
  padding-top: 10px;
  gap: 12px;
`;

const MonthItem = styled.View`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
  gap: 8px;
`;

const MonthHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MonthName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #000;
  text-transform: capitalize;
`;

const MonthRevenue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #34C759;
`;

const MonthStats = styled.View`
  flex-direction: row;
  gap: 16px;
`;

const MonthStat = styled.Text`
  font-size: 14px;
  color: #666;
`;
