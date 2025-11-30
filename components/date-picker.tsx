import styled from 'styled-components/native';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DatePickerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));

  return (
    <Container>
      <ScrollContainer horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {dates.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <DateItem
              key={date.toISOString()}
              isSelected={isSelected}
              isToday={isToday}
              onPress={() => onSelectDate(date)}>
              <DayText isSelected={isSelected}>
                {format(date, 'EEE', { locale: ptBR })}
              </DayText>
              <DateText isSelected={isSelected}>
                {format(date, 'd')}
              </DateText>
            </DateItem>
          );
        })}
      </ScrollContainer>
    </Container>
  );
}

const Container = styled.View`
  margin-vertical: 16px;
`;

const ScrollContainer = styled.ScrollView``;

const DateItem = styled.TouchableOpacity<{ isSelected: boolean; isToday: boolean }>`
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 70px;
  border-radius: 12px;
  border-width: ${props => props.isToday && !props.isSelected ? '2px' : '1px'};
  border-color: ${props =>
    props.isSelected ? '#007AFF' :
    props.isToday ? '#007AFF' : '#e0e0e0'
  };
  background-color: ${props => props.isSelected ? '#007AFF' : '#fff'};
`;

const DayText = styled.Text<{ isSelected: boolean }>`
  font-size: 12px;
  color: ${props => props.isSelected ? '#fff' : '#666'};
  text-transform: capitalize;
  margin-bottom: 4px;
`;

const DateText = styled.Text<{ isSelected: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.isSelected ? '#fff' : '#000'};
`;
