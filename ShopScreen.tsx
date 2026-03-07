import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../theme/colors';
import { SHOP_ITEMS, USER_PROFILE } from '../data/mockData';

export default function ShopScreen() {
  const handlePurchase = (item) => {
    if (item.currency === 'free') {
      Alert.alert('Başla!', `${item.name} açıldı!`);
    } else if (USER_PROFILE.gems >= item.price) {
      Alert.alert('Satın Al', `${item.name} için ${item.price} 💎 harcamak ister misin?`, [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Satın Al', onPress: () => Alert.alert('Tebrikler!', `${item.name} satın alındı!`) },
      ]);
    } else {
      Alert.alert('Yetersiz', 'Yeterli elmasın yok!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mağaza</Text>
        <View style={styles.gemsBadge}>
          <Text style={styles.gemsIcon}>💎</Text>
          <Text style={styles.gemsCount}>{USER_PROFILE.gems}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hearts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>❤️ Canlar</Text>
            <View style={styles.heartStatus}>
              <Text style={styles.heartStatusText}>
                {USER_PROFILE.hearts}/{USER_PROFILE.maxHearts}
              </Text>
            </View>
          </View>

          <View style={styles.heartsCard}>
            <View style={styles.heartsRow}>
              {Array.from({ length: USER_PROFILE.maxHearts }).map((_, i) => (
                <Text key={i} style={styles.heartBig}>
                  {i < USER_PROFILE.hearts ? '❤️' : '🤍'}
                </Text>
              ))}
            </View>
            {USER_PROFILE.hearts < USER_PROFILE.maxHearts ? (
              <TouchableOpacity
                style={styles.refillButton}
                onPress={() => handlePurchase(SHOP_ITEMS[0])}
              >
                <Text style={styles.refillButtonText}>DOLDUR</Text>
                <View style={styles.priceTag}>
                  <Text style={styles.priceIcon}>💎</Text>
                  <Text style={styles.priceText}>{SHOP_ITEMS[0].price}</Text>
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

        {/* Power-ups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Güçlendiriciler</Text>
          <View style={styles.shopGrid}>
            {SHOP_ITEMS.slice(1).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.shopCard}
                onPress={() => handlePurchase(item)}
                activeOpacity={0.7}
              >
                <View style={styles.shopCardIconBg}>
                  <Text style={styles.shopCardIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.shopCardName}>{item.name}</Text>
                <Text style={styles.shopCardDesc}>{item.description}</Text>

                <View style={styles.shopCardPrice}>
                  {item.currency === 'free' ? (
                    <View style={styles.freeTag}>
                      <Text style={styles.freeTagText}>ÜCRETSİZ</Text>
                    </View>
                  ) : (
                    <View style={styles.gemPrice}>
                      <Text style={styles.gemPriceIcon}>💎</Text>
                      <Text style={styles.gemPriceText}>{item.price}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Premium Section */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>SUPER</Text>
          </View>
          <Text style={styles.premiumTitle}>LinguaLeap Super</Text>
          <Text style={styles.premiumDesc}>
            Sınırsız can, reklamsız deneyim ve özel dersler.
          </Text>

          <View style={styles.premiumFeatures}>
            {[
              '🚫 Reklam yok',
              '❤️ Sınırsız can',
              '📚 Özel dersler',
              '⚡ 2x XP her zaman',
            ].map((feature, i) => (
              <View key={i} style={styles.premiumFeatureRow}>
                <Text style={styles.premiumFeatureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>14 GÜN ÜCRETSİZ DENE</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.swan,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.owl,
    ...FONTS.bold,
  },
  gemsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueLight + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  gemsIcon: {
    fontSize: 16,
  },
  gemsCount: {
    fontSize: 15,
    color: COLORS.blue,
    ...FONTS.bold,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.owl,
    ...FONTS.bold,
    marginBottom: 12,
  },
  heartStatus: {
    backgroundColor: COLORS.redLight + '30',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  heartStatusText: {
    fontSize: 13,
    color: COLORS.red,
    ...FONTS.bold,
  },
  heartsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.swan,
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  heartBig: {
    fontSize: 32,
  },
  refillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.redDark,
  },
  refillButtonText: {
    fontSize: 15,
    color: COLORS.white,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  priceIcon: {
    fontSize: 12,
  },
  priceText: {
    fontSize: 13,
    color: COLORS.white,
    ...FONTS.bold,
  },
  fullHeartsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fullHeartsText: {
    fontSize: 14,
    color: COLORS.primary,
    ...FONTS.semiBold,
  },
  shopGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  shopCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.swan,
    alignItems: 'center',
    flexGrow: 1,
  },
  shopCardIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.snow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  shopCardIcon: {
    fontSize: 28,
  },
  shopCardName: {
    fontSize: 15,
    color: COLORS.owl,
    ...FONTS.bold,
    textAlign: 'center',
  },
  shopCardDesc: {
    fontSize: 12,
    color: COLORS.wolf,
    ...FONTS.regular,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  shopCardPrice: {
    marginTop: 'auto',
  },
  freeTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  freeTagText: {
    fontSize: 12,
    color: COLORS.white,
    ...FONTS.bold,
    letterSpacing: 1,
  },
  gemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blueLight + '25',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  gemPriceIcon: {
    fontSize: 14,
  },
  gemPriceText: {
    fontSize: 14,
    color: COLORS.blue,
    ...FONTS.bold,
  },
  premiumCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  premiumBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  premiumBadgeText: {
    fontSize: 13,
    color: COLORS.white,
    ...FONTS.bold,
    letterSpacing: 2,
  },
  premiumTitle: {
    fontSize: 24,
    color: COLORS.white,
    ...FONTS.bold,
    marginBottom: 8,
  },
  premiumDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    ...FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  premiumFeatures: {
    width: '100%',
    gap: 10,
    marginBottom: 24,
  },
  premiumFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumFeatureText: {
    fontSize: 15,
    color: COLORS.white,
    ...FONTS.medium,
  },
  premiumButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: COLORS.accentDark,
    width: '100%',
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    color: COLORS.white,
    ...FONTS.bold,
    letterSpacing: 1,
  },
});
