import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useAuth } from '../../hooks';
import { COLORS, FONTS } from '../../theme/colors';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> };

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { signUp, loading, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isValid = name.trim().length >= 2 && username.trim().length >= 3 && email.includes('@') && password.length >= 6;

  const handleRegister = async () => {
    if (!isValid) return;
    await signUp(email.trim(), password, name.trim(), username.trim());
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🦉</Text>
        <Text style={styles.title}>Hesap Oluştur</Text>
        <Text style={styles.subtitle}>Dil öğrenme macerana başla</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}><Text style={styles.errorClose}>✕</Text></TouchableOpacity>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Ahmet Yılmaz" placeholderTextColor={COLORS.hare} autoCapitalize="words" />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
            <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="ahmet_yilmaz" placeholderTextColor={COLORS.hare} autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-posta</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="ornek@mail.com" placeholderTextColor={COLORS.hare} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="En az 6 karakter" placeholderTextColor={COLORS.hare} secureTextEntry />
            {password.length > 0 && password.length < 6 && <Text style={styles.hint}>En az 6 karakter gerekli</Text>}
          </View>

          <TouchableOpacity style={[styles.button, !isValid && styles.buttonDisabled]} onPress={handleRegister} disabled={loading || !isValid}>
            {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>KAYIT OL</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.footerLink}>Giriş yap</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 40 },
  logo: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 28, color: COLORS.owl, ...FONTS.bold, textAlign: 'center' },
  subtitle: { fontSize: 14, color: COLORS.wolf, textAlign: 'center', marginTop: 4, marginBottom: 28 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: COLORS.redLight, borderRadius: 12, padding: 12, marginBottom: 16 },
  errorText: { flex: 1, fontSize: 13, color: COLORS.redDark, ...FONTS.medium },
  errorClose: { fontSize: 16, color: COLORS.hare, paddingLeft: 8 },
  form: { gap: 14 },
  inputContainer: { gap: 6 },
  inputLabel: { fontSize: 14, color: COLORS.eel, ...FONTS.semiBold },
  input: { borderWidth: 2, borderColor: COLORS.swan, borderRadius: 14, padding: 14, fontSize: 16, color: COLORS.owl, backgroundColor: COLORS.snow },
  hint: { fontSize: 12, color: COLORS.accent, ...FONTS.medium, marginTop: 2 },
  button: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark, marginTop: 8 },
  buttonDisabled: { backgroundColor: COLORS.swan, borderBottomColor: COLORS.borderDark },
  buttonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { fontSize: 15, color: COLORS.wolf },
  footerLink: { fontSize: 15, color: COLORS.primary, ...FONTS.bold },
});
