import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useUser, useAuth } from '../hooks';

const ShopScreen: React.FC = () => {
  const { user, spendGems, refillHearts } = useUser();
  const [showPremium, setShowPremium] = useState(false);

  if (!user) return null;

  const handleRefillHearts = () => {
    if (user.hearts >= user.maxHearts) {
      Alert.alert('Canların Dolu', 'Zaten tüm canların dolu!');
      return;
    }
    if (user.gems < 350) {
      Alert.alert('Yetersiz Elmas', 'Can doldurmak için 350 elmas gerekli.');
      return;
    }
    Alert.alert('Can Doldur', '350 💎 harcayarak canlarını doldurmak ister misin?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Doldur', onPress: async () => { await refillHearts(); Alert.alert('Tamamlandı', 'Canların dolduruldu!'); } },
    ]);
  };

  const handleBuyItem = async (name: string, price: number) => {
    if (price === 0) {
      Alert.alert('Başla!', `${name} açıldı!`);
      return;
    }
    if (user.gems < price) {
      Alert.alert('Yetersiz Elmas', `Bu öğe için ${price} elmas gerekli.`);
      return;
    }
    Alert.alert('Satın Al', `${name} için ${price} 💎 harcamak ister misin?`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Satın Al',
        onPress: async () => {
          const success = await spendGems(price);
          if (success) Alert.alert('Tebrikler!', `${name} satın alındı!`);
          else Alert.alert('Hata', 'Bir sorun oluştu.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mağaza</Text>
        <View style={styles.gemsBadge}>
          <Text style={styles.gemsIcon}>💎</Text>
          <Text style={styles.gemsCount}>{user.gems}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Canlar */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>❤️ Canlar</Text>
            <View style={styles.heartStatus}>
              <Text style={styles.heartStatusText}>{user.hearts}/{user.maxHearts}</Text>
            </View>
          </View>
          <View style={styles.heartsCard}>
            <View style={styles.heartsRow}>
              {Array.from({ length: user.maxHearts }).map((_, i) => (
                <Text key={i} style={styles.heartBig}>{i < user.hearts ? '❤️' : '🤍'}</Text>
              ))}
            </View>
            {user.hearts < user.maxHearts ? (
              <TouchableOpacity style={styles.refillButton} onPress={handleRefillHearts}>
                <Text style={styles.refillButtonText}>DOLDUR</Text>
                <View style={styles.priceTag}>
                  <Text style={styles.priceIcon}>💎</Text>
                  <Text style={styles.priceText}>350</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.fullHeartsTag}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                <Text style={styles.fullHeartsText}>Canların dolu!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Guclendiriciler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Güçlendiriciler</Text>
          <View style={styles.shopGrid}>
            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem('Streak Dondur', 200)}>
              <View style={styles.shopCardIconBg}><Text style={styles.shopCardIcon}>🛡️</Text></View>
              <Text style={styles.shopCardName}>Streak Dondur</Text>
              <Text style={styles.shopCardDesc}>Serini 1 gün koru</Text>
              <View style={styles.gemPrice}><Text style={styles.gemPriceIcon}>💎</Text><Text style={styles.gemPriceText}>200</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem('2x XP Boost', 100)}>
              <View style={styles.shopCardIconBg}><Text style={styles.shopCardIcon}>⚡</Text></View>
              <Text style={styles.shopCardName}>2x XP Boost</Text>
              <Text style={styles.shopCardDesc}>15 dakika 2x XP kazan</Text>
              <View style={styles.gemPrice}><Text style={styles.gemPriceIcon}>💎</Text><Text style={styles.gemPriceText}>100</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem('Zamanlı Meydan Okuma', 0)}>
              <View style={styles.shopCardIconBg}><Text style={styles.shopCardIcon}>⏱️</Text></View>
              <Text style={styles.shopCardName}>Meydan Okuma</Text>
              <Text style={styles.shopCardDesc}>2 dakikada XP topla</Text>
              <View style={styles.freeTag}><Text style={styles.freeTagText}>ÜCRETSİZ</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Premium */}
        <TouchableOpacity style={styles.premiumCard} onPress={() => setShowPremium(true)} activeOpacity={0.9}>
          <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>SUPER</Text></View>
          <Text style={styles.premiumTitle}>LinguaLeap Super</Text>
          <Text style={styles.premiumDesc}>Sınırsız can, reklamsız deneyim ve özel dersler.</Text>
          <TouchableOpacity style={styles.premiumButton} onPress={() => setShowPremium(true)}>
            <Text style={styles.premiumButtonText}>14 GÜN ÜCRETSİZ DENE</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Premium Modal */}
      <Modal visible={showPremium} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModalContent}>
            <View style={styles.premiumModalHeader}>
              <Text style={styles.premiumModalEmoji}>👑</Text>
              <Text style={styles.premiumModalTitle}>LinguaLeap Super</Text>
              <Text style={styles.premiumModalSub}>Öğrenme deneyimini bir üst seviyeye taşı</Text>
            </View>

            <View style={styles.premiumFeaturesList}>
              {[
                { icon: '❤️', title: 'Sınırsız Can', desc: 'Hata yapma korkusu olmadan öğren' },
                { icon: '🚫', title: 'Reklamsız', desc: 'Kesintisiz öğrenme deneyimi' },
                { icon: '📚', title: 'Özel Dersler', desc: 'Sadece Super üyelere özel içerikler' },
                { icon: '⚡', title: '2x XP', desc: 'Her dersten 2 kat XP kazan' },
                { icon: '🛡️', title: 'Streak Koruması', desc: 'Aylık 2 ücretsiz streak dondurma' },
                { icon: '🎯', title: 'Hatasız Pratik', desc: 'Sınırsız pratik modu' },
              ].map((f, i) => (
                <View key={i} style={styles.premiumFeatureItem}>
                  <Text style={styles.premiumFeatureIcon}>{f.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumFeatureTitle}>{f.title}</Text>
                    <Text style={styles.premiumFeatureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.premiumCTA} onPress={() => { setShowPremium(false); Alert.alert('Teşekkürler!', '14 günlük deneme süreniz başladı. (Demo)'); }}>
              <Text style={styles.premiumCTAText}>14 GÜN ÜCRETSİZ BAŞLA</Text>
              <Text style={styles.premiumCTASub}>Sonra aylık ₺79,99</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.premiumSkip} onPress={() => setShowPremium(false)}>
              <Text style={styles.premiumSkipText}>Şimdilik geç</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 16, paddingHorizontal: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.swan },
  headerTitle: { fontSize: 20, color: COLORS.owl, ...FONTS.bold },
  gemsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F4FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4 },
  gemsIcon: { fontSize: 16 },
  gemsCount: { fontSize: 15, color: COLORS.blue, ...FONTS.bold },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: COLORS.owl, ...FONTS.bold, marginBottom: 12 },
  heartStatus: { backgroundColor: '#FFE0E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  heartStatusText: { fontSize: 13, color: COLORS.red, ...FONTS.bold },
  heartsCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan },
  heartsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  heartBig: { fontSize: 32 },
  refillButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, gap: 10, borderBottomWidth: 4, borderBottomColor: COLORS.redDark },
  refillButtonText: { fontSize: 15, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 3 },
  priceIcon: { fontSize: 12 },
  priceText: { fontSize: 13, color: COLORS.white, ...FONTS.bold },
  fullHeartsTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fullHeartsText: { fontSize: 14, color: COLORS.primary, ...FONTS.semiBold },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shopCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: COLORS.swan, alignItems: 'center', flexGrow: 1 },
  shopCardIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  shopCardIcon: { fontSize: 28 },
  shopCardName: { fontSize: 15, color: COLORS.owl, ...FONTS.bold, textAlign: 'center' },
  shopCardDesc: { fontSize: 12, color: COLORS.wolf, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  gemPrice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F4FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4 },
  gemPriceIcon: { fontSize: 14 },
  gemPriceText: { fontSize: 14, color: COLORS.blue, ...FONTS.bold },
  freeTag: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  freeTagText: { fontSize: 12, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCard: { backgroundColor: '#1A1A2E', borderRadius: 24, padding: 24, alignItems: 'center' },
  premiumBadge: { backgroundColor: COLORS.accent, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, marginBottom: 12 },
  premiumBadgeText: { fontSize: 13, color: COLORS.white, ...FONTS.bold, letterSpacing: 2 },
  premiumTitle: { fontSize: 24, color: COLORS.white, ...FONTS.bold, marginBottom: 8 },
  premiumDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 20 },
  premiumButton: { backgroundColor: COLORS.accent, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 16, borderBottomWidth: 4, borderBottomColor: '#CC7A00', width: '100%', alignItems: 'center' },
  premiumButtonText: { fontSize: 16, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  premiumModalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '90%' },
  premiumModalHeader: { alignItems: 'center', marginBottom: 24 },
  premiumModalEmoji: { fontSize: 48, marginBottom: 8 },
  premiumModalTitle: { fontSize: 26, color: COLORS.owl, ...FONTS.bold },
  premiumModalSub: { fontSize: 14, color: COLORS.wolf, marginTop: 4, textAlign: 'center' },
  premiumFeaturesList: { gap: 16, marginBottom: 24 },
  premiumFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  premiumFeatureIcon: { fontSize: 28 },
  premiumFeatureTitle: { fontSize: 15, color: COLORS.owl, ...FONTS.bold },
  premiumFeatureDesc: { fontSize: 12, color: COLORS.wolf, marginTop: 2 },
  premiumCTA: { backgroundColor: COLORS.accent, borderRadius: 16, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#CC7A00' },
  premiumCTAText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  premiumSkip: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  premiumSkipText: { fontSize: 15, color: COLORS.wolf, ...FONTS.medium },
});
