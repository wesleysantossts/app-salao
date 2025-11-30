import styled from 'styled-components/native';
import { Text, View } from 'react-native';

export const Container = styled(View)`
  flex: 1;
`;

export const Header = styled(View)`
  padding: 20px;
  padding-top: 60px;
`;

export const Title = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

export const Subtitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: #000;
`;

export const BaseText = styled(Text)`
  font-size: 16px;
  color: #000;
`;

export const Card = styled(View)`
  background-color: #fff;
  padding: 16px;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
`;

export const Button = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

export const ButtonText = styled(Text)`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

export const Input = styled.TextInput`
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  background-color: #fff;
  color: #000;
`;
