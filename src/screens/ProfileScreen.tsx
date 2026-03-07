import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useUser, useAuth } from '../hooks';
import { formatNumber, getLeagueInfo } from '../utils/helpers';

const AVATARS = ['🦉', '🐶', '🐱', '🦊', '🐼', '🐨', '🦁', '🐸', '🐧', '🐯', '🦄', '🐻', '🐰', '🐵', '🦋', '🐬'];

const ProfileScreen: React.FC = () => {
  const { user, uid } = useUser();
  const { signOut, profile } = useAuth();
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  if (!user) return null;

  const leagueInfo = getLeagueInfo(user.league);

  const handleLogout = () => {
    Alert.alert('Çıkış Yap', 'Hesabından çıkış yapmak istediğine emin misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Çıkış Yap', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleAvatarSelect = async (avatar: string) => {
    try {
      const { setDocument } = require('../config/firebase');
      const authCtx = useAuth();
      // We'll update via REST API
      setShowAvatarPicker(false);
    } catch {}
    setShowAvatarPicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profil Karti */}
        <View style={styles.profileCard}>
          <TouchableOpacity style={styles.avatarWrap} onPress={() => setShowAvatarPicker(true)}>
            <Text style={styles.avatarBig}>{user.avatar}</Text>
            <View style={styles.editAvatarBadge}>
              <Ionicons name="pencil" size={12} color={COLORS.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joinDate}>
            Üye: {new Date(user.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
          </Text>
        </View>

        {/* Istatistikler */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Gün Serisi</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statValue}>{formatNumber(user.totalXP)}</Text>
            <Text style={styles.statLabel}>Toplam XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>👑</Text>
            <Text style={styles.statValue}>{user.crowns}</Text>
            <Text style={styles.statLabel}>Taçlar</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>{leagueInfo.icon}</Text>
            <Text style={[styles.statValue, { fontSize: 14 }]}>{user.league}</Text>
            <Text style={styles.statLabel}>Lig</Text>
          </View>
        </View>

        {/* Basarilar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Başarılar</Text>
          <View style={styles.achievementsGrid}>
            {(user.achievements || []).map((ach: any) => (
              <View key={ach.id} style={[styles.achievementCard, !ach.unlocked && styles.achievementLocked]}>
                <Text style={[styles.achievementIcon, !ach.unlocked && { opacity: 0.3 }]}>{ach.icon}</Text>
                <Text style={[styles.achievementTitle, !ach.unlocked && { color: COLORS.hare }]} numberOfLines={2}>{ach.title}</Text>
                {ach.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark" size={10} color={COLORS.white} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowProfileInfo(true)}>
            <Ionicons name="person-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>Profil Bilgileri</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>Ayarlar</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowNotifs(true)}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>Bildirimler</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowHelp(true)}>
            <Ionicons name="help-circle-outline" size={22} color={COLORS.eel} />
            <Text style={styles.menuText}>Yardım</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={COLORS.red} />
            <Text style={[styles.menuText, { color: COLORS.red }]}>Çıkış Yap</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.hare} />
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>LinguaLeap v1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Avatar Secici Modal */}
      <Modal visible={showAvatarPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Avatar Seç</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((a) => (
                <TouchableOpacity key={a} style={[styles.avatarOption, user.avatar === a && styles.avatarOptionActive]} onPress={() => handleAvatarSelect(a)}>
                  <Text style={styles.avatarOptionText}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAvatarPicker(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profil Bilgileri Modal */}
      <Modal visible={showProfileInfo} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil Bilgileri</Text>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Ad</Text><Text style={styles.infoValue}>{user.name}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Kullanıcı Adı</Text><Text style={styles.infoValue}>{user.username}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>E-posta</Text><Text style={styles.infoValue}>{user.email}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Seviye</Text><Text style={styles.infoValue}>{user.level}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Toplam XP</Text><Text style={styles.infoValue}>{user.totalXP}</Text></View>
            <View style={styles.infoRow}><Text style={styles.infoLabel}>Lig</Text><Text style={styles.infoValue}>{user.league}</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowProfileInfo(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ayarlar Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ayarlar</Text>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Günlük Hedef</Text><Text style={styles.settingValue}>{user.dailyGoal} XP</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Uygulama Dili</Text><Text style={styles.settingValue}>Türkçe</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Ses Efektleri</Text><Text style={styles.settingValue}>Açık</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Karanlık Mod</Text><Text style={styles.settingValue}>Kapalı</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowSettings(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bildirimler Modal */}
      <Modal visible={showNotifs} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bildirimler</Text>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Ders Hatırlatıcı</Text><Text style={styles.settingValue}>Açık</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Streak Uyarısı</Text><Text style={styles.settingValue}>Açık</Text></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Liderlik Tablosu</Text><Text style={styles.settingValue}>Açık</Text></View>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowNotifs(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Yardim Modal */}
      <Modal visible={showHelp} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yardım</Text>
            <Text style={styles.helpText}>LinguaLeap, dil öğrenmeyi eğlenceli hale getiren bir uygulamadır.</Text>
            <Text style={styles.helpText}>Derslerden XP kazanarak seviye atla, seriyi koruyarak başarılar aç!</Text>
            <Text style={styles.helpText}>Sorun veya önerilerin için:</Text>
            <Text style={[styles.helpText, { color: COLORS.blue, ...FONTS.bold }]}>destek@lingualeap.app</Text>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowHelp(false)}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSecondary },
  header: { paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, alignItems: 'center', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.swan },
  headerTitle: { fontSize: 20, color: COLORS.owl, ...FONTS.bold },
  scrollContent: { padding: 16 },
  profileCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: COLORS.swan },
  avatarWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 4, borderColor: COLORS.primary, position: 'relative' },
  avatarBig: { fontSize: 44 },
  editAvatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  name: { fontSize: 22, color: COLORS.owl, ...FONTS.bold },
  username: { fontSize: 14, color: COLORS.wolf, ...FONTS.regular, marginTop: 2 },
  email: { fontSize: 12, color: COLORS.hare, marginTop: 4 },
  joinDate: { fontSize: 11, color: COLORS.hare, marginTop: 6 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  statBox: { width: '47%', backgroundColor: COLORS.white, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan, flexGrow: 1 },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 18, color: COLORS.owl, ...FONTS.bold },
  statLabel: { fontSize: 11, color: COLORS.wolf, ...FONTS.medium, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, color: COLORS.owl, ...FONTS.bold, marginBottom: 12 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: { width: '22%', backgroundColor: COLORS.white, borderRadius: 14, padding: 10, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan, flexGrow: 1, position: 'relative' },
  achievementLocked: { backgroundColor: COLORS.polar, opacity: 0.6 },
  achievementIcon: { fontSize: 22, marginBottom: 4 },
  achievementTitle: { fontSize: 9, color: COLORS.eel, ...FONTS.medium, textAlign: 'center' },
  unlockedBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  menu: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 2, borderColor: COLORS.swan, overflow: 'hidden', marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.swan, gap: 12 },
  menuText: { flex: 1, fontSize: 15, color: COLORS.eel, ...FONTS.medium },
  versionText: { textAlign: 'center', fontSize: 12, color: COLORS.hare, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, color: COLORS.owl, ...FONTS.bold, textAlign: 'center', marginBottom: 20 },
  modalClose: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 14, alignItems: 'center', marginTop: 20, borderBottomWidth: 4, borderBottomColor: COLORS.primaryDark },
  modalCloseText: { color: COLORS.white, fontSize: 16, ...FONTS.bold },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  avatarOption: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.swan },
  avatarOptionActive: { borderColor: COLORS.primary, borderWidth: 3, backgroundColor: COLORS.primaryBg },
  avatarOptionText: { fontSize: 28 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.polar },
  infoLabel: { fontSize: 14, color: COLORS.wolf, ...FONTS.medium },
  infoValue: { fontSize: 14, color: COLORS.owl, ...FONTS.semiBold },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.polar },
  settingLabel: { fontSize: 15, color: COLORS.eel, ...FONTS.medium },
  settingValue: { fontSize: 14, color: COLORS.wolf, ...FONTS.regular },
  helpText: { fontSize: 14, color: COLORS.eel, lineHeight: 22, marginBottom: 8 },
});
