import { useState } from 'react';
import { Alert, ActivityIndicator, Image } from 'react-native';
import styled from 'styled-components/native';
import { ThemedText } from '@/components/themed-text';
import { signInWithGoogle } from '@/services/auth';
import Svg, { Path } from 'react-native-svg';

function GoogleIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <Path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <Path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <Path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/cancelled-popup-request') {
        return;
      }
      Alert.alert(
        'Erro no login',
        'Não foi possível fazer login com o Google. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Content>
        <LogoContainer>
          <Logo>💇</Logo>
          <ThemedText type="title" style={{ textAlign: 'center', marginTop: 16 }}>
            Salão App
          </ThemedText>
          <Subtitle>Gerencie seu salão de forma simples e eficiente</Subtitle>
        </LogoContainer>

        <LoginSection>
          <ThemedText type="subtitle" style={{ textAlign: 'center', marginBottom: 24 }}>
            Faça login para continuar
          </ThemedText>

          <GoogleButton onPress={handleGoogleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <GoogleIconContainer>
                  <GoogleIcon size={24} />
                </GoogleIconContainer>
                <GoogleButtonText>Continuar com Google</GoogleButtonText>
              </>
            )}
          </GoogleButton>

          <InfoText>
            Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade
          </InfoText>
        </LoginSection>
      </Content>

      <Footer>
        <FooterText>© 2024 Salão App - Todos os direitos reservados</FooterText>
      </Footer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding: 32px;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 48px;
`;

const Logo = styled.Text`
  font-size: 80px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 8px;
`;

const LoginSection = styled.View`
  width: 100%;
  max-width: 400px;
  align-self: center;
`;

const GoogleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #4285F4;
  padding: 16px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  min-height: 56px;
`;

const GoogleIconContainer = styled.View`
  width: 32px;
  height: 32px;
  background-color: #fff;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const GoogleButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;

const InfoText = styled.Text`
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 24px;
  line-height: 18px;
`;

const Footer = styled.View`
  padding: 20px;
  align-items: center;
`;

const FooterText = styled.Text`
  font-size: 12px;
  color: #999;
`;
