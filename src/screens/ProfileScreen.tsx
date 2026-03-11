import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, FONTS, SHADOWS, UI } from '../theme/colors';
import { useUser, useAuth, useLanguage } from '../hooks';
import { formatNumber, getLeagueInfo } from '../utils/helpers';
import AppSymbol from '../components/AppSymbol';
import { RootStackParamList } from '../types';

const AVATARS = [
  '\u{1F989}', '\u{1F436}', '\u{1F431}', '\u{1F98A}', '\u{1F43C}', '\u{1F428}', '\u{1F981}', '\u{1F438}',
  '\u{1F427}', '\u{1F42F}', '\u{1F984}', '\u{1F43B}', '\u{1F430}', '\u{1F435}', '\u{1F98B}', '\u{1F42C}',
];

type ProfileNav = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNav>();
  const { user, resetStats, updateAvatar } = useUser();
  const { signOut } = useAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const { t, tx, language } = useLanguage();

  if (!user) return null;

  const leagueInfo = getLeagueInfo(user.league);
  const weakWords = useMemo(
    () =>
      Object.values(user.mistakeBuckets || {})
        .sort((a, b) => (b.wrong - b.correct) - (a.wrong - a.correct))
        .slice(0, 6),
    [user.mistakeBuckets]
  );

  const localeMap = {
    tr: 'tr-TR',
    en: 'en-GB',
    de: 'de-DE',
    es: 'es-ES',
  } as const;

  const handleLogout = () => {
    Alert.alert(tx('Cikis Yap'), tx('Hesabindan cikis yapmak istedigine emin misin?'), [
      { text: tx('Vazgec'), style: 'cancel' },
      { text: tx('Cikis Yap'), style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleAvatarSelect = async (avatar: string) => {
    await updateAvatar(avatar);
    setShowAvatarPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => setShowAvatarPicker(true)}>
            <AppSymbol symbol={user.avatar} size={60} color={COLORS.blueDark} style={styles.avatarBig} />
            <View style={styles.editAvatarBadge}>
              <Ionicons name="pencil" size={12} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joinDate}>
            {tx('Uye')}: {new Date(user.createdAt).toLocaleDateString(localeMap[language], { year: 'numeric', month: 'long' })}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="flame" size={22} color={COLORS.accent} />
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>{tx('Gun Serisi')}</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="flash" size={22} color={COLORS.blue} />
            <Text style={styles.statValue}>{formatNumber(user.totalXP)}</Text>
            <Text style={styles.statLabel}>{tx('Toplam XP')}</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="trophy" size={22} color={COLORS.accent} />
            <Text style={styles.statValue}>{user.crowns}</Text>
            <Text style={styles.statLabel}>{tx('Taclar')}</Text>
          </View>
          <View style={styles.statBox}>
            <AppSymbol symbol={leagueInfo.icon} size={22} color={COLORS.blueDark} style={styles.statIcon} />
            <Text style={[styles.statValue, { fontSize: 14 }]}>{user.league}</Text>
            <Text style={styles.statLabel}>{tx('Lig')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tx('Basarilar')}</Text>
          <View style={styles.achievementsGrid}>
            {(user.achievements || []).map((ach: any) => (
              <View key={ach.id} style={[styles.achievementCard, !ach.unlocked && styles.achievementLocked]}>
                <AppSymbol symbol={ach.icon} size={22} color={ach.unlocked ? COLORS.blueDark : COLORS.hare} style={[styles.achievementIcon, !ach.unlocked && { opacity: 0.3 }]} />
                <Text style={[styles.achievementTitle, !ach.unlocked && { color: COLORS.hare }]} numberOfLines={2}>{tx(ach.title)}</Text>
                {ach.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark" size={10} color={COLORS.white} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{tx('Weak Words')}</Text>
            <TouchableOpacity style={styles.sectionAction} onPress={() => navigation.navigate('MistakesNotebook')}>
              <Text style={styles.sectionActionText}>{tx('Notebook')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.weakWordsCard}>
            {weakWords.length === 0 ? (
              <Text style={styles.weakWordsEmpty}>{tx('En cok zorlandigin kelimeler burada birikir.')}</Text>
            ) : (
              weakWords.map((item) => (
                <View key={item.focus} style={styles.weakWordRow}>
                  <View style={styles.weakWordPill}>
                    <Text style={styles.weakWordText}>{item.focus}</Text>
                  </View>
                  <Text style={styles.weakWordMeta}>{tx('Yanlis')} {item.wrong} • {tx('Dogru')} {item.correct}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowProfileInfo(true)}>
            <Ionicons name="person-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>{t('profile.info')}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>{t('profile.settings')}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowNotifs(true)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>{t('profile.notifications')}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowHelp(true)}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>{t('profile.help')}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
            <Text style={[styles.menuText, { color: COLORS.red }]}>{t('profile.logout')}</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>LinguaLeap v1.0.0</Text>

        {__DEV__ && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                tx('Istatistikleri Sifirla'),
                tx('Tum XP, tac, seriler ve elmaslar sifirlanacak. Devam etmek istiyor musun?'),
                [
                  { text: tx('Vazgec'), style: 'cancel' },
                  {
                    text: tx('Sifirla'),
                    style: 'destructive',
                    onPress: async () => {
                      await resetStats();
                      Alert.alert(tx('Sifirlandi'), tx('Hesabin baslangic durumuna getirildi.'));
                    },
                  },
                ],
              );
            }}
          >
            <Text style={styles.resetButtonText}>{tx('Istatistikleri Sifirla (DEV)')}</Text>
          </TouchableOpacity>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={showAvatarPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{tx('Avatar Sec')}</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => (
                <TouchableOpacity key={a} style={[styles.avatarOption, user.avatar === a && styles.avatarOptionActive]} onPress={() => handleAvatarSelect(a)}>
                  <Text style={styles.avatarOptionText}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAvatarPicker(false)}>
              <Text style={styles.modalCloseText}>{tx('Kapat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showProfileInfo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.info')}</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{tx('Ad')}</Text><Text style={styles.infoValue}>{user.name}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{tx('Kullanici Adi')}</Text><Text style={styles.infoValue}>{user.username}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{tx('E-posta')}</Text><Text style={styles.infoValue}>{user.email}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{t('home.level')}</Text><Text style={styles.infoValue}>{user.level}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{tx('Toplam XP')}</Text><Text style={styles.infoValue}>{user.totalXP}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>{tx('Lig')}</Text><Text style={styles.infoValue}>{user.league}</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowProfileInfo(false)}>
              <Text style={styles.modalCloseText}>{tx('Kapat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.settings')}</Text>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{t('home.dailyGoal')}</Text><Text style={styles.settingValue}>{user.dailyGoal} XP</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Uygulama Dili')}</Text><Text style={styles.settingValue}>{tx(language === 'tr' ? 'Turkce' : language === 'en' ? 'English' : language === 'de' ? 'Deutsch' : 'Espanol')}</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Ses Efektleri')}</Text><Text style={styles.settingValue}>{tx('Acik')}</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Karanlik Mod')}</Text><Text style={styles.settingValue}>{tx('Kapali')}</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowSettings(false)}>
              <Text style={styles.modalCloseText}>{tx('Kapat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showNotifs} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.notifications')}</Text>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Ders Hatirlatici')}</Text><Text style={styles.settingValue}>{tx('Acik')}</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Streak Uyarisi')}</Text><Text style={styles.settingValue}>{tx('Acik')}</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>{tx('Liderlik Tablosu')}</Text><Text style={styles.settingValue}>{tx('Acik')}</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowNotifs(false)}>
              <Text style={styles.modalCloseText}>{tx('Kapat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showHelp} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('profile.help')}</Text>
            <Text style={styles.helpText}>{tx('LinguaLeap, dil ogrenmeyi eglenceli hale getiren bir uygulamadir.')}</Text>
            <Text style={styles.helpText}>{tx('Derslerden XP kazanarak seviye atla, seriyi koruyarak basarilar ac!')}</Text>
            <Text style={styles.helpText}>{tx('Sorun veya onerilerin icin:')}</Text>
            <Text style={[styles.helpText, { color: COLORS.blue, ...FONTS.bold }]}>destek@lingualeap.app</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowHelp(false)}>
              <Text style={styles.modalCloseText}>{tx('Kapat')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgCanvas },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, alignItems: 'center', backgroundColor: COLORS.bgCanvas },
  headerTitle: { fontSize: 20, color: COLORS.ink, ...FONTS.bold },
  scrollContent: { padding: 16 },
  profileCard: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.lg, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.mintLine, ...SHADOWS.medium },
  avatarWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: COLORS.primary, position: 'relative' },
  avatarBig: { fontSize: 44 },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  name: { fontSize: 24, color: COLORS.ink, ...FONTS.bold },
  username: { fontSize: 14, color: COLORS.inkSoft, ...FONTS.regular, marginTop: 2 },
  email: { fontSize: 12, color: COLORS.hare, marginTop: 4 },
  joinDate: { fontSize: 11, color: COLORS.hare, marginTop: 6 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statBox: { width: '47%', backgroundColor: COLORS.bgPanelAlt, borderRadius: UI.radius.md, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.skyLine, flexGrow: 1 },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 18, color: COLORS.ink, ...FONTS.bold },
  statLabel: { fontSize: 11, color: COLORS.inkSoft, ...FONTS.medium, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: COLORS.ink, ...FONTS.bold, marginBottom: 12 },
  sectionAction: { backgroundColor: COLORS.bgPanelAlt, borderRadius: UI.radius.pill, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: COLORS.skyLine, marginBottom: 12 },
  sectionActionText: { fontSize: 12, color: COLORS.blueDark, ...FONTS.bold },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  achievementCard: { width: '30.5%', minHeight: 98, backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.mintLine, position: 'relative' },
  achievementLocked: { backgroundColor: COLORS.polar, opacity: 0.6 },
  achievementIcon: { fontSize: 22, marginBottom: 4 },
  achievementTitle: { fontSize: 10, lineHeight: 12, color: COLORS.ink, ...FONTS.medium, textAlign: 'center' },
  unlockedBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  weakWordsCard: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, borderWidth: 1, borderColor: COLORS.mintLine, padding: 14, gap: 10 },
  weakWordsEmpty: { fontSize: 13, color: COLORS.inkSoft, lineHeight: 19 },
  weakWordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  weakWordPill: { backgroundColor: COLORS.bgPanelAlt, borderRadius: UI.radius.pill, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.skyLine },
  weakWordText: { fontSize: 13, color: COLORS.ink, ...FONTS.bold },
  weakWordMeta: { fontSize: 12, color: COLORS.inkSoft, ...FONTS.medium },
  menu: { backgroundColor: COLORS.bgPanel, borderRadius: UI.radius.md, borderWidth: 1, borderColor: COLORS.mintLine, overflow: 'hidden', marginBottom: 16, ...SHADOWS.small },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.mintLine, gap: 12 },
  menuText: { flex: 1, fontSize: 15, color: COLORS.ink, ...FONTS.medium },
  versionText: { textAlign: 'center', fontSize: 12, color: COLORS.hare, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.bgPanel, borderTopLeftRadius: UI.radius.lg, borderTopRightRadius: UI.radius.lg, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, color: COLORS.ink, ...FONTS.bold, textAlign: 'center', marginBottom: 20 },
  modalClose: { backgroundColor: COLORS.primary, borderRadius: UI.radius.md, padding: 14, alignItems: 'center', marginTop: 20, borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  modalCloseText: { color: COLORS.white, fontSize: 16, ...FONTS.bold },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  avatarOption: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.bgPanelAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.skyLine },
  avatarOptionActive: { borderColor: COLORS.primary, borderWidth: 3, backgroundColor: COLORS.primaryBg },
  avatarOptionText: { fontSize: 28 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.polar },
  infoLabel: { fontSize: 14, color: COLORS.inkSoft, ...FONTS.medium },
  infoValue: { fontSize: 14, color: COLORS.ink, ...FONTS.semiBold },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.polar },
  settingLabel: { fontSize: 15, color: COLORS.ink, ...FONTS.medium },
  settingValue: { fontSize: 14, color: COLORS.inkSoft, ...FONTS.regular },
  helpText: { fontSize: 14, color: COLORS.ink, lineHeight: 22, marginBottom: 8 },
  resetButton: { marginTop: 12, padding: 14, borderRadius: UI.radius.md, backgroundColor: COLORS.red, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: COLORS.redDark },
  resetButtonText: { fontSize: 14, color: COLORS.white, ...FONTS.bold, letterSpacing: 0.5 },
});
