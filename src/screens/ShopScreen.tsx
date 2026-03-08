import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme/colors';
import { useUser, useLanguage } from '../hooks';

const ShopScreen: React.FC = () => {
  const { user, spendGems, refillHearts } = useUser();
  const [showPremium, setShowPremium] = useState(false);
  const { t, tx } = useLanguage();

  if (!user) return null;

  const handleRefillHearts = () => {
    if (user.hearts >= user.maxHearts) {
      Alert.alert(tx('Canlarin dolu!'), tx('Canlarin dolu!'));
      return;
    }

    if (user.gems < 350) {
      Alert.alert(tx('Yetersiz Elmas'), tx('Can doldurmak icin 350 elmas gerekli.'));
      return;
    }

    Alert.alert(tx('Can Doldur'), tx('350 gem harcayarak canlarini doldurmak ister misin?'), [
      { text: tx('Vazgec'), style: 'cancel' },
      {
        text: tx('Doldur'),
        onPress: async () => {
          await refillHearts();
          Alert.alert(tx('Tamamlandi'), tx('Canlarin dolduruldu!'));
        },
      },
    ]);
  };

  const handleBuyItem = async (name: string, price: number) => {
    if (price === 0) {
      Alert.alert(tx('Basla!'), `${name} ${tx('acildi!')}`);
      return;
    }

    if (user.gems < price) {
      Alert.alert(tx('Yetersiz Elmas'), `${tx('Bu oge icin')} ${price} ${tx('elmas gerekli.')}`);
      return;
    }

    Alert.alert(tx('Satin Al'), `${name} ${tx('icin')} ${price} ${tx('harcamak ister misin?')}`, [
      { text: tx('Vazgec'), style: 'cancel' },
      {
        text: tx('Satin Al'),
        onPress: async () => {
          const success = await spendGems(price);
          if (success) Alert.alert(tx('Tebrikler!'), `${name} ${tx('satin alindi!')}`);
          else Alert.alert(tx('Hata'), tx('Bir sorun olustu.'));
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('shop.title')}</Text>
        <View style={styles.gemsBadge}>
          <Ionicons name="diamond" size={16} color={COLORS.blue} />
          <Text style={styles.gemsCount}>{user.gems}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.heartsTitleWrap}><Ionicons name="heart" size={18} color={COLORS.red} /><Text style={styles.sectionTitle}>{tx('Canlar')}</Text></View>
            <View style={styles.heartStatus}>
              <Text style={styles.heartStatusText}>{user.hearts}/{user.maxHearts}</Text>
            </View>
          </View>

          <View style={styles.heartsCard}>
            <View style={styles.heartsRow}>
              {Array.from({ length: user.maxHearts }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < user.hearts ? 'heart' : 'heart-outline'}
                  size={28}
                  color={i < user.hearts ? COLORS.red : COLORS.hare}
                />
              ))}
            </View>

            {user.hearts < user.maxHearts ? (
              <TouchableOpacity style={styles.refillButton} onPress={handleRefillHearts}>
                <Text style={styles.refillButtonText}>{tx('Doldur')}</Text>
                <View style={styles.priceTag}>
                  <Ionicons name="diamond" size={12} color={COLORS.white} />
                  <Text style={styles.priceText}>350</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.fullHeartsTag}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                <Text style={styles.fullHeartsText}>{tx('Canlarin dolu!')}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.shopTitleRow}>
            <Ionicons name="flash" size={22} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>{t('shop.boosters')}</Text>
          </View>

          <View style={styles.shopGrid}>
            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem(tx('Streak Dondur'), 200)}>
              <View style={styles.shopCardIconBg}><Ionicons name="shield-half" size={28} color={COLORS.red} /></View>
              <Text style={styles.shopCardName}>{tx('Streak Dondur')}</Text>
              <Text style={styles.shopCardDesc}>{tx('Serini 1 gun koru')}</Text>
              <View style={styles.gemPrice}><Ionicons name="diamond" size={14} color={COLORS.blue} /><Text style={styles.gemPriceText}>200</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem('2x XP Boost', 100)}>
              <View style={styles.shopCardIconBg}><Ionicons name="flash" size={28} color={COLORS.accent} /></View>
              <Text style={styles.shopCardName}>2x XP Boost</Text>
              <Text style={styles.shopCardDesc}>{tx('15 dakika 2x XP kazan')}</Text>
              <View style={styles.gemPrice}><Ionicons name="diamond" size={14} color={COLORS.blue} /><Text style={styles.gemPriceText}>100</Text></View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shopCard} onPress={() => handleBuyItem(tx('Meydan Okuma'), 0)}>
              <View style={styles.shopCardIconBg}><Ionicons name="timer-outline" size={28} color={COLORS.eel} /></View>
              <Text style={styles.shopCardName}>{tx('Meydan Okuma')}</Text>
              <Text style={styles.shopCardDesc}>{tx('2 dakikada XP topla')}</Text>
              <View style={styles.freeTag}><Text style={styles.freeTagText}>{tx('UCRETSIZ')}</Text></View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.premiumCard} onPress={() => setShowPremium(true)} activeOpacity={0.9}>
          <View style={styles.premiumBadge}><Text style={styles.premiumBadgeText}>{tx('SUPER')}</Text></View>
          <Text style={styles.premiumTitle}>LinguaLeap Super</Text>
          <Text style={styles.premiumDesc}>{tx('Sinirsiz can, reklamsiz deneyim ve ozel dersler.')}</Text>
          <TouchableOpacity style={styles.premiumButton} onPress={() => setShowPremium(true)}>
            <Text style={styles.premiumButtonText}>{tx('14 GUN UCRETSIZ DENE')}</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={showPremium} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.premiumModalContent}>
            <View style={styles.premiumModalHeader}>
              <Ionicons name="star" size={42} color={COLORS.accent} />
              <Text style={styles.premiumModalTitle}>LinguaLeap Super</Text>
              <Text style={styles.premiumModalSub}>{tx('Ogrenme deneyimini bir ust seviyeye tasi')}</Text>
            </View>

            <View style={styles.premiumFeaturesList}>
              {[
                { icon: 'heart', title: tx('Sinirsiz Can'), desc: tx('Hata yapma korkusu olmadan ogren') },
                { icon: 'ban', title: tx('Reklamsiz'), desc: tx('Kesintisiz ogrenme deneyimi') },
                { icon: 'book', title: tx('Ozel Dersler'), desc: tx('Sadece Super uyelere ozel icerikler') },
                { icon: 'flash', title: '2x XP', desc: tx('Her dersten 2 kat XP kazan') },
                { icon: 'shield-half', title: tx('Streak Korumasi'), desc: tx('Aylik 2 ucretsiz streak dondurma') },
                { icon: 'checkmark-done', title: tx('Hatasiz Pratik'), desc: tx('Sinirsiz pratik modu') },
              ].map((f, i) => (
                <View key={i} style={styles.premiumFeatureItem}>
                  <Ionicons name={f.icon as any} size={26} color={COLORS.eel} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumFeatureTitle}>{f.title}</Text>
                    <Text style={styles.premiumFeatureDesc}>{f.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.premiumCTA}
              onPress={() => {
                setShowPremium(false);
                Alert.alert(tx('Tesekkurler!'), tx('14 gunluk deneme sureniz basladi. (Demo)'));
              }}
            >
              <Text style={styles.premiumCTAText}>{tx('14 GUN UCRETSIZ BASLA')}</Text>
              <Text style={styles.premiumCTASub}>{tx('Sonra aylik 79.99')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.premiumSkip} onPress={() => setShowPremium(false)}>
              <Text style={styles.premiumSkipText}>{tx('Simdilik gec')}</Text>
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
  gemsCount: { fontSize: 15, color: COLORS.blue, ...FONTS.bold },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: COLORS.owl, ...FONTS.bold, marginBottom: 12 },
  shopTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  heartsTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heartStatus: { backgroundColor: '#FFE0E0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 12 },
  heartStatusText: { fontSize: 13, color: COLORS.red, ...FONTS.bold },
  heartsCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 2, borderColor: COLORS.swan },
  heartsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  refillButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.red, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, gap: 10, borderBottomWidth: 4, borderBottomColor: COLORS.redDark },
  refillButtonText: { fontSize: 15, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  priceTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, gap: 3 },
  priceText: { fontSize: 13, color: COLORS.white, ...FONTS.bold },
  fullHeartsTag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fullHeartsText: { fontSize: 14, color: COLORS.primary, ...FONTS.semiBold },
  shopGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  shopCard: { width: '48%', backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 2, borderColor: COLORS.swan, alignItems: 'center', flexGrow: 1 },
  shopCardIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.snow, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  shopCardName: { fontSize: 15, color: COLORS.owl, ...FONTS.bold, textAlign: 'center' },
  shopCardDesc: { fontSize: 12, color: COLORS.wolf, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  gemPrice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F4FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 4 },
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
  premiumModalTitle: { fontSize: 26, color: COLORS.owl, ...FONTS.bold },
  premiumModalSub: { fontSize: 14, color: COLORS.wolf, marginTop: 4, textAlign: 'center' },
  premiumFeaturesList: { gap: 16, marginBottom: 24 },
  premiumFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  premiumFeatureTitle: { fontSize: 15, color: COLORS.owl, ...FONTS.bold },
  premiumFeatureDesc: { fontSize: 12, color: COLORS.wolf, marginTop: 2 },
  premiumCTA: { backgroundColor: COLORS.accent, borderRadius: 16, padding: 18, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#CC7A00' },
  premiumCTAText: { fontSize: 17, color: COLORS.white, ...FONTS.bold, letterSpacing: 1 },
  premiumCTASub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  premiumSkip: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  premiumSkipText: { fontSize: 15, color: COLORS.wolf, ...FONTS.medium },
});

