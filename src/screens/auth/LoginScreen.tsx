import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAuth, useLanguage } from '../../hooks';
import { COLORS, FONTS } from '../../theme/colors';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn, loading, error, clearError } = useAuth();
  const { tx } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    await signIn(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.logo}>{'\u{1F989}'}</Text>
        <Text style={styles.title}>LinguaLeap</Text>
        <Text style={styles.subtitle}>{tx('Dil ogrenmenin en eglenceli yolu')}</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorClose}>x</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{tx('E-posta')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@mail.com"
              placeholderTextColor={COLORS.hare}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{tx('Sifre')}</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={tx('En az 6 karakter')}
              placeholderTextColor={COLORS.hare}
              secureTextEntry
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>{tx('Sifremi unuttum')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, (!email || !password) && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>{tx('GIRIS YAP')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{tx('Hesabin yok mu?')} </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>{tx('Kayit ol')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  logo: { fontSize: 64, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 32, color: COLORS.primary, ...FONTS.bold, textAlign: 'center' },
  subtitle: { fontSize: 15, color: COLORS.wolf, textAlign: 'center', marginTop: 4, marginBottom: 32, ...FONTS.regular },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: COLORS.redLight, borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { flex: 1, fontSize: 13, color: COLORS.redDark, ...FONTS.medium },
  errorClose: { fontSize: 16, color: COLORS.hare, paddingLeft: 8 },
  form: { gap: 16 },
  inputContainer: { gap: 6 },
  inputLabel: { fontSize: 14, color: COLORS.eel, ...FONTS.semiBold },
  input: { borderWidth: 2, borderColor: COLORS.swan, borderRadius: 14, padding: 14, fontSize: 16, color: COLORS.owl, backgroundColor: COLORS.snow },
  forgotText: { fontSize: 14, color: COLORS.blue, ...FONTS.semiBold, textAlign: 'right' },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark, marginTop: 8 },
  buttonDisabled: { backgroundColor: COLORS.swan, borderBottomColor: COLORS.borderDark },
  buttonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  footerText: { fontSize: 15, color: COLORS.wolf, ...FONTS.regular },
  footerLink: { fontSize: 15, color: COLORS.primary, ...FONTS.bold },
});
