import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAuth, useLanguage } from '../../hooks';
import { COLORS, FONTS } from '../../theme/colors';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'> };

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { resetPassword, error } = useAuth();
  const { tx } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.includes('@')) return;
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      return;
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.checkIcon}>{'\u{1F4E7}'}</Text>
          <Text style={styles.title}>{tx('E-posta Gonderildi')}</Text>
          <Text style={styles.subtitle}>{tx('Sifre sifirlama baglantisi')} {email} {tx('adresine gonderildi.')}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>{tx('GIRISE DON')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{tx('Sifremi Unuttum')}</Text>
        <Text style={styles.subtitle}>{tx('E-posta adresini gir, sifirlama baglantisi gonderelim.')}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="ornek@mail.com" placeholderTextColor={COLORS.hare} keyboardType="email-address" autoCapitalize="none" />
        </View>

        <TouchableOpacity style={[styles.button, !email.includes('@') && styles.buttonDisabled]} onPress={handleReset} disabled={!email.includes('@')}>
          <Text style={styles.buttonText}>{tx('GONDER')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{tx('Geri don')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  checkIcon: { fontSize: 48, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 24, color: COLORS.owl, ...FONTS.bold, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.wolf, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  errorText: { fontSize: 13, color: COLORS.red, ...FONTS.medium, textAlign: 'center', marginBottom: 12 },
  inputContainer: { marginBottom: 16 },
  input: { borderWidth: 2, borderColor: COLORS.swan, borderRadius: 14, padding: 14, fontSize: 16, color: COLORS.owl, backgroundColor: COLORS.snow },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  buttonDisabled: { backgroundColor: COLORS.swan, borderBottomColor: COLORS.borderDark },
  buttonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  backBtn: { marginTop: 20, alignItems: 'center' },
  backText: { fontSize: 15, color: COLORS.blue, ...FONTS.semiBold },
});
