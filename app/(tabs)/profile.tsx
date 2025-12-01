import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { ThemedText } from '@/components/themed-text';
import { useApp } from '@/context/app-context';
import { User } from '@/types';
import { signOut } from '@/services/auth';

export default function ProfileScreen() {
  const { user, updateUser, authUser } = useApp();
  const [formData, setFormData] = useState<User>({
    id: user?.id || Date.now().toString(),
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    salonName: user?.salonName || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleSave = async () => {
    if (!formData.name || !formData.salonName) {
      Alert.alert('Erro', 'Nome e nome do salão são obrigatórios');
      return;
    }

    await updateUser(formData);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível sair da conta');
            }
          },
        },
      ]
    );
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <ThemedText type="title">Meu Perfil</ThemedText>
          {authUser && (
            <UserInfo>
              <UserEmail>{authUser.email}</UserEmail>
            </UserInfo>
          )}
        </HeaderContent>
      </Header>

      <Form>
        <InputGroup>
          <Label>Nome do Salão *</Label>
          <Input
            value={formData.salonName}
            onChangeText={(text: string) => setFormData({ ...formData, salonName: text })}
            placeholder="Digite o nome do salão"
            placeholderTextColor="#999"
          />
        </InputGroup>

        <InputGroup>
          <Label>Seu Nome *</Label>
          <Input
            value={formData.name}
            onChangeText={(text: string) => setFormData({ ...formData, name: text })}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
          />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input
            value={formData.email}
            onChangeText={(text: string) => setFormData({ ...formData, email: text })}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </InputGroup>

        <InputGroup>
          <Label>Telefone</Label>
          <Input
            value={formData.phone}
            onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </InputGroup>

        <InputGroup>
          <Label>Endereço</Label>
          <TextArea
            value={formData.address}
            onChangeText={(text: string) => setFormData({ ...formData, address: text })}
            placeholder="Digite o endereço do salão"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </InputGroup>

        <SaveButton onPress={handleSave}>
          <SaveButtonText>Salvar</SaveButtonText>
        </SaveButton>

        <LogoutButton onPress={handleLogout}>
          <LogoutButtonText>Sair da Conta</LogoutButtonText>
        </LogoutButton>
      </Form>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: 60px;
`;

const HeaderContent = styled.View`
  gap: 8px;
`;

const UserInfo = styled.View`
  gap: 4px;
`;

const UserEmail = styled.Text`
  font-size: 14px;
  color: #666;
`;

const Form = styled.View`
  padding: 20px;
  gap: 20px;
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

const SaveButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #FF3B30;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 10px;
`;

const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;
